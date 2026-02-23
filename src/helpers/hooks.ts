import { useState, useEffect } from 'react'

/**
 * Hook to detect if a media query matches
 * @param query - CSS media query string (e.g., '(max-width: 767px)')
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        // Check initial state
        const mediaQuery = window.matchMedia(query)
        setMatches(mediaQuery.matches)

        // Listen for changes
        const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
        mediaQuery.addEventListener('change', handler)

        return () => mediaQuery.removeEventListener('change', handler)
    }, [query])

    return matches
}
