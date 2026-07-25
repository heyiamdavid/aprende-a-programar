import { useUser } from '@clerk/clerk-react';
import { X, CheckCircle2, Circle, Trophy, Code2 } from 'lucide-react';
import { CHALLENGES } from '../data/challenges';

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const { user } = useUser();

  const challengeStatuses = CHALLENGES.map((ch) => {
    const savedCode = localStorage.getItem(`code_challenge_${ch.id}`);
    const isDone = localStorage.getItem(`done_challenge_${ch.id}`) === 'true';
    const isStarted = savedCode !== null && savedCode !== ch.initialCode;
    return { ...ch, isStarted, isDone };
  });

  const completedCount = challengeStatuses.filter((c) => c.isDone).length;
  const startedCount = challengeStatuses.filter((c) => c.isStarted && !c.isDone).length;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="glass-panel"
        style={{
          width: '520px', maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          overflow: 'hidden', position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Mi Perfil</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* User info */}
          <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-color)' }}>
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="avatar"
                style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--accent-primary)' }}
              />
            ) : (
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem', fontWeight: 700,
              }}>
                {(user?.firstName?.[0] || user?.username?.[0] || '?').toUpperCase()}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{user?.fullName || user?.username || 'Estudiante'}</h3>
              {user?.username && <span style={{ color: 'var(--accent-primary)', fontSize: '0.85rem' }}>@{user.username}</span>}
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.2)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>{completedCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Completados</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{startedCount}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>En progreso</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{CHALLENGES.length}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Total retos</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Progreso general</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {Math.round((completedCount / CHALLENGES.length) * 100)}%
              </span>
            </div>
            <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(completedCount / CHALLENGES.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--accent-primary), var(--success))',
                borderRadius: '4px',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>

          {/* Challenge list */}
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Detalle de Retos
            </h4>
            {challengeStatuses.map((ch) => (
              <div
                key={ch.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '8px',
                  background: ch.isDone ? 'rgba(34,197,94,0.08)' : ch.isStarted ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${ch.isDone ? 'rgba(34,197,94,0.2)' : ch.isStarted ? 'rgba(59,130,246,0.15)' : 'var(--border-color)'}`,
                }}
              >
                {ch.isDone ? (
                  <CheckCircle2 size={18} color="var(--success)" />
                ) : ch.isStarted ? (
                  <Code2 size={18} color="var(--accent-primary)" />
                ) : (
                  <Circle size={18} color="var(--text-secondary)" />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{ch.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{ch.category}</div>
                </div>
                {ch.isDone && (
                  <Trophy size={14} color="var(--success)" />
                )}
                {ch.isStarted && !ch.isDone && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: '20px' }}>
                    En progreso
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
