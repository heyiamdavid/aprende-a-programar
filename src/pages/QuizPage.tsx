import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { QUIZ_QUESTIONS, type QuizQuestion } from '../data/quiz';
import ReactMarkdown from 'react-markdown';
import {
  BookOpen, CheckCircle, XCircle, Clock, Trophy,
  RotateCcw, ChevronRight, Settings, Target, Zap, ArrowLeft
} from 'lucide-react';

type Screen = 'config' | 'quiz' | 'results';

const CATEGORY_COLORS: Record<string, string> = {
  Python: '#1cb0f6',
  POO: '#a855f7',
  SOLID: '#f59e0b',
  Patrones: '#ec4899',
};

const DIFFICULTY_LABELS: Record<string, string> = {
  facil: '🟢 Fácil',
  medio: '🟡 Medio',
  dificil: '🔴 Difícil',
};

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function QuizPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  // ── Config ──────────────────────────────────────
  const [screen, setScreen] = useState<Screen>('config');
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [timePerQuestion, setTimePerQuestion] = useState(30); // seconds
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Python', 'POO', 'SOLID', 'Patrones']);

  // ── Quiz State ──────────────────────────────────
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isLoaded && !isSignedIn) navigate('/sign-in');
  }, [isLoaded, isSignedIn, navigate]);

  // Timer effect
  const advanceQuestion = useCallback(() => {
    const correct = selected === questions[current]?.correctIndex;
    setAnswers(prev => {
      const next = [...prev];
      next[current] = selected;
      return next;
    });
    if (correct) setScore(s => s + 1);

    if (current + 1 >= questions.length) {
      setScreen('results');
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(timePerQuestion);
    }
  }, [current, questions, selected, timePerQuestion]);

  useEffect(() => {
    if (screen !== 'quiz' || answered) return;
    if (timeLeft <= 0) {
      setAnswered(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [screen, answered, timeLeft]);

  const startQuiz = () => {
    const pool = QUIZ_QUESTIONS.filter(q => selectedCategories.includes(q.category));
    const picked = shuffle(pool).slice(0, Math.min(totalQuestions, pool.length));
    setQuestions(picked);
    setAnswers(new Array(picked.length).fill(null));
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setTimeLeft(timePerQuestion);
    setScreen('quiz');
  };

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[current].correctIndex;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  if (!isLoaded || !isSignedIn) return null;

  // ═══════════════════════════════════════════════
  // SCREEN: CONFIG
  // ═══════════════════════════════════════════════
  if (screen === 'config') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--bg-darker)', padding: '24px', overflowY: 'auto' }}>
        <div className="solid-panel" style={{ width: '100%', maxWidth: '560px', overflow: 'hidden', margin: 'auto' }}>
          {/* Header */}
          <div style={{ padding: '24px', borderBottom: '2px solid var(--border-color)', background: 'var(--bg-darker)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', padding: '4px 0' }}
            >
              <ArrowLeft size={16} /> Volver
            </button>
          </div>
          <div style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--bg-darker)', border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={26} color="var(--accent-primary)" />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Quiz de Conocimiento</h1>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configura tu evaluación</p>
              </div>
            </div>

            {/* Categorías */}
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              <Settings size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Categorías
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
              {Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
                const active = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    style={{
                      padding: '8px 16px', borderRadius: '10px', cursor: 'pointer',
                      fontWeight: 700, fontSize: '0.88rem', fontFamily: 'var(--font-sans)',
                      background: active ? `${color}22` : 'var(--bg-darker)',
                      border: `2px solid ${active ? color : 'var(--border-color)'}`,
                      color: active ? color : 'var(--text-secondary)',
                      transition: 'all 0.1s',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Número de preguntas */}
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              <Target size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Número de preguntas: <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{totalQuestions}</span>
            </label>
            <input
              type="range" min={3} max={Math.min(30, QUIZ_QUESTIONS.filter(q => selectedCategories.includes(q.category)).length)}
              value={totalQuestions}
              onChange={e => setTotalQuestions(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', marginBottom: '28px', height: '6px' }}
            />

            {/* Tiempo por pregunta */}
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              <Clock size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
              Tiempo por pregunta: <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>{timePerQuestion}s</span>
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '36px', flexWrap: 'wrap' }}>
              {[15, 30, 45, 60, 90].map(t => (
                <button
                  key={t}
                  onClick={() => setTimePerQuestion(t)}
                  style={{
                    flex: 1, minWidth: '52px', padding: '10px', borderRadius: '10px', cursor: 'pointer',
                    fontWeight: 700, fontSize: '0.9rem', fontFamily: 'var(--font-sans)',
                    background: timePerQuestion === t ? 'rgba(28,176,246,0.15)' : 'var(--bg-darker)',
                    border: `2px solid ${timePerQuestion === t ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    color: timePerQuestion === t ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    transition: 'all 0.1s',
                  }}
                >
                  {t}s
                </button>
              ))}
            </div>

            <button
              onClick={startQuiz}
              disabled={selectedCategories.length === 0}
              className="btn-chunky btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
            >
              <Zap size={20} /> ¡Empezar Quiz!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // SCREEN: QUIZ
  // ═══════════════════════════════════════════════
  if (screen === 'quiz') {
    const q = questions[current];
    const progress = ((current) / questions.length) * 100;
    const timerPct = (timeLeft / timePerQuestion) * 100;
    const timerColor = timeLeft > 10 ? 'var(--success)' : '#ef4444';
    const catColor = CATEGORY_COLORS[q.category] ?? 'var(--accent-primary)';

    return (
      <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--bg-darker)', padding: '24px', overflowY: 'auto' }}>
        <div className="solid-panel" style={{ width: '100%', maxWidth: '680px', overflow: 'hidden', margin: 'auto' }}>
          {/* Top bar */}
          <div style={{ padding: '14px 20px', borderBottom: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {current + 1} / {questions.length}
            </span>
            <div style={{ flex: 1, height: '8px', background: 'var(--bg-darker)', borderRadius: '4px', overflow: 'hidden', border: '2px solid var(--border-color)' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--accent-primary)', borderRadius: '2px', transition: 'width 0.3s' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '70px', justifyContent: 'flex-end' }}>
              <Clock size={15} color={timerColor} />
              <span style={{ fontWeight: 800, color: timerColor, fontSize: '1rem', fontFamily: 'var(--font-mono)' }}>{timeLeft}s</span>
            </div>
          </div>
          {/* Timer bar */}
          <div style={{ height: '4px', background: 'var(--border-color)' }}>
            <div style={{ height: '100%', width: `${timerPct}%`, background: timerColor, transition: 'width 1s linear, background 0.5s' }} />
          </div>

          <div style={{ padding: '28px' }}>
            {/* Category badge + difficulty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: catColor, background: `${catColor}22`, border: `2px solid ${catColor}44`, padding: '3px 10px', borderRadius: '20px' }}>
                {q.category}
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{DIFFICULTY_LABELS[q.difficulty]}</span>
            </div>

            {/* Question */}
            <p style={{ fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.6, margin: '0 0 16px 0' }}>{q.question}</p>

            {/* Code block */}
            {q.code && (
              <pre style={{ background: 'var(--bg-darker)', border: '2px solid var(--border-color)', borderRadius: '10px', padding: '14px 16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#e2e8f0', overflowX: 'auto', marginBottom: '20px', lineHeight: 1.6 }}>
                {q.code}
              </pre>
            )}

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {q.options.map((opt, idx) => {
                let bg = 'var(--bg-darker)';
                let border = 'var(--border-color)';
                let color = 'var(--text-primary)';

                if (answered) {
                  if (idx === q.correctIndex) { bg = 'rgba(88,204,2,0.12)'; border = 'var(--success)'; color = 'var(--success)'; }
                  else if (idx === selected && idx !== q.correctIndex) { bg = 'rgba(239,68,68,0.12)'; border = '#ef4444'; color = '#ef4444'; }
                } else if (idx === selected) {
                  bg = 'rgba(28,176,246,0.1)'; border = 'var(--accent-primary)'; color = 'var(--accent-primary)';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={answered}
                    style={{
                      textAlign: 'left', padding: '14px 16px', borderRadius: '12px', cursor: answered ? 'default' : 'pointer',
                      background: bg, border: `2px solid ${border}`, color, fontFamily: 'var(--font-sans)',
                      fontSize: '0.92rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ width: '26px', height: '26px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                      {['A', 'B', 'C', 'D'][idx]}
                    </span>
                    {answered && idx === q.correctIndex && <CheckCircle size={16} style={{ flexShrink: 0, color: 'var(--success)' }} />}
                    {answered && idx === selected && idx !== q.correctIndex && <XCircle size={16} style={{ flexShrink: 0, color: '#ef4444' }} />}
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Explanation after answer */}
            {answered && (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid var(--border-color)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💡 Explicación</p>
                <div className="markdown-content" style={{ fontSize: '0.88rem' }}>
                  <ReactMarkdown>{q.explanation}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Next Button */}
            {answered && (
              <button
                onClick={advanceQuestion}
                className="btn-chunky btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                Siguiente Pregunta <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // SCREEN: RESULTS
  // ═══════════════════════════════════════════════
  const pct = Math.round((score / questions.length) * 100);
  const grade = pct >= 90 ? { label: '🏆 Excelente', color: '#fbbf24' }
    : pct >= 70 ? { label: '✅ Aprobado', color: 'var(--success)' }
    : pct >= 50 ? { label: '⚠️ Regular', color: '#f59e0b' }
    : { label: '❌ Necesitas repasar', color: '#ef4444' };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--bg-darker)', padding: '24px', overflowY: 'auto' }}>
      <div className="solid-panel" style={{ width: '100%', maxWidth: '680px', overflow: 'hidden', margin: 'auto' }}>
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '2px solid var(--border-color)', background: 'var(--bg-darker)', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Trophy size={28} color="#fbbf24" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Resultados del Quiz</h2>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{questions.length} preguntas respondidas</p>
          </div>
        </div>

        <div style={{ padding: '28px' }}>
          {/* Score */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ fontSize: 'clamp(3rem, 15vw, 5rem)', fontWeight: 800, lineHeight: 1, color: grade.color }}>{pct}%</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: grade.color, marginTop: '8px' }}>{grade.label}</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
              {score} correctas de {questions.length}
            </div>
          </div>

          {/* Review */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '38vh', overflowY: 'auto', marginBottom: '24px' }}>
            {questions.map((q, i) => {
              const wasCorrect = answers[i] === q.correctIndex;
              return (
                <div key={q.id} style={{ background: 'var(--bg-darker)', border: `2px solid ${wasCorrect ? 'rgba(88,204,2,0.4)' : 'rgba(239,68,68,0.4)'}`, borderRadius: '12px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    {wasCorrect
                      ? <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      : <XCircle size={18} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                    }
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '0.88rem', fontWeight: 600 }}>{q.question}</p>
                      {!wasCorrect && (
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--success)' }}>
                          ✓ Correcta: <strong>{q.options[q.correctIndex]}</strong>
                        </p>
                      )}
                      <span style={{ fontSize: '0.74rem', color: CATEGORY_COLORS[q.category], marginTop: '4px', display: 'inline-block', background: `${CATEGORY_COLORS[q.category]}22`, padding: '2px 8px', borderRadius: '20px' }}>
                        {q.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setScreen('config')}
              className="btn-chunky btn-primary"
              style={{ flex: 1, padding: '14px' }}
            >
              <RotateCcw size={18} /> Nueva configuración
            </button>
            <button
              onClick={startQuiz}
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '2px solid var(--border-color)', background: 'var(--bg-darker)', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ChevronRight size={18} /> Repetir mismas preguntas
            </button>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{ width: '100%', marginTop: '10px', padding: '12px', borderRadius: '12px', border: '2px solid var(--border-color)', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 700, fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem' }}
          >
            <ArrowLeft size={16} /> Volver al editor
          </button>
        </div>
      </div>
    </div>
  );
}
