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
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('✅ Service worker registered:', reg.scope);
      })
      .catch(err => {
        console.error('❌ Service worker registration failed:', err);
      });
  });
}
