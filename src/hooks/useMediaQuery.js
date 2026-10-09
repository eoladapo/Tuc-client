import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query from React.
 *
 * For decisions that genuinely have to be made in React rather than in CSS: a
 * different component, a different event handler, a GSAP scene that should not
 * be built at all. `TiltCard` is the current caller — its tilt is a JS pointer
 * handler driving a GSAP tween, so "is this a fine pointer, and has the visitor
 * asked for less motion" is a question CSS cannot answer on its behalf.
 *
 * Anything that only changes how something *looks* belongs in a Tailwind
 * variant, not here.
 *
 * @param {string} query - e.g. '(min-width: 1024px)'
 * @returns {boolean} whether the query currently matches
 */
export const useMediaQuery = (query) => {
  const subscribe = useCallback(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  // Third argument is the server snapshot — this is a plain SPA, but returning
  // a definite `false` keeps the hook safe if it is ever rendered on a server.
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};

export default useMediaQuery;
