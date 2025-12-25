import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Analytics } from "@vercel/analytics/react"

// Enable dark theme by default
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('theme-dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Analytics/>
    <App />
  </StrictMode>,
)
