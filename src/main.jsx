import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// No offline mode: unregister any previously-registered SW + clear related caches.
if ('serviceWorker' in navigator) {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations?.();
    registrations?.forEach((r) => r.unregister());
  } catch {
    // ignore
  }
}

if ('caches' in globalThis) {
  try {
    const keys = await globalThis.caches.keys();
    await Promise.all(
      keys
        .filter((k) => k === 'sympto-v1' || k.startsWith('sympto-'))
        .map((k) => globalThis.caches.delete(k)),
    );
  } catch {
    // ignore
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
