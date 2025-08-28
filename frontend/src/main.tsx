import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "leaflet/dist/leaflet.css"
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from './contexts/authContext.tsx';
import { ProximityProvider } from './contexts/proximityContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ProximityProvider>
          <App />
        </ProximityProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
