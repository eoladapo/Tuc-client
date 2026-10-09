import { useRef } from 'react';
import { gsap, ScrollTrigger, MOTION_OK, useGSAP } from '../../utils/gsap';
import { cn } from '../../utils/cn';
import { panels } from '../../data/landingContent';

/**
 * Brand illustrations — live product panels rather than drawings.
 *
 * These began as hand-built SVG scenes (a painted dashboard, a painted funnel).
 * Pictures of software read as decoration; a panel that *behaves* like software
 * reads as a product. So each one is built from real DOM — Tailwind tokens for
 * every colour, real flex/grid layout — and choreographed by GSAP when it
 * scrolls into view.
 *
 * ## No container, on purpose
 *
 * These used to sit inside a white card with a drop shadow and a blurred purple
 * glow behind it. That was wrong twice over: the box was doing all the visual
 * work while the panel — the thing worth looking at — was the quietest element
 * on the row, and the two surfaces (soft shadowed card, flat UI panel) fought
 * each other.
 *
 * So the panel **is** the surface. One flat `bg-secondary-100` field, no
 * border, no shadow, no glow, and the caller supplies nothing but a size. The
 * internal insets are white and the internal marks are brand purple, which is
 * where all the contrast lives.
 *
 * ## Rules for these panels
 *
 * **Tokens, never hex.** The SVG versions hard-coded hex values; that is how
 * artwork drifts off-palette. Everything here is `bg-primary-*` /
 * `bg-secondary-*` / `text-secondary-*`, so a palette change moves it for free.
 *
 * **Tone-check every surface you add.** The panel field is `secondary-100`, so a
 * `secondary-100` inset in it is invisible — that is why the meter tracks are
 * `secondary-200` and the wells and chips are `white`. Nothing on this page is
 * more annoying to debug than a shape that is present and unseeable.
 *
 * **No figures.** Bars, arcs and tiles convey shape; the labels name what they
 * stand for. Nothing carries a number, which is what lets the page keep §11's
 * promise that it holds no statistics we cannot substantiate.
 *
 * **Decorative as a unit.** Each root is `role="img"` with a descriptive
 * `aria-label`, which also makes the internal labels presentational to a screen
 * reader — the same announcement the old SVGs gave, without a screen reader
 * reading out fake UI chrome.
 *
 * **Nothing is hidden in markup.** Every "from" value is written by `fromTo` at
 * runtime. If GSAP never runs, the panel is a complete, static, visible UI.
 */

/* ── Shared scene plumbing ───────────────────────────────────────────────── */

/**
 * Runs one panel's entrance timeline when the panel scrolls into view.
 *
 * @param {import('react').RefObject<HTMLElement>} root - the panel root
 * @param {(tl: gsap.core.Timeline, q: (sel: string) => Element[]) => void} build
 */
const usePanelScene = (root, build) => {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // The gate. When this does not match, no timeline is ever built, so no
      // "from" value is ever written and the panel is ordinary static UI.
      mm.add(MOTION_OK, () => {
        // Built paused, then handed to ScrollTrigger below. A bare timeline
        // would play the moment it was created — i.e. on page load, wherever
        // the panel happens to be.
        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

        // `gsap.utils.selector` rather than relying on the surrounding scope:
        // these tweens are created on a timeline, and a scoped selector cannot
        // silently resolve against the whole document.
        build(tl, gsap.utils.selector(root.current));

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 85%',
          // The page's `rise` policy — the same one `useScrollScenes` applies,
          // so panels re-run on scroll-up like every other entrance here.
          toggleActions: 'play none none reverse',
          animation: tl,
          // A reload that starts below this panel leaves the timeline on its
          // first frame, which is an invisible panel. Jumping to the last frame
          // when the trigger is already behind the scroll position makes
          // "already scrolled past" read the same as "played through".
          onRefresh: (self) => {
            if (self.progress === 1) tl.progress(1);
          },
        });
      });
    },
    { scope: root }
  );
};

/* ── Shape tables ────────────────────────────────────────────────────────── */
/* Proportions live here, not in the content file: these are drawing
   instructions, and a number in `landingContent.js` would read as a claim. */

const METERS = ['w-[86%]', 'w-[62%]', 'w-[41%]'];

const BARS = ['h-[34%]', 'h-[52%]', 'h-[41%]', 'h-[67%]', 'h-[56%]', 'h-[81%]', 'h-full'];

const FUNNEL = [
  'h-4 w-[88%] bg-primary-300',
  'h-3.5 w-[58%] bg-primary-500',
  'h-3 w-[30%] bg-primary-700',
];

/**
 * The calendar's six cells. `bar` is the caption line drawn along the bottom of
 * each tile — without it a grid of solid squares reads as a colour swatch
 * rather than a wall of posts, and the bar's tone is per-tile because
 * white-at-60% is invisible on the pale ones.
 */
const TILES = [
  { tone: 'bg-primary-500', glyph: 'play', bar: 'bg-white/70' },
  { tone: 'bg-secondary-300', bar: 'bg-secondary-600/50' },
  { tone: 'bg-primary-200', bar: 'bg-primary-700/40' },
  { tone: 'bg-primary-100', bar: 'bg-primary-700/40' },
  { tone: 'bg-primary-700', bar: 'bg-white/60' },
  { tone: 'bg-secondary-200', bar: 'bg-secondary-500/60' },
];

const AVATARS = ['bg-primary-500', 'bg-primary-300', 'bg-primary-700', 'bg-primary-400'];

/** The panel field. Flat — this is the whole "container". */
const PANEL = 'rounded-3xl bg-secondary-100 p-5 sm:p-6';

/** Window chrome. Shared so all three panels read as the same product. */
const Chrome = ({ caption }) => (
  <div className="flex items-center gap-2">
    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary-300" />
    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary-300" />
    <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full bg-secondary-300" />
    {/* `min-w-0` is what lets it truncate: a flex item will not shrink below its
        own min-content width without it, so `truncate` alone would do nothing
        and a long caption would spill out of the panel instead. */}
    <span className="ml-2 min-w-0 truncate text-xs font-bold uppercase tracking-[0.18em] text-secondary-500">
      {caption}
    </span>
  </div>
);

/* ── Hero: campaign dashboard ────────────────────────────────────────────── */

/**
 * The hero's product shot. Meters fill, a bar chart rises off its baseline, a
 * trend line draws itself, and a live-status card settles in over the corner.
 */
export const HeroArt = ({ className = '' }) => {
  const root = useRef(null);
  const copy = panels.dashboard;

  usePanelScene(root, (tl, q) => {
    tl.fromTo(
      q('[data-meter]'),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.65, stagger: 0.09, transformOrigin: 'left center' }
    )
      .fromTo(
        q('[data-bar]'),
        { scaleY: 0 },
        { scaleY: 1, duration: 0.7, stagger: 0.055, transformOrigin: 'bottom' },
        0.15
      )
      .fromTo(
        q('[data-draw]'),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' },
        0.35
      )
      .fromTo(q('[data-float]'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0.55);
  });

  return (
    <div
      ref={root}
      role="img"
      aria-label="An animated mock-up of a campaign dashboard: reach, engagement and conversion meters filling, a rising bar and line chart, and a live status card"
      className={cn('relative', PANEL, className)}
    >
      <Chrome caption={copy.caption} />

      <ul className="mt-5 space-y-3.5">
        {copy.metrics.map((metric, i) => (
          <li key={metric}>
            <span className="text-sm font-medium text-secondary-600">{metric}</span>
            <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-secondary-200">
              <span
                data-meter
                className={cn('block h-full origin-left rounded-full bg-primary-500', METERS[i])}
              />
            </span>
          </li>
        ))}
      </ul>

      {/* The chart well is white, not `secondary-50` — against the panel's
          `secondary-100` a lighter neutral would barely register. */}
      <div className="mt-5 rounded-2xl bg-white p-4">
        <div className="flex h-20 items-end gap-1.5">
          {BARS.map((height, i) => (
            <span
              key={i}
              data-bar
              className={cn('w-full origin-bottom rounded-t bg-primary-500', height)}
            />
          ))}
        </div>

        {/* `pathLength="1"` normalises the path so one dash value fits any
            curve — no measuring the geometry in JS. */}
        <svg viewBox="0 0 300 60" className="mt-3 h-14 w-full" aria-hidden="true">
          <path
            data-draw
            pathLength="1"
            d="M4 48 C 44 44, 66 28, 100 31 C 134 34, 152 16, 186 13 C 216 10, 250 8, 296 5"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            className="stroke-primary-600"
          />
        </svg>
      </div>

      {/* Live status, overlapping the panel's bottom corner. Flat — white on
          the hero's lavender wash reads without a shadow, and the overlap of
          the panel edge gives it the depth a shadow was doing before. */}
      <div
        data-float
        className="absolute -bottom-5 right-2 w-40 rounded-2xl bg-white p-3.5 sm:-right-4 sm:w-44"
      >
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-600" />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary-600">
            {copy.live}
          </span>
        </div>
        <span className="mt-2.5 block h-1.5 w-3/4 rounded-full bg-secondary-200" />
        <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-secondary-100" />
      </div>
    </div>
  );
};

/* ── Service 01: where the budget goes ───────────────────────────────────── */

/**
 * The funnel, as a funnel: each stage a bar that narrows and darkens, drawn
 * outward from its own centre. The ring and the trend line below give the
 * panel a second axis of "this is working" without stating a figure.
 */
export const MarketingArt = ({ className = '' }) => {
  const root = useRef(null);
  const copy = panels.marketing;

  usePanelScene(root, (tl, q) => {
    tl.fromTo(
      q('[data-funnel]'),
      { scaleX: 0 },
      { scaleX: 1, duration: 0.7, stagger: 0.12, transformOrigin: 'center center' }
    )
      .fromTo(
        q('[data-ring]'),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
        0.2
      )
      .fromTo(
        q('[data-draw]'),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut' },
        0.4
      )
      .fromTo(q('[data-pop]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 }, 0.3);
  });

  return (
    <div
      ref={root}
      role="img"
      aria-label="An animated mock-up of a campaign funnel narrowing from awareness through consideration to conversion, with a progress ring and a rising results line"
      className={cn(PANEL, className)}
    >
      <Chrome caption={copy.caption} />

      <ul className="mt-6 space-y-3.5">
        {copy.stages.map((stage, i) => (
          <li key={stage} className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary-500">
              {stage}
            </span>
            <span data-funnel className={cn('block rounded-full', FUNNEL[i])} />
          </li>
        ))}
      </ul>

      <div data-pop className="mt-6 flex items-center gap-5 rounded-2xl bg-white p-4">
        <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0 -rotate-90" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="12"
            className="stroke-secondary-200"
          />
          <circle
            data-ring
            cx="50"
            cy="50"
            r="40"
            fill="none"
            strokeWidth="12"
            strokeLinecap="round"
            pathLength="1"
            className="stroke-primary-500"
          />
        </svg>

        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-500">
            {copy.trend}
          </span>
          <svg viewBox="0 0 240 60" className="mt-2 h-12 w-full" aria-hidden="true">
            <path
              data-draw
              pathLength="1"
              d="M4 50 C 40 46, 60 34, 92 36 C 124 38, 146 18, 178 15 C 204 13, 220 10, 236 6"
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className="stroke-primary-600"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ── Service 02: content calendar ────────────────────────────────────────── */

/**
 * The content system, as a calendar that populates: tiles drop in on a
 * stagger, the format chips follow, then the audience row.
 */
export const SocialArt = ({ className = '' }) => {
  const root = useRef(null);
  const copy = panels.social;

  usePanelScene(root, (tl, q) => {
    tl.fromTo(
      q('[data-tile]'),
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.07 }
    )
      .fromTo(
        q('[data-chip]'),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 },
        '-=0.2'
      )
      .fromTo(
        q('[data-avatar]'),
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.07 },
        '-=0.25'
      );
  });

  return (
    <div
      ref={root}
      role="img"
      aria-label="An animated mock-up of a content calendar filling with post tiles for video, carousel and story formats, followed by an audience row"
      className={cn(PANEL, className)}
    >
      <Chrome caption={copy.caption} />

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {TILES.map((tile, i) => (
          <span
            key={i}
            data-tile
            aria-hidden="true"
            className={cn(
              'relative flex aspect-square items-end overflow-hidden rounded-xl p-2.5',
              tile.tone
            )}
          >
            {tile.glyph === 'play' && (
              <svg
                viewBox="0 0 24 24"
                className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 fill-white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            <span className="flex w-full flex-col gap-1">
              <span className={cn('h-1 w-3/4 rounded-full', tile.bar)} />
              <span className={cn('h-1 w-1/2 rounded-full', tile.bar)} />
            </span>
          </span>
        ))}
      </div>

      {/* White chips, not `secondary-100` ones — this panel's field is
          `secondary-100`, so a chip in that tone would vanish into it. */}
      <ul className="mt-4 flex flex-wrap gap-2">
        {copy.kinds.map((kind) => (
          <li
            key={kind}
            data-chip
            className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-secondary-600"
          >
            {kind}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-3 border-t border-secondary-200 pt-4">
        <span aria-hidden="true" className="flex -space-x-2">
          {AVATARS.map((tone, i) => (
            <span
              key={i}
              data-avatar
              className={cn('h-6 w-6 rounded-full ring-2 ring-white', tone)}
            />
          ))}
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-secondary-500">
          {copy.followers}
        </span>
      </div>
    </div>
  );
};

export default { HeroArt, MarketingArt, SocialArt };
