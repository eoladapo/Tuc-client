import { useLayoutEffect, useRef, useState } from 'react';
import { HiChevronDown } from 'react-icons/hi2';
import { gsap, MOTION_REDUCED } from '../../utils/gsap';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { SectionHeading, Reveal } from './Primitives';
import { faq } from '../../data/landingContent';
import { cn } from '../../utils/cn';

/**
 * One question and its answer.
 *
 * A component rather than a block inside the parent's `.map()` because the
 * height animation needs its own ref and effect, and hooks cannot be called in
 * a loop.
 *
 * The panel is **always mounted** and collapsed by animating `height`, rather
 * than being added and removed from the tree. That buys two things: the
 * transition works in both directions without an exit animation, and if the JS
 * never runs the panel simply renders at its natural height — every answer
 * visible — instead of the whole FAQ collapsing into a row of dead buttons.
 */
const FaqItem = ({ item, index, isOpen, onToggle }) => {
  const panelRef = useRef(null);
  const primed = useRef(false);
  const reduceMotion = useMediaQuery(MOTION_REDUCED);

  const panelId = `faq-panel-${index}`;
  const buttonId = `faq-button-${index}`;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    // The first paint has to be a *set*, not a tween: a panel that starts open
    // would otherwise animate itself open on load, and every closed panel would
    // flash its content before collapsing. Under StrictMode this branch is
    // skipped on the second run (the ref survives the double-invoke), which is
    // harmless — the target values are already the ones being set.
    if (!primed.current) {
      primed.current = true;
      gsap.set(panel, { height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 });
      return;
    }

    const tween = gsap.to(panel, {
      height: isOpen ? 'auto' : 0,
      opacity: isOpen ? 1 : 0,
      // A disclosure still has to *disclose* for a reduced-motion visitor, so
      // the gate is a zero duration rather than skipping the update.
      duration: reduceMotion ? 0 : 0.32,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    return () => tween.kill();
  }, [isOpen, reduceMotion]);

  return (
    <Reveal delay={index * 0.04} once>
      <div
        className={cn(
          'overflow-hidden rounded-2xl border bg-white transition-colors',
          isOpen ? 'border-primary-200 shadow-soft' : 'border-secondary-200'
        )}
      >
        <h3>
          <button
            id={buttonId}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={onToggle}
            className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
          >
            <span className="text-lg font-bold text-secondary-900">{item.q}</span>
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300',
                isOpen
                  ? 'rotate-180 bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-600'
              )}
            >
              <HiChevronDown className="h-5 w-5" />
            </span>
          </button>
        </h3>

        <div
          ref={panelRef}
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          // Collapsed panels are still in the DOM, so they have to be hidden
          // from assistive tech explicitly. Safe here because the panel holds
          // plain text — there is nothing focusable to trap behind it.
          aria-hidden={!isOpen}
          className="overflow-hidden"
        >
          <p className="px-6 pb-6 pr-16 text-base leading-relaxed text-secondary-600">
            {item.a}
          </p>
        </div>
      </div>
    </Reveal>
  );
};

const Faq = () => {
  // Single-open accordion; -1 means everything is collapsed.
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="section-y scroll-mt-20 bg-secondary-50">
      <div className="container-page">
        <SectionHeading eyebrow={faq.eyebrow} heading={faq.heading} />

        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {faq.items.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
