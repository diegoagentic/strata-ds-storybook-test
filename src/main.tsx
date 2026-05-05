import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'strata-design-system';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { DemoProfileProvider } from './context/DemoProfileContext';
import { DemoProvider } from './context/DemoContext';
import { TenantProvider } from './context/TenantContext';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="strata-demo-v3-theme">
      <AuthProvider>
        <DemoProfileProvider>
          <DemoProvider>
            <TenantProvider>
              <App />
            </TenantProvider>
          </DemoProvider>
        </DemoProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
