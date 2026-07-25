import { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle, Terminal, BookOpen, Sparkles, GripHorizontal, Lock } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { getCodeReview } from './lib/groq';
import { CHALLENGES, type Challenge } from './data/challenges';

declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<any>;
  }
}

function App() {
  // Persistence: Load active challenge ID from localStorage
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(() => {
    const savedId = localStorage.getItem('active_challenge_id');
    if (savedId) {
      const found = CHALLENGES.find(c => c.id === Number(savedId));
      if (found) return found;
    }
    return CHALLENGES[0];
  });

  // Persistence: Load code for active challenge from localStorage
  const [code, setCode] = useState<string>(() => {
    const savedCode = localStorage.getItem(`code_challenge_${selectedChallenge.id}`);
    return savedCode !== null ? savedCode : selectedChallenge.initialCode;
  });

  const [output, setOutput] = useState<string>('Salida de consola...');
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [pyodideReady, setPyodideReady] = useState<boolean>(false);
  
  // Resizable console height (in pixels)
  const [consoleHeight, setConsoleHeight] = useState<number>(200);
  const isDraggingRef = useRef<boolean>(false);
  const startYRef = useRef<number>(0);
  const startHeightRef = useRef<number>(200);

  const pyodideRef = useRef<any>(null);
  const { user } = useUser();

  // Save code changes to localStorage
  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode || '';
    setCode(val);
    localStorage.setItem(`code_challenge_${selectedChallenge.id}`, val);
  };

  // Switch challenge and restore code
  const handleSelectChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    localStorage.setItem('active_challenge_id', challenge.id.toString());
    const savedCode = localStorage.getItem(`code_challenge_${challenge.id}`);
    setCode(savedCode !== null ? savedCode : challenge.initialCode);
    setOutput(`Cargado reto: ${challenge.title}\n`);
  };

  // Initialize Pyodide
  useEffect(() => {
    let isMounted = true;
    
    async function initPyodide() {
      setOutput('Cargando entorno Python (Pyodide)...\n');
      
      if (!window.loadPyodide) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";
          script.onload = resolve;
          script.onerror = () => reject(new Error("Fallo al cargar script de Pyodide"));
          document.head.appendChild(script);
        });
      }

      if (!isMounted) return;

      try {
        const pyodide = await window.loadPyodide({
          indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
        });

        if (isMounted) {
          pyodideRef.current = pyodide;

          // Configure stdin to support input() seamlessly
          pyodide.setStdin({
            stdin: () => {
              const result = window.prompt("Python input():");
              return result !== null ? result + "\n" : "\n";
            }
          });

          setPyodideReady(true);
          setOutput('¡Entorno listo! Escribe tu código y presiona Ejecutar.\n');
        }
      } catch (err: any) {
        if (isMounted) setOutput(`Error inicializando Pyodide: ${err.message || err}`);
      }
    }
    
    initPyodide();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Dragging for Terminal Resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = consoleHeight;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaY = startYRef.current - e.clientY;
    const newHeight = Math.max(100, Math.min(500, startHeightRef.current + deltaY));
    setConsoleHeight(newHeight);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Run Code with Pyodide
  const handleRunCode = async () => {
    if (!pyodideReady || !pyodideRef.current) return;
    
    setOutput('');
    let currentOutput = '';
    
    pyodideRef.current.setStdout({
      batched: (msg: string) => {
        currentOutput += msg + '\n';
        setOutput(currentOutput);
      }
    });

    pyodideRef.current.setStderr({
      batched: (msg: string) => {
        currentOutput += '[Error] ' + msg + '\n';
        setOutput(currentOutput);
      }
    });

    try {
      await pyodideRef.current.runPythonAsync(code);
      if (!currentOutput) {
        setOutput('Código ejecutado sin salida.');
      }
    } catch (err: any) {
      currentOutput += `\n${err}`;
      setOutput(currentOutput);
    }
  };

  // Request Groq AI Review
  const handleReviewCode = async () => {
    setIsReviewing(true);
    setOutput('🤖 La IA está revisando tu código...\n');
    try {
      const review = await getCodeReview(code, selectedChallenge.title);
      setOutput(`[Revisión de IA]:\n\n${review}`);
    } catch (e: any) {
      setOutput(`Error en la revisión: ${e.message || e}`);
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-darker)' }}>
      {/* If Signed Out, show forced Login Screen */}
      <SignedOut>
        <div style={{
          display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          height: '100vh', width: '100vw', background: 'var(--bg-darker)', color: '#fff', textAlign: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '40px', maxWidth: '450px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <div style={{ padding: '16px', background: 'var(--accent-glow)', borderRadius: '50%' }}>
              <Lock size={32} color="var(--accent-primary)" />
            </div>
            <h1 style={{ fontSize: '1.8rem', margin: 0 }}>Aprende a Programar</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
              Inicia sesión para acceder a la plataforma, resolver retos interativos en Python y guardar tu progreso.
            </p>
            <SignInButton mode="modal">
              <button style={{
                background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '12px 24px',
                borderRadius: '8px', cursor: 'pointer', width: '100%', fontWeight: 600, fontSize: '1rem',
                boxShadow: '0 4px 12px var(--accent-glow)'
              }}>
                Iniciar Sesión / Registrarse
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      {/* If Signed In, show full App */}
      <SignedIn>
        {/* Sidebar - Retos */}
        <aside className="glass-panel" style={{ width: '320px', margin: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Ruta de Python</h2>
          </div>
          
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {CHALLENGES.map((ch) => {
              const isActive = ch.id === selectedChallenge.id;
              return (
                <div 
                  key={ch.id}
                  onClick={() => handleSelectChallenge(ch)}
                  className={`challenge-item ${isActive ? 'active' : ''}`} 
                  style={{ 
                    padding: '14px', 
                    borderRadius: '8px', 
                    background: isActive ? 'var(--accent-glow)' : 'rgba(255, 255, 255, 0.03)', 
                    border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '0.95rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {ch.title}
                    {isActive && <CheckCircle size={16} color="var(--accent-primary)" />}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px', marginTop: '6px', display: 'inline-block' }}>
                    {ch.category}
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserButton />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.firstName || 'Estudiante'}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Area */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '16px 16px 16px 0', gap: '12px' }}>
          
          {/* Instrucciones del Reto */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'var(--accent-primary)' }}>
              {selectedChallenge.title}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5', fontSize: '0.95rem' }}>
              {selectedChallenge.description}
            </p>
          </div>

          {/* Área del Editor */}
          <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>main.py</span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={handleReviewCode}
                  disabled={isReviewing}
                  style={{ 
                    background: 'var(--accent-primary)', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '8px 16px', 
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: isReviewing ? 'wait' : 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  <Sparkles size={16} fill="white" />
                  {isReviewing ? 'Revisando...' : 'Revisión IA'}
                </button>
                <button 
                  onClick={handleRunCode}
                  style={{ 
                    background: 'var(--success)', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '8px 16px', 
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.85rem'
                  }}
                >
                  <Play size={16} fill="white" />
                  Ejecutar
                </button>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 15,
                  fontFamily: 'var(--font-mono)',
                  padding: { top: 12 }
                }}
              />
            </div>
          </div>

          {/* Arrastrable / Resize Handle */}
          <div 
            onMouseDown={handleMouseDown}
            style={{ 
              height: '8px', 
              cursor: 'ns-resize', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '4px'
            }}
          >
            <GripHorizontal size={14} color="var(--text-secondary)" />
          </div>

          {/* Consola Redimensionable */}
          <div className="glass-panel" style={{ height: `${consoleHeight}px`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)' }}>
              <Terminal size={15} color="var(--text-secondary)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Consola de salida</span>
            </div>
            <div style={{ flex: 1, padding: '14px', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', overflowY: 'auto', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
              {output}
            </div>
          </div>

        </main>
      </SignedIn>
    </div>
  );
}

export default App;
