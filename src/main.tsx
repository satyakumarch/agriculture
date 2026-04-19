
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './hooks/use-auth'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from './hooks/use-language'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
);
