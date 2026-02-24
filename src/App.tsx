
import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './layout'
import HomePage from './pages/home'

import ReservasPage from './pages/reservas'
import SubcategoryPage from './pages/subcategory'
import CategoryPage from './pages/category'


function App() {
  return (
     <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/:category" element={<CategoryPage />} />
          <Route path="/:category/:subcategory" element={<SubcategoryPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
