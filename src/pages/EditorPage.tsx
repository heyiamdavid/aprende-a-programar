import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Terminal, BookOpen, Sparkles, GripHorizontal, User } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { getCodeReview } from '../lib/groq';
import { CHALLENGES, type Challenge } from '../data/challenges';
import ProfileModal from '../components/ProfileModal';

declare global {
  interface Window {
    loadPyodide: (options: { indexURL: string }) => Promise<any>;
    __requestInput: (prompt: string) => Promise<string>;
  }
}

const userButtonAppearance = {
  variables: {
    colorBackground: '#0f172a',
    colorText: '#f8fafc',
    colorTextSecondary: '#94a3b8',
    colorPrimary: '#3b82f6',
    borderRadius: '10px',
  },
  elements: {
    userButtonPopoverCard: {
      background: 'rgba(15,23,42,0.98)',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
      color: '#f8fafc',
    },
    userButtonPopoverActionButton: { color: '#f8fafc' },
    userButtonPopoverActionButtonText: { color: '#f8fafc' },
    userButtonPopoverFooter: { background: 'rgba(15,23,42,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)' },
    userButtonPopoverFooterPages: { color: '#94a3b8' },
    userPreviewMainIdentifier: { color: '#f8fafc' },
    userPreviewSecondaryIdentifier: { color: '#94a3b8' },
  },
};

export default function EditorPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in');
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Active challenge persisted in localStorage
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(() => {
    const savedId = localStorage.getItem('active_challenge_id');
    if (savedId) {
      const found = CHALLENGES.find((c) => c.id === Number(savedId));
      if (found) return found;
    }
    return CHALLENGES[0];
  });

  const [code, setCode] = useState<string>(() => {
    const savedCode = localStorage.getItem(`code_challenge_${selectedChallenge.id}`);
    return savedCode !== null ? savedCode : selectedChallenge.initialCode;
  });

  const [output, setOutput] = useState<string>('Salida de consola...');
  const [isReviewing, setIsReviewing] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(200);
  const [showProfile, setShowProfile] = useState(false);

  const pyodideRef = useRef<any>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(200);

  // Initialize Pyodide
  useEffect(() => {
    if (!isSignedIn) return;
    let isMounted = true;

    async function initPyodide() {
      setOutput('Cargando entorno Python (Pyodide)...\n');
      if (!window.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Fallo al cargar script de Pyodide'));
          document.head.appendChild(script);
        });
      }
      if (!isMounted) return;
      try {
        const pyodide = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.25.0/full/' });
        if (!isMounted) return;

        pyodideRef.current = pyodide;
        setPyodideReady(true);
        setOutput('¡Entorno listo! Escribe tu código y presiona Ejecutar.\n');
      } catch (err: any) {
        if (isMounted) setOutput(`Error inicializando Pyodide: ${err.message ?? err}`);
      }
    }

    initPyodide();
    return () => { isMounted = false; };
  }, [isSignedIn]);

  // Code change + persistence
  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode ?? '';
    setCode(val);
    localStorage.setItem(`code_challenge_${selectedChallenge.id}`, val);
  };

  // Challenge selection + restore code
  const handleSelectChallenge = (ch: Challenge) => {
    setSelectedChallenge(ch);
    localStorage.setItem('active_challenge_id', ch.id.toString());
    const saved = localStorage.getItem(`code_challenge_${ch.id}`);
    setCode(saved !== null ? saved : ch.initialCode);
    setOutput(`Cargado: ${ch.title}\n`);
  };

  // Resizable terminal
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = consoleHeight;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const delta = startYRef.current - e.clientY;
    setConsoleHeight(Math.max(100, Math.min(500, startHeightRef.current + delta)));
  }, []);
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  // Run code
  const handleRunCode = async () => {
    if (!pyodideReady || !pyodideRef.current) return;
    setOutput('');

    pyodideRef.current.setStdout({ batched: (msg: string) => setOutput((p) => p + msg + '\n') });
    pyodideRef.current.setStderr({ batched: (msg: string) => setOutput((p) => p + '[Error] ' + msg + '\n') });
    pyodideRef.current.setStdin({
      stdin: () => {
        const result = window.prompt('Entrada para Python input():');
        return result !== null ? result : '';
      },
    });

    try {
      await pyodideRef.current.runPythonAsync(code);
    } catch (err: any) {
      setOutput((p) => p + `\n${err}`);
    }
  };

  // AI Review
  const handleReviewCode = async () => {
    setIsReviewing(true);
    setOutput('🤖 La IA está revisando tu código...\n');
    try {
      const review = await getCodeReview(code, selectedChallenge.title);
      setOutput(`[Revisión de IA]:\n\n${review}`);
    } catch (e: any) {
      setOutput(`Error en la revisión: ${e.message ?? e}`);
    } finally {
      setIsReviewing(false);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-darker)' }}>
      {/* Sidebar */}
      <aside className="solid-panel" style={{ width: '300px', margin: '16px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Ruta de Python</h2>
        </div>

        <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CHALLENGES.map((ch) => {
            const isActive = ch.id === selectedChallenge.id;
            const isDone = localStorage.getItem(`done_challenge_${ch.id}`) === 'true';
            const hasSaved = localStorage.getItem(`code_challenge_${ch.id}`) !== null;
            return (
              <div
                key={ch.id}
                onClick={() => handleSelectChallenge(ch)}
                style={{
                  padding: '12px 14px', borderRadius: '12px', cursor: 'pointer',
                  background: isActive ? 'var(--bg-hover)' : 'transparent',
                  border: `2px solid ${isActive ? 'var(--accent-primary)' : 'transparent'}`,
                  transition: 'all 0.1s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, flex: 1 }}>{ch.title}</span>
                  {isDone && <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginLeft: '8px' }} />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                    {ch.category}
                  </span>
                  {hasSaved && !isDone && (
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>En progreso</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* User profile footer */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserButton appearance={userButtonAppearance} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.firstName ?? user?.username ?? 'Estudiante'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.primaryEmailAddress?.emailAddress}
            </div>
          </div>
          <button
            onClick={() => setShowProfile(true)}
            title="Ver perfil"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <User size={16} />
          </button>
        </div>
      </aside>

      {/* Main area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '16px 16px 16px 0', gap: '12px', minWidth: 0 }}>
        {/* Challenge instructions */}
        <div className="solid-panel" style={{ padding: '20px 24px' }}>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '1.3rem', color: 'var(--accent-primary)' }}>{selectedChallenge.title}</h1>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.93rem' }}>
            {selectedChallenge.description}
          </p>
        </div>

        {/* Editor */}
        <div className="solid-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>main.py</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleReviewCode}
                disabled={isReviewing}
                className="btn-chunky btn-primary"
              >
                <Sparkles size={18} />
                {isReviewing ? 'Revisando...' : 'Revisión IA'}
              </button>
              <button
                onClick={handleRunCode}
                className="btn-chunky btn-success"
              >
                <Play size={18} fill="white" />
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
              options={{ minimap: { enabled: false }, fontSize: 15, fontFamily: 'var(--font-mono)', padding: { top: 12 } }}
            />
          </div>
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          style={{ height: '8px', cursor: 'ns-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', userSelect: 'none' }}
        >
          <GripHorizontal size={14} color="var(--text-secondary)" />
        </div>

        {/* Console */}
        <div className="solid-panel" style={{ height: `${consoleHeight}px`, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '8px 16px', borderBottom: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={16} color="var(--text-secondary)" />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Consola</span>
          </div>
          <div style={{ flex: 1, padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.88rem', overflowY: 'auto', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
            {output}
          </div>
        </div>
      </main>

      {/* Profile Modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}
