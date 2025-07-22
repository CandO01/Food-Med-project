import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AuthcontextProvider from './AuthenticationContext/Authcontext.jsx';
import UserLocation, { LocationContext } from './LocationContext/LocationContext.jsx';
import { NotificationProvider } from './AuthenticationContext/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthcontextProvider>
        <NotificationProvider>
          <UserLocation>
            <App />
          </UserLocation>
        </NotificationProvider>
      </AuthcontextProvider>
    </BrowserRouter>
  </StrictMode>
)
