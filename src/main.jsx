import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'

const CHUNK_RELOAD_KEY = 'adroit_chunk_reload_once';

const isChunkLoadError = (event) => {
  const message = String(event?.message || event?.reason?.message || '').toLowerCase();
  return message.includes('failed to fetch dynamically imported module');
};

window.addEventListener('error', (event) => {
  if (!isChunkLoadError(event)) return;

  if (!sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
    window.location.reload();
  }
});

window.addEventListener('unhandledrejection', (event) => {
  if (!isChunkLoadError(event)) return;

  if (!sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
    sessionStorage.setItem(CHUNK_RELOAD_KEY, '1');
    window.location.reload();
  }
});

if (sessionStorage.getItem(CHUNK_RELOAD_KEY)) {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY);
}

createRoot(document.getElementById('root')).render(
  <CartProvider>
    <App />
  </CartProvider>,
)
