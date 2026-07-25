import { SignUp } from '@clerk/clerk-react';
import { Terminal, CheckCircle } from 'lucide-react';

const features = [
  'Editor de Python con resaltado de sintaxis',
  'Ejecución en el navegador sin instalación',
  'Retroalimentación de IA con principios SOLID',
  'Progreso guardado automáticamente',
];

const clerkAppearance = {
  layout: {
    socialButtonsPlacement: "bottom" as const,
  },
  variables: {
    colorPrimary: '#1cb0f6',
    colorBackground: '#1e1e1e',
    colorText: '#ffffff',
    colorTextSecondary: '#a0a0a0',
    colorInputBackground: '#121212',
    colorInputText: '#ffffff',
    borderRadius: '16px',
  },
  elements: {
    card: {
      background: 'var(--bg-panel)',
      border: '2px solid var(--border-color)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      borderRadius: '24px',
      padding: '32px',
    },
    headerTitle: {
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    formFieldInput: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '2px solid rgba(255, 255, 255, 0.08)',
      color: '#fff',
      padding: '0.8rem 1.2rem',
      fontSize: '1rem',
      borderRadius: '12px',
      transition: 'all 0.2s ease',
    },
    formFieldLabel: {
      color: 'var(--text-secondary)',
      marginBottom: '8px',
      fontWeight: '600',
    },
    formButtonPrimary: {
      background: 'var(--accent-primary)',
      border: 'none',
      borderBottom: '4px solid #1899d6',
      borderRadius: '16px',
      fontSize: '1.05rem',
      fontWeight: '700',
      padding: '14px',
      textTransform: 'none',
      marginTop: '8px',
      transition: 'all 0.2s',
    },
    socialButtonsBlockButton: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '2px solid rgba(255, 255, 255, 0.08)',
      color: '#fff',
      borderRadius: '16px',
      padding: '12px',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    footer: { background: 'transparent' },
    footerAction: { color: '#a0a0a0' },
    footerActionLink: {
      color: 'var(--accent-primary)',
      fontWeight: '600',
    },
    dividerLine: {
      background: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
      color: '#a0a0a0',
    }
  },
};

export default function SignUpPage() {
  return (
    <div className="responsive-stack" style={{ display: 'flex', width: '100%', minHeight: '100vh', background: 'var(--bg-darker)' }}>
      {/* Left branding panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', gap: '24px', minWidth: 'min(100%, 400px)',
        background: 'var(--bg-panel)',
        borderRight: '2px solid var(--border-color)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '10px', background: 'var(--bg-darker)', borderRadius: '12px', border: '2px solid var(--border-color)' }}>
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
      <div className="responsive-padding" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', minWidth: 'min(100%, 480px)' }}>
        <div style={{ margin: 'auto' }}>
          <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" appearance={clerkAppearance} />
        </div>
      </div>
    </div>
  );
}
