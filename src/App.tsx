import { Route, Routes } from 'react-router'
import Layout from './components/layout'
import HomePage from './pages/HomePage'
import AlbumsPage from './pages/albums/page'
import SchoolsPage from './pages/schools/page'
import AlbumDetailsPage from './pages/albums/details-page'
import SchoolDetailsPage from './pages/schools/details-page'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='schools' element={<SchoolsPage />} />
        <Route path='schools/:schoolId' element={<SchoolDetailsPage />} />
        <Route path='albums' element={<AlbumsPage />} />
        <Route path='albums/:albumId' element={<AlbumDetailsPage />} />
      </Route>
    </Routes>
  )
}

export default App
