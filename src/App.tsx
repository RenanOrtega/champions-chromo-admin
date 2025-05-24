import { Route, Routes } from 'react-router'
import Layout from './components/layout'
import HomePage from './pages/HomePage'
import AlbumsPage from './albums/page'
import SchoolsPage from './schools/page'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path='schools' element={<SchoolsPage />} />
        <Route path='albums' element={<AlbumsPage />} />
      </Route>
    </Routes>
  )
}

export default App
