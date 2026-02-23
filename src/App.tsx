
import { BrowserRouter, Routes, Route } from 'react-router'
import Layout from './layout'
import HomePage from './pages/home'
import CategoriesPage from './pages/categories'
import ReservasPage from './pages/reservas'
import OfertasPage from './pages/ofertas'
import DermocosmeticaPage from './pages/dermocosmetica'
import BellezaPage from './pages/belleza'
import CuidadoPersonalPage from './pages/cuidado-personal'
import BebesPage from './pages/bebes'
import HogarYAlimentosPage from './pages/hogar-y-alimentos'
import SaludYFarmaciaPage from './pages/salud-y-farmacia'
import MedicamentosPage from './pages/medicamentos'


function App() {
  return (
     <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/ofertas" element={<OfertasPage />} />
          <Route path="/dermocosmetica" element={<DermocosmeticaPage />} />
          <Route path="/belleza" element={<BellezaPage />} />
          <Route path="/cuidado-personal" element={<CuidadoPersonalPage />} />
          <Route path="/bebes" element={<BebesPage />} />
          <Route path="/hogar-y-alimentos" element={<HogarYAlimentosPage />} />
          <Route path="/salud-y-farmacia" element={<SaludYFarmaciaPage />} />
          <Route path="/medicamentos" element={<MedicamentosPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
