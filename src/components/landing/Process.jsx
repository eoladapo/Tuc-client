import { Reveal } from './Primitives';
import { SplitWords } from './Motion';
import { process } from '../../data/landingContent';

/**
 * The four steps, as a deck of cards.
 *
 * ## The stack is CSS, not ScrollTrigger
 *
 * This section used to pin each panel with ScrollTrigger and scroll-scrub it
 * down as the next one arrived. It worked, but it never felt right, and the
 * reason is structural rather than a matter of tuning: pinning is scroll
 * *hijacking*. The page stops moving the way the reader's hand expects while a
 * full-height panel is held in place, and no amount of easing hides that.
 *
 * So the stack is now `position: sticky` on each `<li>` — the browser's own
 * mechanism for "hold this here while the rest of the container scrolls past".
 * There is no ScrollTrigger left in this file at all. A card sticks, the next
 * one scrolls up and covers it, and the covered card's top edge is left showing,
 * which is what reads as a deck.
 *
 * The practical gains: it cannot jank, it costs no JS, it survives a failed
 * animation load (four plain cards, correctly spaced, in a readable order), and
 * it behaves identically on every width. The previous version needed a
 * `useMediaQuery` branch, a `useGSAP` scene, a `pinSpacing` argument and a
 * mobile-only resize workaround. All of that is gone.
 *
 * ## The fan is what makes it a deck
 *
 * `STICK_FAN` offsets each card a little lower than the one before it. Without
 * it, every card would stick at the same spot and the newest would cover the
 * whole of the previous one — four cards swapping in place, which reads as a
 * slideshow rather than as a stack. The offset leaves 14px of each covered card
 * exposed along the top, so the deck is legible while it builds.
 *
 * That is also why the card carries `py-10` and centres its content: the exposed
 * strip is card padding, so what shows is the blank top of the panel rather than
 * a sliced line of text.
 *
 * ## Cards, not slabs
 *
 * These were full-viewport panels (`min-h-[72svh]`) pinned edge to edge, which
 * cost a screen-and-a-half of scroll per step and made four short paragraphs
 * feel like a long read. They are now a bounded `max-w-3xl` column of compact
 * cards at their natural size, so the whole process is about two screens.
 *
 * The band behind them is flat `secondary-100`. It has no grid overlay and no
 * blurred blob: with panels stacked over it, the band is visible mostly in the
 * gaps and around the edges, where decoration only reads as noise. It is also
 * no longer the dark brand gradient — a full-width saturated purple band behind
 * white cards fought them for attention and made the section feel like an
 * interruption rather than part of the page.
 */
const Process = () => (
  <section id="process" className="scroll-mt-20 bg-secondary-100 py-20 sm:py-24 lg:py-28">
    <div className="container-page">
      <div className="max-w-3xl">
        <Reveal>
          <span className="eyebrow">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-500" />
            {process.eyebrow}
          </span>
        </Reveal>
        <SplitWords
          as="h2"
          text={process.heading}
          delay={0.06}
          className="mt-4 block text-3xl font-extrabold tracking-tight text-secondary-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
        />
      </div>
    </div>

    <div className="container-page mt-14">
      {/* `space-y-6` is what gives the deck its scroll room: each card sticks
          until the container's bottom edge catches it, and the container is as
          tall as the cards stacked end to end. */}
      <ol className="max-w-3xl space-y-6">
        {process.steps.map((step, i) => {
          const Icon = step.icon;

          return (
            <li
              key={step.step}
              // `top` is where this card sticks, fanned one step lower than the
              // card before it. `zIndex` is what makes each arriving card paint
              // over the stuck ones — a sticky element with a z-index is its own
              // stacking context, so whole cards sort against each other by
              // index rather than by their position in the flow.
              style={{ top: STICK_TOP + i * STICK_FAN, zIndex: i + 1 }}
              className="sticky"
            >
              <div className="flex min-h-[18rem] flex-col justify-center rounded-3xl bg-white px-7 py-10 ring-1 ring-secondary-200 sm:min-h-[20rem] sm:px-10 sm:py-12">
                <div className="flex items-center justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                    <Icon className="h-6 w-6" />
                  </span>
                  {/* A watermark numeral, so it is the lightest thing on the
                      panel: `primary-200`, not a neutral, so it still reads as
                      brand rather than as grey text. */}
                  <span className="text-4xl font-extrabold leading-none tracking-tighter text-primary-200 sm:text-5xl">
                    {step.step}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-bold text-secondary-900 sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-secondary-600 sm:text-lg">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);

/**
 * Where the first card sticks, in px from the top of the viewport.
 *
 * A pixel value rather than `top-0`, because the navbar is sticky at `z-50` and
 * the card has to clear it: the bar is `h-16` (64px) and `lg:h-20` (80px), so
 * 96px sits just under it at both sizes with a little breathing room.
 */
const STICK_TOP = 96;

/**
 * How far below the previous card each one sticks, in px.
 *
 * This is the exposed edge of a covered card. It has to stay comfortably under
 * the card's `py-10` (40px), or the strip would show a sliced line of the
 * `h3` instead of blank padding.
 */
const STICK_FAN = 14;

export default Process;
