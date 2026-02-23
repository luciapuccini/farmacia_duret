
import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './layout'
import HomePage from './pages/home'
import CategoriesPage from './pages/categories'
import ReservasPage from './pages/reservas'


function App() {
  return (
     <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
