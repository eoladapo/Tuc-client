import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger, MOTION_REDUCED } from '../../utils/gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';

/**
 * Thin brand bar at the very top showing reading progress.
 *
 * Driven by a ScrollTrigger spanning the whole document rather than by a scroll
 * listener, so it reads the same progress value ScrollTrigger is already
 * tracking and stays in step with the pinned Process section — a naive
 * `scrollY / scrollHeight` would drift once the pin inserts its spacer.
 *
 * This is the one scene that stays *functional* under reduced motion: it is a
 * progress readout, not decoration, so hiding it would remove information.
 * `prefers-reduced-motion` therefore only drops the easing — the bar tracks the
 * scroll position directly instead of gliding toward it.
 */
const ScrollProgress = () => {
  const ref = useRef(null);
  const reduceMotion = useMediaQuery(MOTION_REDUCED);

  useLayoutEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    const context = gsap.context(() => {
      gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });

      // `quickTo` is the right tool for a value that changes every frame — one
      // persistent setter that eases toward each new target, instead of a new
      // tween per scroll event.
      const glide = reduceMotion
        ? null
        : gsap.quickTo(bar, 'scaleX', { duration: 0.25, ease: 'power2.out' });

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (glide) glide(self.progress);
          else gsap.set(bar, { scaleX: self.progress });
        },
      });
    }, bar);

    return () => context.revert();
  }, [reduceMotion]);

  // `origin-left` is the no-JS fallback: it is what makes an unanimated bar
  // grow rightward instead of out from the centre. GSAP overrides it inline.
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-primary-500 via-primary-600 to-primary-800"
    />
  );
};

export default ScrollProgress;
