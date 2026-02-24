import DermocosmeticaPage from '@/pages/dermocosmetica'
import BellezaPage from '@/pages/belleza'
import CuidadoPersonalPage from '@/pages/cuidado-personal'
import BebesPage from '@/pages/bebes'
import HogarYAlimentosPage from '@/pages/hogar-y-alimentos'
import SaludYFarmaciaPage from '@/pages/salud-y-farmacia'
import MedicamentosPage from '@/pages/medicamentos'
import OfertasPage from '@/pages/ofertas'

export const categoryComponents: Record<string, React.ComponentType> = {
  'dermocosmetica': DermocosmeticaPage,
  'belleza': BellezaPage,
  'cuidado-personal': CuidadoPersonalPage,
  'bebes': BebesPage,
  'hogar-y-alimentos': HogarYAlimentosPage,
  'salud-y-farmacia': SaludYFarmaciaPage,
  'medicamentos': MedicamentosPage,
  'ofertas': OfertasPage,
}
