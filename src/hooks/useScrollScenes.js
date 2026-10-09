import { useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, MOTION_OK } from '../utils/gsap';

/**
 * The landing page's scroll-entrance system — one hook, mounted once in
 * `LandingPage`, that gives every marked element its own ScrollTrigger.
 *
 * Sections opt in through *markup*, not through GSAP code: an element carrying
 * `data-reveal` fades and rises, one carrying `data-words` reveals its
 * `[data-word]` children out of their masks. Adding a section later needs no
 * animation code at all, which is the point.
 *
 * ## Rules this file exists to enforce
 *
 * **The hidden state is set by GSAP at runtime, never by CSS.** Nothing here
 * renders an element at `opacity: 0` in JSX. If GSAP fails to load — or a
 * `gsap.matchMedia` callback never runs because the query did not match — the
 * content is simply *visible*. A CSS-first hidden state would instead ship a
 * blank page on any JS error, which is the one failure mode worth designing
 * around. The corollary is in `prune()`: anything this hook hides, it can also
 * un-hide.
 *
 * **This hook owns every scroll entrance on the page.** `TiltCard`, the FAQ
 * accordion and the hero chips are also GSAP, but they are separate scenes, and
 * no element is animated by two of them. Two tweens writing `transform` to one
 * node fight per-frame and the last writer silently wins, so the split is by
 * element, not by library.
 *
 * ## Why a plain layout effect and not `useGSAP`
 *
 * `useGSAP` is the house style (see `utils/gsap.js`) and would be correct for
 * the tweens. But this hook also owns a `MutationObserver`, and it must tear
 * that down with the same certainty it tears down its animations. A bare effect
 * wrapping an explicit `gsap.context()` gives one obvious place where both are
 * released. `gsap.context()` is exactly what `useGSAP` wraps, so this is equally
 * safe under `<StrictMode>` — the cleanup reverts every tween and trigger, and
 * the double-mount just re-runs the effect.
 *
 * It is a **layout** effect, not a passive one, and that matters: `Reveal`
 * renders its content visible and this hook is what hides it, so a passive
 * effect would let the browser paint the entire page and *then* hide it — a
 * full-page flash on every load. Layout effects run before paint, so the
 * hidden state is in place for the first frame.
 */

/**
 * ScrollTrigger's `toggleActions` reads as four slots:
 * `onEnter onLeave onEnterBack onLeaveBack`.
 *
 * `rise` reverses on the way back up, so a section re-animates in both
 * directions rather than firing once and dying. `once` is the opt-out for
 * reading copy: a paragraph that vanishes while someone is re-reading it is
 * hostile, so those blocks play and stay.
 */
const TOGGLE = {
  rise: 'play none none reverse',
  once: 'play none none none',
  wipe: 'play none none reverse',
};

const REVEAL_SELECTOR = '[data-reveal]';
const WORDS_SELECTOR = '[data-words]';

/** Reads a CSS custom property off the element and parses it as a number. */
const numberVar = (el, name, fallback) => {
  const value = parseFloat(getComputedStyle(el).getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
};

/**
 * Un-claims elements that are gone from the document or no longer marked, and
 * returns how many it released.
 *
 * `Courses` renders its cards from a refetch, so a batch of them can be replaced
 * wholesale; anything this hook had claimed that is now detached would otherwise
 * keep its tween and its ScrollTrigger alive for the life of the page. The
 * `matches` check covers the other direction — an element still in the document
 * whose marker has been removed.
 *
 * `clearProps` is what makes it safe: a killed tween leaves behind whatever it
 * last wrote, so without the reset, pruning a never-entered element would hide
 * it permanently instead of revealing it.
 *
 * @param {Map<Element, gsap.core.Tween[]>} owned - tweens by element
 * @param {string} selector - the marker that justifies keeping an element
 */
const prune = (owned, selector) => {
  let released = 0;

  owned.forEach((tweens, el) => {
    if (el.isConnected && el.matches(selector)) return;

    tweens.forEach((tween) => tween.kill());
    gsap.set(el, { clearProps: 'opacity,transform,clipPath' });
    owned.delete(el); // safe mid-forEach: the current entry is already visited
    released += 1;
  });

  return released;
};

/** Returns how many elements it claimed, so the caller knows if layout moved. */
const setupReveals = (owned) => {
  let added = 0;

  gsap.utils.toArray(REVEAL_SELECTOR).forEach((el) => {
    if (owned.has(el)) return;
    added += 1;

    const variant = el.dataset.reveal;
    const delay = numberVar(el, '--reveal-delay', 0);
    const scrollTrigger = {
      trigger: el,
      start: 'top 88%',
      toggleActions: TOGGLE[variant] || TOGGLE.rise,
    };

    // The gradient-clause wipe needs both ends spelled out: `gsap.from` would
    // have to interpolate toward the element's computed `clip-path`, which is
    // `none`, and there is nothing to tween from there.
    if (variant === 'wipe') {
      owned.set(el, [
        gsap.fromTo(
          el,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 0.9,
            delay,
            ease: 'power2.inOut',
            scrollTrigger,
          }
        ),
      ]);
      return;
    }

    // `fromTo` rather than `from`: GSAP re-renders a `from` tween's start values
    // on every `ScrollTrigger.refresh()`, and this page refreshes more than most
    // — once when the webfont settles, and again on each batch of async Courses
    // cards. That would flash already-revealed elements back to hidden. Naming
    // both ends makes a refresh a no-op.
    owned.set(el, [
      gsap.fromTo(
        el,
        { opacity: 0, y: numberVar(el, '--reveal-y', 24) },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay,
          ease: 'power3.out',
          scrollTrigger,
        }
      ),
    ]);
  });

  return added;
};

const setupWords = (owned) => {
  let added = 0;

  gsap.utils.toArray(WORDS_SELECTOR).forEach((el) => {
    if (owned.has(el)) return;

    const words = el.querySelectorAll('[data-word]');
    if (!words.length) return;

    added += 1;

    owned.set(el, [
      gsap.fromTo(
        words,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 0.7,
          delay: numberVar(el, '--reveal-delay', 0),
          stagger: numberVar(el, '--word-stagger', 0.045),
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: TOGGLE.rise,
          },
        }
      ),
    ]);
  });

  return added;
};

export const useScrollScenes = () => {
  useLayoutEffect(() => {
    let observer = null;
    let frame = 0;
    let context = null;

    // Claimed targets are tracked *here*, in memory — deliberately not with a
    // `data-scene-ready` attribute on the element.
    //
    // `<StrictMode>` mounts, unmounts and remounts this effect in development.
    // The cleanup below reverts the tweens and restores every inline style, but
    // it cannot un-write an attribute we stamped into the DOM: the second pass
    // would find every element already marked and animate nothing. Tracking in
    // the effect's own scope means a remount starts empty and re-claims
    // everything, while a single run still claims each element once.
    //
    // A `Map` rather than the obvious `WeakSet`, because `prune()` has to walk
    // what was claimed. That keeps a strong reference to each node, so prune is
    // also what stops a refetched Courses batch from accumulating — it runs on
    // every observer pass and drops anything detached.
    const reveals = new Map();
    const words = new Map();

    /**
     * One full reconcile: release what is no longer marked, claim what is.
     *
     * Everything is idempotent, so running it on every mutation is cheap and
     * running it when nothing changed is a no-op.
     */
    const pass = () => {
      let changed = 0;
      changed += prune(reveals, REVEAL_SELECTOR);
      changed += prune(words, WORDS_SELECTOR);
      changed += setupReveals(reveals);
      changed += setupWords(words);

      // New trigger targets change page height, so re-measure — but only when
      // something actually changed, not on every mutation.
      if (changed > 0) ScrollTrigger.refresh();
    };

    context = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Everything motion-related lives inside this query. When it does not
      // match (reduced motion), the callback never runs, so nothing is ever
      // hidden and the page is a plain static document.
      mm.add(MOTION_OK, () => {
        // First pass — created synchronously while the context is active, so
        // the context records these and reverts them on unmount by itself.
        pass();

        // Later passes come from the observer, long after the context callback
        // has returned. Those are NOT recorded automatically, so they are
        // routed through `context.add()` — otherwise an async card's tween and
        // its ScrollTrigger would outlive the page that owns them.
        const reconcile = () => context.add(pass);

        // Courses renders its cards from a react-query response that lands
        // *after* mount, so a one-shot query on mount would miss them and they
        // would appear with no entrance at all.
        //
        // `childList` catches those cards arriving, and the ones leaving when a
        // batch is replaced. The `attributes` half is cheap insurance for an
        // element whose marker is added or removed in place — that is an
        // attribute change, not a child change, and this hook would otherwise
        // never reconsider it. `attributeFilter` is applied by
        // the browser, so style and class churn elsewhere on the page costs
        // nothing here.
        //
        // Neither half can loop: this hook writes no attributes (claims live in
        // the Maps above) and never inserts nodes. GSAP's pin-spacer insertion
        // is a childList change and fires once, but by then everything is
        // already claimed and the pass is a no-op.
        observer = new MutationObserver(() => {
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0;
            reconcile();
          });
        });
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['data-reveal', 'data-words'],
        });

        return () => {
          observer?.disconnect();
          observer = null;
        };
      });
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      observer = null;
      context.revert();
      reveals.clear();
      words.clear();
    };
  }, []);
};

export default useScrollScenes;
