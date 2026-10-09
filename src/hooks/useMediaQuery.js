import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to a CSS media query from React.
 *
 * Used to switch a section's *layout* rather than just its styling. The Process
 * section is the reason this exists: its pinned stack is driven by GSAP, and the
 * reduced-motion fallback is a structurally different grid — different element
 * wrappers, different containments, different entrance attributes. A CSS-only
 * version would have to animate a layout that must also work unanimated.
 * Deciding in React means the fallback is a real layout rather than an
 * animation switched off.
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
