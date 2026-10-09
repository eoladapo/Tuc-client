import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

/**
 * Single GSAP bootstrap — the only module in the app that imports from `gsap`.
 * Everything else imports from here, the same way they import `cn` rather than
 * reaching into `clsx`/`tailwind-merge` directly.
 *
 * Why `useGSAP` and not a plain `useEffect`: it wraps `gsap.context()`, which
 * records every tween and ScrollTrigger created inside the callback and reverts
 * them on unmount. `<StrictMode>` in main.jsx double-invokes effects in dev, so
 * a bare effect would build two pinned sections and leak one of them.
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * No scene on this page pins any more — the Process deck is CSS `position:
 * sticky` — but a phone's address bar collapsing is still a viewport-height
 * resize, and ScrollTrigger reads one as a reason to re-measure every trigger on
 * the page. For a page made of scroll entrances that is pure churn: nothing has
 * actually moved, and a re-measure mid-scroll is the one way an entrance can
 * visibly stutter. ScrollTrigger's documented remedy is to ignore height-only
 * resizes on mobile; width changes and orientation still refresh.
 */
ScrollTrigger.config({ ignoreMobileResize: true });

/**
 * GSAP writes inline transforms rather than running CSS animations, so the
 * global `prefers-reduced-motion` block in index.css does NOT stop it. Any
 * scene that moves things must gate itself on this query via `gsap.matchMedia`.
 */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

/** The inverse, for components that need to branch in React rather than in CSS. */
export const MOTION_REDUCED = '(prefers-reduced-motion: reduce)';

/** True when the visitor has asked their OS for less motion. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export { gsap, ScrollTrigger, useGSAP };
