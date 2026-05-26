import { describe, it, expect } from 'vitest'
import { nameToSlug } from '@/utils/nameToSlug'

describe('nameToSlug', () => {
  it('lowercases plain ASCII names', () => {
    expect(nameToSlug('Belleza')).toBe('belleza')
  })

  it('removes Spanish diacritics', () => {
    expect(nameToSlug('Dermocosmética')).toBe('dermocosmetica')
    expect(nameToSlug('Nutrición')).toBe('nutricion')
  })

  it('converts spaces to hyphens', () => {
    expect(nameToSlug('Cuidado Personal')).toBe('cuidado-personal')
  })

  it('collapses multiple spaces into a single hyphen', () => {
    expect(nameToSlug('Salud  y  Farmacia')).toBe('salud-y-farmacia')
  })

  it('removes special characters like & and !', () => {
    expect(nameToSlug('Hogar & Alimentos!')).toBe('hogar-alimentos')
  })

  it('preserves existing hyphens', () => {
    expect(nameToSlug('Anti-edad')).toBe('anti-edad')
  })

  it('trims leading and trailing spaces', () => {
    expect(nameToSlug('  belleza  ')).toBe('belleza')
  })

  it('handles an already-normalized name', () => {
    expect(nameToSlug('belleza')).toBe('belleza')
  })

  it('handles an empty string', () => {
    expect(nameToSlug('')).toBe('')
  })
})
