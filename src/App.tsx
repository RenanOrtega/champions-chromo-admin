import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/layout'
import HomePage from './pages/HomePage'
import AlbumsPage from './pages/albums/page'
import SchoolsPage from './pages/schools/page'
import AlbumDetailsPage from './pages/albums/details-page'
import SchoolDetailsPage from './pages/schools/details-page'
import LoginPage from './pages/auth/login-page'
import type { JSX } from 'react'
import { useAuth } from './hooks/use-auth'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="schools" element={<PrivateRoute><SchoolsPage /></PrivateRoute>} />
        <Route path="schools/:schoolId" element={<PrivateRoute><SchoolDetailsPage /></PrivateRoute>} />
        <Route path="albums" element={<PrivateRoute><AlbumsPage /></PrivateRoute>} />
        <Route path="albums/:albumId" element={<PrivateRoute><AlbumDetailsPage /></PrivateRoute>} />
      </Route>
    </Routes>
  )
}

export default App;
