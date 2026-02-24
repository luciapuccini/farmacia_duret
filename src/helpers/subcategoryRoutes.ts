import RostroPage from '@/pages/dermocosmetica/subcategories/rostro'
import CorporalPage from '@/pages/dermocosmetica/subcategories/corporal'
import PeloPage from '@/pages/dermocosmetica/subcategories/pelo'

import MaquillajePage from '@/pages/belleza/subcategories/maquillaje'
import PerfumesYFraganciasPage from '@/pages/belleza/subcategories/perfumes-y-fragancias'
import CuidadoDeLaPielPage from '@/pages/belleza/subcategories/cuidado-de-la-piel'
import AccesoriosDeBellezaPage from '@/pages/belleza/subcategories/accesorios-de-belleza'
import ElectroBellezaPage from '@/pages/belleza/subcategories/electro-belleza'
import CuidadoCapilarBellezaPage from '@/pages/belleza/subcategories/cuidado-capilar'
import ModaPage from '@/pages/belleza/subcategories/moda'
import NovedadesYSorteosBellezaPage from '@/pages/belleza/subcategories/novedades-y-sorteos'

import CuidadoCapilarCPPage from '@/pages/cuidado-personal/subcategories/cuidado-capilar'
import CuidadoOralPage from '@/pages/cuidado-personal/subcategories/cuidado-oral'
import AdultosPage from '@/pages/cuidado-personal/subcategories/adultos'
import HigienePersonalPage from '@/pages/cuidado-personal/subcategories/higiene-personal'
import RepelentesPage from '@/pages/cuidado-personal/subcategories/repelentes'
import NovedadesYSorteosCPPage from '@/pages/cuidado-personal/subcategories/novedades-y-sorteos'

import NutricionInfantilBebesPage from '@/pages/bebes/subcategories/nutricion-infantil'
import PanalesPage from '@/pages/bebes/subcategories/panales'
import LactanciaPage from '@/pages/bebes/subcategories/lactancia'
import CuidadoMaternoPage from '@/pages/bebes/subcategories/cuidado-materno'
import HigieneDelBebePage from '@/pages/bebes/subcategories/higiene-del-bebe'

import DesayunoYMeriendaPage from '@/pages/hogar-y-alimentos/subcategories/desayuno-y-merienda'
import AlimentacionSaludablePage from '@/pages/hogar-y-alimentos/subcategories/alimentacion-saludable'
import LimpiezaYDesinfeccionPage from '@/pages/hogar-y-alimentos/subcategories/limpieza-y-desinfeccion'
import LibreriaPage from '@/pages/hogar-y-alimentos/subcategories/libreria'
import ElectronicaYPilasPage from '@/pages/hogar-y-alimentos/subcategories/electronica-y-pilas'
import HogarYDecoPage from '@/pages/hogar-y-alimentos/subcategories/hogar-y-deco'
import PapelesPage from '@/pages/hogar-y-alimentos/subcategories/papeles'

import ServiciosDeSaludPage from '@/pages/salud-y-farmacia/subcategories/servicios-de-salud'
import FarmaciaPage from '@/pages/salud-y-farmacia/subcategories/farmacia'
import NutricionYDeportesPage from '@/pages/salud-y-farmacia/subcategories/nutricion-y-deportes'
import NutricionInfantilSYFPage from '@/pages/salud-y-farmacia/subcategories/nutricion-infantil'
import BienestarSexualPage from '@/pages/salud-y-farmacia/subcategories/bienestar-sexual'
import ElectrosaludPage from '@/pages/salud-y-farmacia/subcategories/electrosalud'

import VentaLibrePage from '@/pages/medicamentos/subcategories/venta-libre'
import VentaBajoRecetaPage from '@/pages/medicamentos/subcategories/venta-bajo-receta'

export const subcategoryComponents: Record<string, Record<string, React.ComponentType>> = {
  'dermocosmetica': {
    'rostro': RostroPage,
    'corporal': CorporalPage,
    'pelo': PeloPage,
  },
  'belleza': {
    'maquillaje': MaquillajePage,
    'perfumes-y-fragancias': PerfumesYFraganciasPage,
    'cuidado-de-la-piel': CuidadoDeLaPielPage,
    'accesorios-de-belleza': AccesoriosDeBellezaPage,
    'electro-belleza': ElectroBellezaPage,
    'cuidado-capilar': CuidadoCapilarBellezaPage,
    'moda': ModaPage,
    'novedades-y-sorteos': NovedadesYSorteosBellezaPage,
  },
  'cuidado-personal': {
    'cuidado-capilar': CuidadoCapilarCPPage,
    'cuidado-oral': CuidadoOralPage,
    'adultos': AdultosPage,
    'higiene-personal': HigienePersonalPage,
    'repelentes': RepelentesPage,
    'novedades-y-sorteos': NovedadesYSorteosCPPage,
  },
  'bebes': {
    'nutricion-infantil': NutricionInfantilBebesPage,
    'panales': PanalesPage,
    'lactancia': LactanciaPage,
    'cuidado-materno': CuidadoMaternoPage,
    'higiene-del-bebe': HigieneDelBebePage,
  },
  'hogar-y-alimentos': {
    'desayuno-y-merienda': DesayunoYMeriendaPage,
    'alimentacion-saludable': AlimentacionSaludablePage,
    'limpieza-y-desinfeccion': LimpiezaYDesinfeccionPage,
    'libreria': LibreriaPage,
    'electronica-y-pilas': ElectronicaYPilasPage,
    'hogar-y-deco': HogarYDecoPage,
    'papeles': PapelesPage,
  },
  'salud-y-farmacia': {
    'servicios-de-salud': ServiciosDeSaludPage,
    'farmacia': FarmaciaPage,
    'nutricion-y-deportes': NutricionYDeportesPage,
    'nutricion-infantil': NutricionInfantilSYFPage,
    'bienestar-sexual': BienestarSexualPage,
    'electrosalud': ElectrosaludPage,
  },
  'medicamentos': {
    'venta-libre': VentaLibrePage,
    'venta-bajo-receta': VentaBajoRecetaPage,
  },
}
