import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Terminal, BookOpen, Sparkles, GripHorizontal, User, Target, BrainCircuit, Layout, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import Split from 'react-split';
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
  const [lessonTab, setLessonTab] = useState<'lesson' | 'reto'>('lesson');
  type LayoutMode = 'vertical' | 'horizontal' | 'horizontal-reverse';
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('vertical');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [, setRenderTrigger] = useState(0);

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
    setLessonTab('lesson');
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
      const review = await getCodeReview(code, selectedChallenge.title, output);
      setOutput(`[Revisión de IA]:\n\n${review}`);
    } catch (e: any) {
      setOutput(`Error en la revisión: ${e.message ?? e}`);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleCompleteChallenge = () => {
    localStorage.setItem(`done_challenge_${selectedChallenge.id}`, 'true');
    setRenderTrigger(p => p + 1); // Force re-render to update sidebar checkmark
  };

  if (!isLoaded || !isSignedIn) return null;

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 8px 16px 16px', overflow: 'hidden' }}>
      <aside className="solid-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.05rem', margin: 0, flex: 1 }}>Ruta de Python</h2>
          <button
            onClick={() => navigate('/quiz')}
            title="Quiz de conocimiento"
            style={{ background: 'rgba(168,85,247,0.15)', border: '2px solid rgba(168,85,247,0.4)', borderRadius: '10px', padding: '6px 10px', cursor: 'pointer', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}
          >
            <BrainCircuit size={15} /> Quiz
          </button>
        </div>

        <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(
            CHALLENGES.reduce((acc, ch) => {
              if (!acc[ch.category]) acc[ch.category] = [];
              acc[ch.category].push(ch);
              return acc;
            }, {} as Record<string, typeof CHALLENGES>)
          ).map(([category, challenges]) => (
            <div key={category} style={{ marginBottom: '8px' }}>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', paddingLeft: '8px', fontWeight: 700 }}>
                {category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {challenges.map((ch) => {
                  const isActive = ch.id === selectedChallenge.id;
                  const isDone = localStorage.getItem(`done_challenge_${ch.id}`) === 'true';
                  const hasSaved = localStorage.getItem(`code_challenge_${ch.id}`) !== null;
                  return (
                    <div
                      key={ch.id}
                      onClick={() => handleSelectChallenge(ch)}
                      style={{
                        padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                        background: isActive ? 'var(--bg-hover)' : 'transparent',
                        border: `2px solid ${isActive ? 'var(--accent-primary)' : 'transparent'}`,
                        transition: 'all 0.1s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 500, flex: 1, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{ch.title}</span>
                        {isDone && <CheckCircle size={14} color="var(--success)" style={{ flexShrink: 0, marginLeft: '8px', marginTop: '2px' }} />}
                      </div>
                      {hasSaved && !isDone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', background: 'rgba(28,176,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>En progreso</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
    </div>
  );

  const mainContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: isSidebarOpen ? '16px 16px 16px 8px' : '16px', overflow: 'hidden', flex: 1, minWidth: 0 }}>
      <Split
            sizes={[35, 65]}
            minSize={150}
            gutterSize={10}
            direction={layoutMode.includes('horizontal') ? 'horizontal' : 'vertical'}
            style={{ display: 'flex', flexDirection: layoutMode === 'horizontal-reverse' ? 'row-reverse' : (layoutMode === 'horizontal' ? 'row' : 'column'), height: '100%' }}
          >
            {/* Top panel: Lesson + Instructions */}
            <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
              <div className="solid-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
          {/* Tab header */}
          <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', alignItems: 'center' }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title={isSidebarOpen ? "Ocultar panel lateral" : "Mostrar panel lateral"}
              style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
            >
              {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <div style={{ display: 'flex', flex: 1 }}>
              <button
                onClick={() => setLessonTab('lesson')}
                style={{
                  flex: 1, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-sans)',
                  borderBottom: lessonTab === 'lesson' ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  color: lessonTab === 'lesson' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', transition: 'color 0.15s',
                }}
              >
                <BookOpen size={15} /> Teoría y Ejemplos
              </button>
              <button
                onClick={() => setLessonTab('reto')}
                style={{
                  flex: 1, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-sans)',
                  borderBottom: lessonTab === 'reto' ? '3px solid var(--success)' : '3px solid transparent',
                  color: lessonTab === 'reto' ? 'var(--success)' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', transition: 'color 0.15s',
                }}
              >
                <Target size={15} /> Tu Reto
              </button>
            </div>
            <button
              onClick={() => {
                const modes: LayoutMode[] = ['vertical', 'horizontal', 'horizontal-reverse'];
                setLayoutMode(p => modes[(modes.indexOf(p) + 1) % modes.length]);
              }}
              title={
                layoutMode === 'vertical' ? "Vista: Arriba/Abajo (Clic para Lado a Lado)" :
                layoutMode === 'horizontal' ? "Vista: Lado a Lado (Clic para Invertir)" :
                "Vista: Invertida (Clic para Arriba/Abajo)"
              }
              style={{ padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
            >
              <Layout size={18} />
            </button>
          </div>
          {/* Tab content */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '16px 20px' }}>
            {lessonTab === 'lesson' ? (
              <div className="markdown-content">
                <ReactMarkdown>{selectedChallenge.lesson}</ReactMarkdown>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flexDirection: 'column' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{selectedChallenge.title}</h2>
                <div className="markdown-content" style={{ background: 'rgba(88,204,2,0.06)', border: '2px solid rgba(88,204,2,0.25)', borderRadius: '12px', padding: '16px', width: '100%' }}>
                  <ReactMarkdown>{selectedChallenge.instructions}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor & Console Panel */}
      <div style={{ overflow: 'hidden', paddingTop: '4px', display: 'flex', flexDirection: 'column' }}>
        <div className="solid-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>main.py</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCompleteChallenge}
                className="btn-chunky"
                style={{ background: 'var(--bg-darker)', color: 'var(--success)', border: '2px solid rgba(88,204,2,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}
                title="Marcar como Completado"
              >
                <CheckCircle size={18} />
                Completar
              </button>
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
          style={{ height: '8px', cursor: 'ns-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', userSelect: 'none', margin: '4px 0' }}
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
      </div>
    </Split>
  </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-darker)' }}>
      {isSidebarOpen ? (
        <Split 
          sizes={[22, 78]} 
          minSize={250}
          gutterSize={10}
          direction="horizontal" 
          style={{ display: 'flex', width: '100vw', height: '100vh' }}
        >
          {sidebarContent}
          {mainContent}
        </Split>
      ) : (
        <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
          {mainContent}
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}
