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
 * The Process section pins on phones as well as desktops, and a phone's address
 * bar collapsing is a viewport-height resize that would otherwise make every
 * pinned card jump mid-scroll. ScrollTrigger's documented remedy is to ignore
 * height-only resizes on mobile; width changes and orientation still refresh.
 * The panels also use `svh` units, so their own height does not move when the
 * bar hides — the two fixes cover the same problem from both ends.
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
