import { SignUp } from '@clerk/clerk-react';
import { Terminal, CheckCircle } from 'lucide-react';

const features = [
  'Editor de Python con resaltado de sintaxis',
  'Ejecución en el navegador sin instalación',
  'Retroalimentación de IA con principios SOLID',
  'Progreso guardado automáticamente',
];

const clerkAppearance = {
  variables: {
    colorPrimary: '#3b82f6',
    colorBackground: '#0f172a',
    colorText: '#f8fafc',
    colorTextSecondary: '#94a3b8',
    colorInputBackground: '#1e293b',
    colorInputText: '#f8fafc',
    borderRadius: '10px',
  },
  elements: {
    card: {
      background: 'rgba(30, 41, 59, 0.9)',
      border: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
    },
    footer: { background: 'transparent' },
    footerAction: { color: '#94a3b8' },
  },
};

export default function SignUpPage() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: 'var(--bg-darker)', overflow: 'auto' }}>
      {/* Left branding panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', gap: '24px', minWidth: '400px',
        background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(30,41,59,0.4) 100%)',
        borderRight: '1px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'rgba(59,130,246,0.2)', borderRadius: '12px' }}>
            <Terminal size={28} color="var(--accent-primary)" />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 700 }}>Aprende a Programar</span>
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 700, lineHeight: 1.2, margin: 0 }}>
          Comienza tu viaje en{' '}
          <span style={{ color: 'var(--accent-primary)' }}>programación</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, margin: 0, maxWidth: '420px' }}>
          Crea tu cuenta gratuita y empieza a resolver retos de Python con la ayuda de inteligencia artificial.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {features.map((feat) => (
            <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <CheckCircle size={18} color="var(--success)" style={{ flexShrink: 0 }} />
              {feat}
            </div>
          ))}
        </div>
      </div>

      {/* Right: Clerk form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', minWidth: '480px' }}>
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" appearance={clerkAppearance} />
      </div>
    </div>
  );
}
