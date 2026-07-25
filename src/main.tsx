import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { esES } from '@clerk/localizations'
import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const root = createRoot(document.getElementById('root')!)

if (!PUBLISHABLE_KEY) {
  root.render(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: '#fff',
      textAlign: 'center',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>⚠️ Faltan Variables de Entorno en Vercel</h1>
      <p style={{ maxWidth: '600px', color: '#94a3b8', lineHeight: '1.6' }}>
        Tu aplicación se ha desplegado correctamente, pero debes agregar las siguientes variables en la configuración de tu proyecto en <strong>Vercel (Settings -&gt; Environment Variables)</strong>:
      </p>
      <ul style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px 40px', borderRadius: '8px', margin: '20px 0', fontFamily: 'monospace' }}>
        <li>VITE_CLERK_PUBLISHABLE_KEY</li>
        <li>VITE_SUPABASE_URL</li>
        <li>VITE_SUPABASE_ANON_KEY</li>
        <li>VITE_GROQ_API_KEY</li>
      </ul>
      <p style={{ color: '#94a3b8' }}>Luego de guardarlas, haz un <strong>Redeploy</strong> en Vercel.</p>
    </div>
  )
} else {
  root.render(
    <StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        localization={esES}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignOutUrl="/"
      >
        <App />
      </ClerkProvider>
    </StrictMode>,
  )
}

