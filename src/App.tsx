import { Navigate, Route, Routes } from 'react-router'
import Layout from './components/layout'
import HomePage from './pages/HomePage'
import AlbumsPage from './pages/albums/page'
import SchoolsPage from './pages/schools/page'
import AlbumDetailsPage from './pages/albums/details-page'
import SchoolDetailsPage from './pages/schools/details-page'
import LoginPage from './pages/auth/login-page'
import { useAuth } from './contexts/auth-context'
import { ProtectedRoute } from './components/protected-route'

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      <Route path="/" element={
        <ProtectedRoute fallback={<Navigate to="/login" replace />}>
          <Layout />
        </ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path="schools" element={<SchoolsPage />} />
        <Route path="schools/:schoolId" element={<SchoolDetailsPage />} />
        <Route path="albums" element={<AlbumsPage />} />
        <Route path="albums/:albumId" element={<AlbumDetailsPage />} />
      </Route>
    </Routes>
  )
}

export default App;
