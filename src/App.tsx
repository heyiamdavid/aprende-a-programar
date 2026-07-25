import { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle, Terminal, BookOpen, UserCircle, Sparkles } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { getCodeReview } from './lib/groq';

// Declaration for the globally injected pyodide object
declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<any>;
  }
}

function App() {
  const [code, setCode] = useState('print("¡Hola Mundo!")');
  const [output, setOutput] = useState('Salida de consola...');
  const [isReviewing, setIsReviewing] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const pyodideRef = useRef<any>(null);
  const { user } = useUser();

  useEffect(() => {
    let isMounted = true;
    
    async function initPyodide() {
      setOutput('Cargando entorno Python (Pyodide)...\n');
      
      // Load script dynamically if not present
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
          setPyodideReady(true);
          setOutput('¡Entorno listo! Escribe tu código y presiona Ejecutar.\n');
        }
      } catch (err) {
        if (isMounted) setOutput(`Error inicializando Pyodide: ${err}`);
      }
    }
    
    initPyodide();

    return () => {
      isMounted = false;
    };
  }, []);
  
  const handleReviewCode = async () => {
    setIsReviewing(true);
    setOutput('Obteniendo revisión de IA...\n');
    try {
      const review = await getCodeReview(code, "1. Tu primer programa");
      setOutput(`[Revisión de IA]:\n\n${review}`);
    } catch (e) {
      setOutput(`Error en la revisión: ${e}`);
    } finally {
      setIsReviewing(false);
    }
  };
  
  const handleRunCode = async () => {
    if (!pyodideReady || !pyodideRef.current) return;
    
    setOutput(''); // Limpiar consola
    let currentOutput = '';
    
    // Configurar sys.stdout para capturar prints
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
    } catch (err) {
      currentOutput += `\n${err}`;
      setOutput(currentOutput);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar - Retos */}
      <aside className="glass-panel" style={{ width: '300px', margin: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Ruta de Python</h2>
        </div>
        
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <div className="challenge-item active" style={{ padding: '12px', borderRadius: '8px', background: 'var(--accent-glow)', marginBottom: '10px', cursor: 'pointer' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              1. Tu primer programa
              <CheckCircle size={18} color="var(--success)" />
            </h3>
            <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Aprende a usar la función print() para mostrar texto.
            </p>
          </div>
          
          <div className="challenge-item" style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '10px', cursor: 'pointer', opacity: 0.6 }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>2. Variables simples</h3>
          </div>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between' }}>
          <SignedOut>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
              <UserCircle />
              <SignInButton mode="modal">
                <button style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', width: '100%' }}>
                  Iniciar Sesión
                </button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserButton />
              <span style={{ fontSize: '0.9rem' }}>{user?.firstName || 'Estudiante'}</span>
            </div>
          </SignedIn>
        </div>
      </aside>

      {/* Main Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '16px 16px 16px 0', gap: '16px' }}>
        
        {/* Instrucciones del Reto */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '1.5rem', color: 'var(--accent-primary)' }}>Tu primer programa</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
            En Python, puedes mostrar mensajes en la pantalla usando la función <code>print()</code>. 
            Modifica el código de abajo para que imprima tu nombre en lugar de "¡Hola Mundo!".
          </p>
        </div>

        {/* Área del Editor y Botón */}
        <div className="glass-panel" style={{ flex: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                  transition: 'transform 0.1s',
                  opacity: isReviewing ? 0.7 : 1
                }}
                onMouseDown={(e) => !isReviewing && (e.currentTarget.style.transform = 'scale(0.95)')}
                onMouseUp={(e) => !isReviewing && (e.currentTarget.style.transform = 'scale(1)')}
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
                  transition: 'transform 0.1s'
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
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
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 16,
                fontFamily: 'var(--font-mono)',
                padding: { top: 16 }
              }}
            />
          </div>
        </div>

        {/* Consola */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)' }}>
            <Terminal size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Consola de salida</span>
          </div>
          <div style={{ flex: 1, padding: '16px', fontFamily: 'var(--font-mono)', overflowY: 'auto', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
            {output}
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;
