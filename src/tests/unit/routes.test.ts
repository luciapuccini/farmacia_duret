import { describe, it, expect } from 'vitest'
import { categoryNameToPath } from '@/helpers/routes'

describe('categoryNameToPath', () => {
  it('lowercases plain ASCII names', () => {
    expect(categoryNameToPath('Ofertas')).toBe('/ofertas')
  })

  it('removes Spanish diacritics', () => {
    expect(categoryNameToPath('Dermocosmética')).toBe('/dermocosmetica')
    expect(categoryNameToPath('Nutrición')).toBe('/nutricion')
  })

  it('converts spaces to hyphens', () => {
    expect(categoryNameToPath('Cuidado Personal')).toBe('/cuidado-personal')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    expect(categoryNameToPath('Salud  y  Farmacia')).toBe('/salud-y-farmacia')
  })

  it('removes special characters like & and !', () => {
    expect(categoryNameToPath('Hogar & Alimentos!')).toBe('/hogar-alimentos')
  })

  it('preserves existing hyphens', () => {
    expect(categoryNameToPath('Anti-edad')).toBe('/anti-edad')
  })

  it('trims leading and trailing spaces', () => {
    expect(categoryNameToPath('  belleza  ')).toBe('/belleza')
  })

  it('handles an already-normalized name', () => {
    expect(categoryNameToPath('belleza')).toBe('/belleza')
  })

  it('handles an empty string', () => {
    expect(categoryNameToPath('')).toBe('/')
  })
})
