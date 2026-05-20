import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// Vite HMR (built-in, no module.hot needed)
if (import.meta.hot) {
  import.meta.hot.accept()
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
