import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Debugging helper
window.onerror = function (message, source, lineno, colno, error) {
  console.error('GLOBAL ERROR:', message, 'at', source, ':', lineno, ':', colno);
};

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
