'use client'

import { useSyncExternalStore } from 'react'

/**
 * Hook to detect if a media query matches
 * @param query - CSS media query string (e.g., '(max-width: 767px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        (callback) => {
            const mediaQuery = window.matchMedia(query)
            mediaQuery.addEventListener('change', callback)

            return () => mediaQuery.removeEventListener('change', callback)
        },
        () => window.matchMedia(query).matches,
        () => false,
    )
}
