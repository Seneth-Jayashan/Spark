import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { AppProviders } from './contexts/AppProviders.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
      </BrowserRouter>
    </AppProviders>
  </StrictMode>
);
