import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider.tsx';
import { QueryProvider } from './providers/query-provider.tsx';
import { AuthProvider } from './contexts/auth-context.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  </BrowserRouter>
)
