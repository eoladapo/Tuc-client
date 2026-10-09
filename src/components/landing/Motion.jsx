import { Fragment, useEffect, useRef } from 'react';
import { gsap, MOTION_REDUCED } from '../../utils/gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../utils/cn';

/**
 * Motion primitives that sit on top of the structural ones in `Primitives.jsx`.
 * Both are **GSAP** — this page runs one animation library, so there is no
 * second system that could fight it for a node's `transform`.
 */

/* ── SplitWords ──────────────────────────────────────────────────────────── */

/**
 * Reveals a heading one word at a time, each word rising out of its own
 * overflow mask.
 *
 * Renders **static DOM** — the animation is driven by `hooks/useScrollScenes`,
 * which finds `data-words` and staggers its `[data-word]` children. Keeping the
 * movement out of this component is what lets the entrance reverse on scroll
 * like every other section's, instead of being a one-shot island.
 *
 * The words are split at render time in JSX rather than with GSAP's SplitText,
 * which rewrites the DOM behind React's back — the exact thing that breaks
 * under the React Compiler. Two details worth keeping:
 *
 * - The mask carries `pb-[0.15em] -mb-[0.15em]`. Without it `overflow-hidden`
 *   clips the descenders off g, y, j and p.
 * - The heading gets an `aria-label` with the full sentence and the words are
 *   `aria-hidden`, so a screen reader reads one sentence instead of a string of
 *   fragments with gaps between them.
 *
 * @param {string} text - the heading text
 * @param {string} [as='span'] - element to render; pass 'h2'/'h3' for headings
 * @param {string} [wordClassName] - applied to each word span (e.g. a gradient)
 * @param {string} [className] - applied to the heading element itself
 * @param {number} [stagger=0.045] - seconds between words
 * @param {number} [delay=0] - seconds to hold before the first word
 */
export const SplitWords = ({
  text,
  as: Tag = 'span',
  className = '',
  wordClassName = '',
  stagger = 0.045,
  delay = 0,
}) => {
  const words = String(text).split(' ');

  return (
    <Tag
      className={className}
      aria-label={text}
      data-words
      style={{ '--reveal-delay': `${delay}s`, '--word-stagger': `${stagger}s` }}
    >
      <span aria-hidden="true">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.15em] -mb-[0.15em] align-bottom">
              <span data-word className={cn('inline-block', wordClassName)}>
                {word}
              </span>
            </span>
            {/* Real space node between the masks — inline-blocks collapse
                whitespace, so the gap has to be explicit. */}
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
};

/* ── TiltCard ────────────────────────────────────────────────────────────── */

/**
 * Tilts its child toward the pointer in 3D and lifts it on hover.
 *
 * Active only for a fine pointer that can actually hover, so touch devices and
 * reduced-motion visitors get a completely static card.
 *
 * The tilt is smoothed with `gsap.quickTo`, which is built for exactly this —
 * a long-lived setter that eases toward each new value instead of starting a
 * fresh tween per pointer event.
 *
 * NOTE for anyone editing a card wrapped in this: the lift is owned here. Do
 * not also put Tailwind's `hover:-translate-y-1` on the child — GSAP writes an
 * inline `transform`, which silently wins over the class, so the lift would
 * just stop working.
 */
export const TiltCard = ({ children, className = '', max = 7, lift = 6, ...rest }) => {
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduceMotion = useMediaQuery(MOTION_REDUCED);
  const enabled = finePointer && !reduceMotion;

  const ref = useRef(null);
  const tilt = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!enabled) {
      // Drop any transform left behind from a moment when this *was* enabled.
      // Without it, flipping the pointer type or the motion preference mid-hover
      // would strand the card part-tilted and part-lifted.
      tilt.current = null;
      gsap.set(el, { clearProps: 'transform' });
      return;
    }

    const context = gsap.context(() => {
      // `transformPerspective` rather than a `perspective` on a wrapper div:
      // it does the same job for this element's own rotation and keeps the DOM
      // to one node. Deliberately *not* `preserve-3d` — no child carries its own
      // 3D transform, and a 3D rendering context makes the card's shadow and
      // rounded-corner clipping render unpredictably mid-tilt.
      gsap.set(el, { transformPerspective: 1000 });
      tilt.current = {
        rotateX: gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power2.out' }),
        rotateY: gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power2.out' }),
        y: gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power2.out' }),
      };
    }, el);

    return () => {
      tilt.current = null;
      context.revert();
    };
  }, [enabled]);

  const handleMove = (event) => {
    const set = tilt.current;
    if (!enabled || !set || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width; // 0 → 1 across the card
    const py = (event.clientY - rect.top) / rect.height;

    set.rotateY(gsap.utils.clamp(-max, max, (px - 0.5) * 2 * max));
    set.rotateX(gsap.utils.clamp(-max, max, (0.5 - py) * 2 * max));
  };

  const handleEnter = () => {
    if (enabled) tilt.current?.y(-lift);
  };

  // Always resets, even if `enabled` flipped mid-hover — otherwise the card
  // would be left stuck in its lifted position.
  const handleLeave = () => {
    const set = tilt.current;
    if (!set) return;
    set.y(0);
    set.rotateX(0);
    set.rotateY(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      className={cn('h-full', className)}
      {...rest}
    >
      {children}
    </div>
  );
};
