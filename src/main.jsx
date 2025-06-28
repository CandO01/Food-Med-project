import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AuthcontextProvider from './AuthenticationContext/Authcontext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthcontextProvider>
          <App />
      </AuthcontextProvider>
    </BrowserRouter>
  </StrictMode>
)
