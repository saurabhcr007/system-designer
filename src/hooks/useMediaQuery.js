import { useState, useEffect } from 'react';

/**
 * Custom hook to detect media query matches (e.g., breakpoints).
 * @param {string} query The media query to match (e.g., '(max-width: 768px)')
 * @returns {boolean} Whether the query matches
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(
        () => typeof window !== 'undefined' ? window.matchMedia(query).matches : false
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mq = window.matchMedia(query);
        const handler = (e) => setMatches(e.matches);

        // Modern browsers
        mq.addEventListener('change', handler);

        // Initial check
        setMatches(mq.matches);

        return () => mq.removeEventListener('change', handler);
    }, [query]);

    return matches;
}
