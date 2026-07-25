import { SignIn } from '@clerk/clerk-react';
import { Terminal, CheckCircle } from 'lucide-react';

const features = [
  'Editor de Python con resaltado de sintaxis',
  'Ejecución en el navegador sin instalación',
  'Retroalimentación de IA con principios SOLID',
  'Progreso guardado automáticamente',
];

const clerkAppearance = {
  variables: {
    colorPrimary: '#1cb0f6',
    colorBackground: '#1e1e1e',
    colorText: '#ffffff',
    colorTextSecondary: '#a0a0a0',
    colorInputBackground: '#121212',
    colorInputText: '#ffffff',
    borderRadius: '12px',
  },
  elements: {
    card: {
      background: 'var(--bg-panel)',
      border: '2px solid var(--border-color)',
      boxShadow: 'none',
    },
    footer: { background: 'transparent' },
    footerAction: { color: '#a0a0a0' },
  },
};

export default function SignInPage() {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: 'var(--bg-darker)', overflow: 'auto' }}>
      {/* Left branding panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', gap: '24px', minWidth: '400px',
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
          Aprende Python de forma{' '}
          <span style={{ color: 'var(--accent-primary)' }}>interactiva</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, margin: 0, maxWidth: '420px' }}>
          Escribe código Python en tu navegador, recibe retroalimentación de IA en tiempo real y guarda tu progreso en cada reto.
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px', minWidth: '480px', overflowY: 'auto' }}>
        <div style={{ margin: 'auto' }}>
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" appearance={clerkAppearance} />
        </div>
      </div>
    </div>
  );
}
