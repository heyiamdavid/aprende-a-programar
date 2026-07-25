import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, UserButton, useUser } from '@clerk/clerk-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Play, CheckCircle, Terminal, BookOpen, Sparkles, GripHorizontal, User, Target, BrainCircuit, Layout, PanelLeftClose, PanelLeftOpen, ArrowLeft, Trophy, Zap, Code2 } from 'lucide-react';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import Split from 'react-split';
import { getCodeReview, validateChallengeCompletion, getHints } from '../lib/groq';
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
  const [searchParams] = useSearchParams();
  const ruta = searchParams.get('ruta') || 'python';

  // Filter challenges by route
  const routeChallenges = (() => {
    if (ruta === 'poo-proyectos') {
      return CHALLENGES.filter(c => c.category === 'Proyectos POO');
    }
    if (ruta === 'algoritmos') {
      return CHALLENGES.filter(c => c.category === 'Programación Estructurada' || c.category === 'Estructuras de Datos');
    }
    if (ruta === 'javascript') {
      return CHALLENGES.filter(c => c.category.includes('JavaScript'));
    }
    // Default: python route
    return CHALLENGES.filter(c => c.category !== 'Proyectos POO' && c.category !== 'Programación Estructurada' && c.category !== 'Estructuras de Datos' && !c.category.includes('JavaScript'));
  })();

  // Sidebar label by route
  const routeLabel = (() => {
    if (ruta === 'poo-proyectos') return 'Proyectos POO';
    if (ruta === 'algoritmos') return 'Algoritmos y Estructuras';
    if (ruta === 'javascript') return 'JavaScript Moderno';
    return 'Ruta de Python';
  })();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in');
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Active challenge persisted in localStorage
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(() => {
    const savedId = localStorage.getItem(`active_challenge_id_${ruta}`);
    if (savedId) {
      const found = routeChallenges.find((c) => c.id === Number(savedId));
      if (found) return found;
    }
    return routeChallenges[0] || CHALLENGES[0];
  });

  const [code, setCode] = useState<string>(() => {
    const savedCode = localStorage.getItem(`code_challenge_${selectedChallenge.id}`);
    return savedCode !== null ? savedCode : selectedChallenge.initialCode;
  });

  // Sync selected challenge when route changes
  useEffect(() => {
    const savedId = localStorage.getItem(`active_challenge_id_${ruta}`);
    let found;
    if (savedId) {
      found = routeChallenges.find((c) => c.id === Number(savedId));
    }
    const newSelected = found || routeChallenges[0] || CHALLENGES[0];
    
    if (newSelected && newSelected.id !== selectedChallenge.id) {
      setSelectedChallenge(newSelected);
      const savedCode = localStorage.getItem(`code_challenge_${newSelected.id}`);
      setCode(savedCode !== null ? savedCode : newSelected.initialCode);
      setOutput(`Cargado: ${newSelected.title}\n`);
    }
  }, [ruta, routeChallenges, selectedChallenge.id]);

  const [output, setOutput] = useState<string>('Salida de consola...');
  const [isReviewing, setIsReviewing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0); // Cooldown in seconds
  const [pyodideReady, setPyodideReady] = useState(false);
  const [consoleHeight, setConsoleHeight] = useState(200);
  const [showProfile, setShowProfile] = useState(false);
  const [lessonTab, setLessonTab] = useState<'lesson' | 'reto' | 'hints'>('lesson');
  const [hints, setHints] = useState<string>('');
  const [isLoadingHints, setIsLoadingHints] = useState(false);
  type LayoutMode = 'vertical' | 'horizontal' | 'horizontal-reverse';
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('horizontal');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [, setRenderTrigger] = useState(0);

  // Custom input modal state (replaces window.prompt)
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [showInputModal, setShowInputModal] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const sharedBufferRef = useRef<SharedArrayBuffer | null>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(200);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileTab, setMobileTab] = useState<'instructions' | 'editor'>('instructions');

  // Responsive layout adjustments
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setLayoutMode('vertical');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Pyodide via Web Worker
  useEffect(() => {
    if (!isSignedIn || ruta === 'javascript') return;

    setOutput('Cargando entorno Python (Pyodide)...\n');

    let sab: SharedArrayBuffer | null = null;
    try {
      sab = new SharedArrayBuffer(4096);
    } catch {
      console.warn('SharedArrayBuffer no disponible en este navegador o servidor.');
    }
    sharedBufferRef.current = sab;

    let worker: Worker;
    try {
      // Classic worker in /public — supports importScripts() for Pyodide
      worker = new Worker('/pyodide-worker.js');
    } catch (e: any) {
      setOutput(`[Error] No se pudo crear el Worker: ${e?.message ?? e}\n`);
      return;
    }
    workerRef.current = worker;

    worker.onerror = (e) => {
      setOutput(p => p + `\n[Worker Error] ${e.message ?? 'Error desconocido en el worker'}\n`);
    };

    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === 'READY') {
        setPyodideReady(true);
        setOutput('¡Entorno listo! Escribe tu código y presiona Ejecutar.\n');
      } else if (msg.type === 'STDOUT') {
        setOutput(p => p + msg.text + '\n');
      } else if (msg.type === 'STDERR') {
        setOutput(p => p + '[Error] ' + msg.text + '\n');
      } else if (msg.type === 'DONE') {
        // execution finished
      } else if (msg.type === 'ERROR') {
        setOutput(p => p + '\n' + msg.error);
      } else if (msg.type === 'REQUEST_INPUT') {
        setInputPrompt(msg.prompt || 'Tu programa pide un valor:');
        setInputValue('');
        setShowInputModal(true);
      }
    };

    worker.postMessage({ type: 'INIT' });

    return () => {
      worker.terminate();
      workerRef.current = null;
      setPyodideReady(false);
    };
  }, [isSignedIn, ruta]);


  // Handler called when user submits the custom input modal
  const handleInputSubmit = useCallback((value: string) => {
    setShowInputModal(false);
    const sab = sharedBufferRef.current;
    if (!sab) return;
    const controlArray = new Int32Array(sab, 0, 2);
    const textArray = new Uint8Array(sab, 8);
    // Encode the user's text into the shared buffer
    const encoded = new TextEncoder().encode(value);
    textArray.fill(0); // clear
    textArray.set(encoded.subarray(0, textArray.length - 1));
    // Signal the worker that input is ready
    Atomics.store(controlArray, 0, 1);
    Atomics.notify(controlArray, 0);
  }, []);

  // Cooldown timer logic
  useEffect(() => {
    let timer: any;
    if (cooldownTime > 0) {
      timer = setInterval(() => setCooldownTime(p => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  // Code change + persistence
  const handleCodeChange = (newCode: string | undefined) => {
    const val = newCode ?? '';
    setCode(val);
    localStorage.setItem(`code_challenge_${selectedChallenge.id}`, val);
  };

  // Challenge selection + restore code
  const handleSelectChallenge = (ch: Challenge) => {
    setSelectedChallenge(ch);
    localStorage.setItem(`active_challenge_id_${ruta}`, ch.id.toString());
    const saved = localStorage.getItem(`code_challenge_${ch.id}`);
    setCode(saved !== null ? saved : ch.initialCode);
    setOutput(`Cargado: ${ch.title}\n`);
    setLessonTab('lesson');
    setHints(''); // Reset hints on challenge change
  };

  // Resizable terminal
  const handleStartDrag = (clientY: number) => {
    isDraggingRef.current = true;
    startYRef.current = clientY;
    startHeightRef.current = consoleHeight;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchUp);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => handleStartDrag(e.clientY);
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only handle single touch
    if (e.touches.length === 1) {
      handleStartDrag(e.touches[0].clientY);
    }
  };

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDraggingRef.current) return;
    const delta = startYRef.current - clientY;
    setConsoleHeight(Math.max(100, Math.min(500, startHeightRef.current + delta)));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => handleDragMove(e.clientY), [handleDragMove]);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault(); // Prevent scrolling while dragging
      handleDragMove(e.touches[0].clientY);
    }
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleTouchUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchUp);
  }, [handleTouchMove]);

  // Run code
  const handleRunCode = async () => {
    setOutput('');

    if (ruta === 'javascript') {
      const logBuffer: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logBuffer.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      };
      try {
        // eslint-disable-next-line no-eval
        eval(code);
        setOutput(logBuffer.join('\n') + '\n');
      } catch (err: any) {
        setOutput(logBuffer.join('\n') + `\n[Error]: ${err.message}\n`);
      } finally {
        console.log = originalLog;
      }
      return;
    }

    if (!pyodideReady || !workerRef.current) return;

    // Send code to the worker to execute
    workerRef.current.postMessage({
      type: 'RUN_CODE',
      code,
      sharedBuffer: sharedBufferRef.current,
    });
  };

  // AI Review
  const handleReviewCode = async () => {
    if (cooldownTime > 0) {
      setOutput(`⏱️ Por favor, espera ${cooldownTime} segundos antes de volver a consultar a la IA.\n`);
      return;
    }
    setIsReviewing(true);
    setCooldownTime(15); // 15 seconds cooldown
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

  const handleCompleteChallenge = async () => {
    if (cooldownTime > 0) {
      setOutput(`⏱️ Por favor, espera ${cooldownTime} segundos antes de volver a validar con la IA.\n`);
      return;
    }
    setIsCompleting(true);
    setCooldownTime(10); // 10 seconds cooldown
    setOutput('🤖 La IA está validando tu código para completar el reto...\n');
    try {
      const { success, feedback } = await validateChallengeCompletion(code, selectedChallenge.title, selectedChallenge.instructions);
      
      if (success) {
        setOutput(`✅ ¡RETO COMPLETADO!\n\n${feedback}`);
        localStorage.setItem(`done_challenge_${selectedChallenge.id}`, 'true');
        setRenderTrigger(p => p + 1);

        // Auto-advance to next challenge after 3s
        const currentIndex = routeChallenges.findIndex(c => c.id === selectedChallenge.id);
        if (currentIndex !== -1 && currentIndex < routeChallenges.length - 1) {
          const nextChallenge = routeChallenges[currentIndex + 1];
          setTimeout(() => {
            handleSelectChallenge(nextChallenge);
            setOutput(`🎉 ¡Excelente! Pasando a: ${nextChallenge.title}\n`);
          }, 2500);
        } else {
          setTimeout(() => {
            setOutput(`🏆 ¡Felicidades! Has completado TODOS los retos de la ruta ${routeLabel}.\n`);
          }, 1500);
        }
      } else {
        setOutput(`❌ AÚN TE FALTAN DETALLES:\n\n${feedback}\n\nCorrige tu código y vuelve a intentarlo.`);
      }
    } catch (e: any) {
      setOutput(`Error en la validación: ${e.message ?? e}`);
    } finally {
      setIsCompleting(false);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px 8px 16px 16px', overflow: 'hidden' }}>
      <aside className="solid-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => navigate('/')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', padding: '4px 0', fontFamily: 'var(--font-sans)', fontWeight: 600, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            <ArrowLeft size={14} /> Cambiar ruta
          </button>
          {isMobile && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)' }}
            >
              <PanelLeftClose size={20} />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {ruta === 'poo-proyectos' ? <Trophy size={20} color="#f59e0b" /> : 
             ruta === 'algoritmos' ? <BrainCircuit size={20} color="#10b981" /> :
             ruta === 'javascript' ? <Zap size={20} color="#eab308" /> :
             <BookOpen size={20} color="var(--accent-primary)" />}
            <h2 style={{ fontSize: '1rem', margin: 0, flex: 1 }}>{routeLabel}</h2>
            <button
              onClick={() => navigate('/quiz')}
              title="Quiz de conocimiento"
              style={{ background: 'rgba(168,85,247,0.15)', border: '2px solid rgba(168,85,247,0.4)', borderRadius: '10px', padding: '6px 10px', cursor: 'pointer', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-sans)' }}
            >
              <BrainCircuit size={15} /> Quiz
            </button>
          </div>
        </div>

        <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {Object.entries(
            routeChallenges.reduce((acc, ch) => {
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

  const instructionsPanelJSX = (
    <div style={{ overflow: 'hidden', paddingBottom: isMobile ? '0' : '4px', display: isMobile && mobileTab !== 'instructions' ? 'none' : 'block', flex: isMobile ? 1 : undefined }}>
      <div className="solid-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', borderTopLeftRadius: isMobile ? 0 : '16px', borderTopRightRadius: isMobile ? 0 : '16px' }}>
          {/* Tab header */}
          <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', alignItems: 'center', overflowX: 'auto', flexShrink: 0 }}>
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
              <button
                onClick={async () => {
                  setLessonTab('hints');
                  if (!hints && !isLoadingHints) {
                    setIsLoadingHints(true);
                    const h = await getHints(selectedChallenge.title, selectedChallenge.instructions, code);
                    setHints(h);
                    setIsLoadingHints(false);
                  }
                }}
                style={{
                  flex: 1, padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '0.85rem', fontWeight: 700, fontFamily: 'var(--font-sans)',
                  borderBottom: lessonTab === 'hints' ? '3px solid #f59e0b' : '3px solid transparent',
                  color: lessonTab === 'hints' ? '#f59e0b' : 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center', transition: 'color 0.15s',
                }}
              >
                <Sparkles size={15} /> Pistas 💡
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
            ) : lessonTab === 'hints' ? (
              <div>
                <div style={{ marginBottom: '14px', padding: '10px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '10px', fontSize: '0.82rem', color: '#f59e0b' }}>
                  💡 <strong>Pistas progresivas</strong> — Léelas una por una antes de pasar a la siguiente.
                </div>
                {isLoadingHints ? (
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>⏳ Generando pistas personalizadas para tu código actual...</p>
                ) : (
                  <div className="markdown-content">
                    <ReactMarkdown>{hints}</ReactMarkdown>
                  </div>
                )}
                <button
                  onClick={async () => {
                    setHints('');
                    setIsLoadingHints(true);
                    const h = await getHints(selectedChallenge.title, selectedChallenge.instructions, code);
                    setHints(h);
                    setIsLoadingHints(false);
                  }}
                  disabled={isLoadingHints}
                  style={{ marginTop: '14px', padding: '8px 16px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: '8px', color: '#f59e0b', cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  🔄 Actualizar pistas (basadas en tu código actual)
                </button>
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
  );

  const editorPanelJSX = (
    <div style={{ overflow: 'hidden', paddingTop: isMobile ? '10px' : '4px', display: isMobile && mobileTab !== 'editor' ? 'none' : 'flex', flexDirection: 'column', flex: isMobile ? 1 : undefined }}>
      <div className="solid-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '2px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflowX: 'auto', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{ruta === 'javascript' ? 'main.js' : 'main.py'}</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleCompleteChallenge}
                disabled={isCompleting || cooldownTime > 0}
                className="btn-chunky"
                style={{ background: 'var(--bg-darker)', color: cooldownTime > 0 ? 'var(--text-secondary)' : 'var(--success)', border: '2px solid rgba(88,204,2,0.3)', display: 'flex', alignItems: 'center', gap: isMobile ? '0' : '8px', padding: isMobile ? '8px 12px' : undefined }}
                title={cooldownTime > 0 ? `Espera ${cooldownTime}s` : 'Validar y Completar'}
              >
                <CheckCircle size={18} />
                {!isMobile && (isCompleting ? 'Validando...' : cooldownTime > 0 ? `Espera ${cooldownTime}s` : 'Completar')}
              </button>
              <button
                onClick={handleReviewCode}
                disabled={isReviewing || cooldownTime > 0}
                className="btn-chunky btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0' : '8px', padding: isMobile ? '8px 12px' : undefined }}
                title={cooldownTime > 0 ? `Espera ${cooldownTime}s` : 'Revisión IA'}
              >
                <Sparkles size={18} />
                {!isMobile && (isReviewing ? 'Revisando...' : cooldownTime > 0 ? `IA (${cooldownTime}s)` : 'Revisión IA')}
              </button>
              <button
                onClick={handleRunCode}
                className="btn-chunky btn-success"
                style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '0' : '8px', padding: isMobile ? '8px 12px' : undefined }}
                title="Ejecutar"
              >
                <Play size={18} fill="white" />
                {!isMobile && 'Ejecutar'}
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <Editor
              height="100%"
              language={ruta === 'javascript' ? 'javascript' : 'python'}
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
          onTouchStart={handleTouchStart}
          style={{ height: '14px', cursor: 'ns-resize', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', userSelect: 'none', margin: '2px 0', touchAction: 'none' }}
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
  );

  const mainContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: isSidebarOpen && !isMobile ? '16px 16px 16px 8px' : '16px', overflow: 'hidden', flex: 1, minWidth: 0 }}>
      {isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', background: 'var(--bg-panel)', border: '2px solid var(--border-color)', borderBottom: 'none', borderRadius: '16px 16px 0 0', overflow: 'hidden', flexShrink: 0 }}>
             <button onClick={() => setMobileTab('instructions')} style={{ flex: 1, padding: '12px', background: mobileTab === 'instructions' ? 'var(--accent-primary)' : 'transparent', color: mobileTab === 'instructions' ? 'white' : 'var(--text-secondary)', border: 'none', fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
               <BookOpen size={16} /> Teoría y Reto
             </button>
             <button onClick={() => setMobileTab('editor')} style={{ flex: 1, padding: '12px', background: mobileTab === 'editor' ? 'var(--accent-primary)' : 'transparent', color: mobileTab === 'editor' ? 'white' : 'var(--text-secondary)', border: 'none', fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
               <Code2 size={16} /> Código
             </button>
          </div>
          {instructionsPanelJSX}
          {editorPanelJSX}
        </div>
      ) : (
        <Split
          sizes={[35, 65]}
          minSize={150}
          gutterSize={10}
          direction={layoutMode.includes('horizontal') ? 'horizontal' : 'vertical'}
          style={{ display: 'flex', flexDirection: layoutMode === 'horizontal-reverse' ? 'row-reverse' : (layoutMode === 'horizontal' ? 'row' : 'column'), height: '100%' }}
        >
          {instructionsPanelJSX}
          {editorPanelJSX}
        </Split>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-darker)' }}>
      {isSidebarOpen ? (
        <Split 
          sizes={isMobile ? [100, 0] : [22, 78]} 
          minSize={isMobile ? 0 : 250}
          gutterSize={isMobile ? 0 : 10}
          direction="horizontal" 
          style={{ display: 'flex', width: '100vw', height: '100vh' }}
        >
          {sidebarContent}
          {!isMobile && mainContent}
        </Split>
      ) : (
        <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
          {mainContent}
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}

      {/* Custom Python input() Modal */}
      {showInputModal && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(6px)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              background: 'var(--bg-panel)',
              border: '2px solid var(--border-color)',
              borderRadius: '24px',
              padding: '32px',
              width: 'min(90vw, 460px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              animation: 'slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'rgba(28,176,246,0.15)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px',
              }}>
                <Terminal size={20} color="var(--accent-primary)" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                  Python — input()
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', lineHeight: 1.4 }}>
                  {inputPrompt || 'Tu programa necesita un valor'}
                </p>
              </div>
            </div>

            {/* Input field */}
            <input
              autoFocus
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleInputSubmit(inputValue); }}
              placeholder={inputPrompt ? `Escribe tu respuesta y presiona Enter…` : 'Escribe aquí y presiona Enter…'}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '2px solid rgba(28,176,246,0.35)',
                borderRadius: '14px',
                padding: '14px 18px',
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
            />

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => handleInputSubmit('')}
                style={{
                  flex: 1, padding: '12px', borderRadius: '14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '2px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleInputSubmit(inputValue)}
                className="btn-chunky btn-primary"
                style={{
                  flex: 2, padding: '12px', borderRadius: '14px',
                  fontSize: '1rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                }}
              >
                <Play size={16} fill="white" />
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
