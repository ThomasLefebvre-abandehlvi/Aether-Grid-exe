import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Register PWA service worker for robust offline caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    // Auto-update SW
  },
  onOfflineReady() {
    console.log('Aether Grid is ready for offline play.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);
