import React from 'react'
import { useLocation } from 'react-router'
import Navbar from './navbar'
import Footer from './footer'
import Container from './container'
import Breadcrumb from './breadcrumb'
import styles from './layout.module.scss'

const categoryNames: Record<string, string> = {
  'dermocosmetica': 'Dermocosmética',
  'belleza': 'Belleza',
  'cuidado-personal': 'Cuidado Personal',
  'bebes': 'Bebés',
  'hogar-y-alimentos': 'Hogar y Alimentos',
  'salud-y-farmacia': 'Salud y Farmacia',
  'medicamentos': 'Medicamentos',
  'ofertas': 'Ofertas',
}

const subcategoryNames: Record<string, Record<string, string>> = {
  'dermocosmetica': {
    'rostro': 'Rostro',
    'corporal': 'Corporal',
    'pelo': 'Pelo',
  },
  'belleza': {
    'maquillaje': 'Maquillaje',
    'perfumes-y-fragancias': 'Perfumes y Fragancias',
    'cuidado-de-la-piel': 'Cuidado de la Piel',
    'accesorios-de-belleza': 'Accesorios de Belleza',
    'electro-belleza': 'Electro Belleza',
    'cuidado-capilar': 'Cuidado Capilar',
    'moda': 'Moda',
    'novedades-y-sorteos': 'Novedades y Sorteos',
  },
  'cuidado-personal': {
    'cuidado-capilar': 'Cuidado Capilar',
    'cuidado-oral': 'Cuidado Oral',
    'adultos': 'Adultos',
    'higiene-personal': 'Higiene Personal',
    'repelentes': 'Repelentes',
    'novedades-y-sorteos': 'Novedades y Sorteos',
  },
  'bebes': {
    'nutricion-infantil': 'Nutrición Infantil',
    'panales': 'Pañales',
    'lactancia': 'Lactancia',
    'cuidado-materno': 'Cuidado Materno',
    'higiene-del-bebe': 'Higiene del Bebé',
  },
  'hogar-y-alimentos': {
    'desayuno-y-merienda': 'Desayuno y Merienda',
    'alimentacion-saludable': 'Alimentación Saludable',
    'limpieza-y-desinfeccion': 'Limpieza y Desinfección',
    'libreria': 'Librería',
    'electronica-y-pilas': 'Electrónica y Pilas',
    'hogar-y-deco': 'Hogar y Deco',
    'papeles': 'Papeles',
  },
  'salud-y-farmacia': {
    'servicios-de-salud': 'Servicios de Salud',
    'farmacia': 'Farmacia',
    'nutricion-y-deportes': 'Nutrición y Deportes',
    'nutricion-infantil': 'Nutrición Infantil',
    'bienestar-sexual': 'Bienestar Sexual',
    'electrosalud': 'Electrosalud',
  },
  'medicamentos': {
    'venta-libre': 'Venta Libre',
    'venta-bajo-receta': 'Venta Bajo Receta',
  },
}

type Props = { children?: React.ReactNode }

export default function Layout({ children }: Props) {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)

  const category = pathParts[0]
  const subcategory = pathParts[1]

  const categoryName = categoryNames[category] || null
  const subcategoryName = subcategory && category ? (subcategoryNames[category]?.[subcategory] || subcategory.replace(/-/g, ' ')) : null

  const pageTitle = subcategoryName || categoryName

  return (
    <div className={styles.page}>
      <Navbar />
      <Container>
        {pageTitle && (
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>{pageTitle}</h1>
          </header>
        )}
        <Breadcrumb />
        {children}
      </Container>
      <Footer>Footer</Footer>
    </div>
  )
}

export { default as Container } from './container'
