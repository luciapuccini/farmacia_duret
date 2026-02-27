
import { BrowserRouter, Routes, Route, Navigate } from 'react-router'
import Layout from './layout'
import HomePage from './pages/home'
import ReservasPage from './pages/reservas'
import OfertasPage from './pages/ofertas'
import ContactoPage from './pages/contacto'
import SubcategoryPage from './pages/subcategory'
import CategoryPage from './pages/category'
import NotFoundPage from './pages/not-found'


function App() {
  return (
     <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/ofertas" element={<OfertasPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/medicamentos/venta-bajo-receta" element={<Navigate to="/reservas" replace />} />
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/:category/:subcategory" element={<SubcategoryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
