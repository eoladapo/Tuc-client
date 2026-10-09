# TUC Academy — Style Guide

The single source of truth for how TUC Academy looks and reads. Written for
anyone building a new page, adding a component, or briefing a designer.

**Live version:** run the app and visit [`/style-guide`](src/pages/StyleGuidePage.jsx) —
every token and component below, rendered.

**Machine-readable version:** [`tailwind.config.js`](tailwind.config.js) — the
config *is* the implementation. If this document and the config disagree, the
config wins and this document is a bug.

---

## 1. Brand in one line

> Purple and white, with an ink neutral holding it together and a rationed
> amber accent for small moments of emphasis.

**Who we are talking to:** SME owners, founders and brand owners. People running
a business, not studying marketing. They are short on time and allergic to
theory that never gets applied.

**What that means for design:**

| We want to feel | So we do this |
| --- | --- |
| Professional | Generous white space, restrained colour, one typeface |
| Modern | Purple gradients, soft elevation, rounded geometry, gentle motion |
| Credible | Real numbers, plain language, no hype or stock-photo gloss |
| Approachable | Comfortable type sizes, plain words, obvious next step |

**The one rule that matters:** white is the dominant surface. Purple earns
attention *because* it is rare. A page that is 60% purple has no hierarchy left.

---

## 2. Colour

Two families do almost all the work.

### 2.1 Primary / Brand — purple

Identity and action. Defined in `tailwind.config.js` as `primary`, with `brand`
as an identical alias for semantic use in marketing code.

| Token | Hex | Use |
| --- | --- | --- |
| `primary-50` | `#f6f4ff` | Section tints, icon chips |
| `primary-100` | `#ede9fe` | Badge fills, subtle chips |
| `primary-200` | `#ded5fd` | Borders on tinted surfaces |
| `primary-300` | `#c4b2fb` | Decorative blurs |
| `primary-400` | `#a385f6` | Hover states on dark surfaces |
| `primary-500` | `#8759ef` | Focus rings, accents |
| **`primary-600`** | **`#7539e0`** | **Primary action colour** |
| `primary-700` | `#6528c2` | Primary hover |
| `primary-800` | `#54219e` | Gradient midpoint |
| `primary-900` | `#451d80` | Gradient end |
| `primary-950` | `#2b0f57` | Deepest brand colour |

**Contrast:** white text on `primary-600` measures **6.1:1** — passes WCAG AA for
body text. White on `primary-400` or lighter **fails**; never do it.

### 2.2 Secondary — ink neutral

Text, borders, structure and dark sections. Replaces the old blue-grey primary.

| Token | Hex | Use |
| --- | --- | --- |
| `secondary-50` | `#f8fafc` | Alternating section background |
| `secondary-100` | `#f1f5f9` | Chip and track fills |
| `secondary-200` | `#e2e8f0` | Default border |
| `secondary-300` | `#cbd5e1` | Emphasised border |
| `secondary-400` | `#94a3b8` | Muted text on white |
| `secondary-500` | `#64748b` | Secondary body copy |
| `secondary-600` | `#475569` | Body copy |
| `secondary-700` | `#334155` | Strong body copy |
| `secondary-800` | `#1e293b` | Subheadings |
| `secondary-900` | `#0f172a` | Headings, darkest ink on white |
| `secondary-950` | `#020617` | Footer background |

### 2.3 Accent — amber

A garnish, not a colour. Star ratings, "most popular" flags, one-off highlights.

| Token | Hex |
| --- | --- |
| `accent-100` | `#fef3c7` |
| `accent-500` | `#f59e0b` |
| `accent-600` | `#d97706` |

**Never** use amber for a large fill, a second brand colour, or a primary button.
If you find yourself reaching for amber twice on one screen, you are decorating.

### 2.4 Gradients

| Class | Definition | Use |
| --- | --- | --- |
| `bg-brand-gradient` | `135deg`, `primary-600 → primary-800 → primary-950` | Dark bands: "How it works", final CTA |
| `bg-brand-soft` | `180deg`, `#f6f4ff → #ffffff` | Hero background |
| `text-gradient-brand` | Purple text clip | One emphasised phrase per headline |
| `bg-grid` | 56px purple grid lines | Texture behind hero and dark bands |
| `mask-fade-b` / `mask-fade-x` | Gradient masks | Dissolve grid and marquee edges |

---

## 3. Typography

**One typeface: Plus Jakarta Sans**, loaded from Google Fonts in
[`index.html`](index.html) with weights 300–800.

> ⚠️ Do not add a second font family. The previous `Inter` import in
> `index.css` was removed — it was being loaded but never used, costing a
> render-blocking request.

### Headings

Extrabold, tight tracking, ink colour. One gradient phrase per headline, maximum.

| Role | Classes |
| --- | --- |
| Hero / display | `text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight leading-[1.1]` |
| Section heading | `text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight leading-[1.15]` |
| Card title | `text-xl font-bold` |
| Small title | `text-lg font-bold` |

### Body

| Role | Classes |
| --- | --- |
| Lead paragraph | `text-lg leading-relaxed text-secondary-600` |
| Body copy | `text-base text-secondary-700` |
| Muted / meta | `text-sm text-secondary-500` |
| Eyebrow label | `.eyebrow` component class |

### A note on the type scale

`tailwind.config.js` deliberately **shrinks** `xs` → `3xl` because the dashboard
is a dense data UI. Marketing pages therefore jump to Tailwind's **default**
`4xl`–`7xl` for headlines. Do not "fix" the small scale — it is correct for the
dashboard, and the landing page works around it.

---

## 4. Spacing & layout

| Token | Value | Use |
| --- | --- | --- |
| `.container-page` | `max-w-7xl` + `px-5 sm:px-8 lg:px-12` | Every horizontal container |
| `.section-y` | `py-16 sm:py-20 lg:py-28` | Vertical rhythm between sections |

- Never write `max-w-7xl mx-auto px-4` by hand — use `.container-page` so every
  section shares one gutter.
- Alternating background: white → `secondary-50` → white. It separates sections
  without adding borders.
- Breakpoints in use: `sm` 640, `lg` 1024. Mobile-first always.

### Radius

| Class | px | Use |
| --- | --- | --- |
| `rounded-lg` | 8 | Inputs, small buttons |
| `rounded-xl` | 12 | Buttons, icon chips |
| `rounded-2xl` | 16 | Cards, panels |
| `rounded-3xl` | 24 | Feature cards, pricing |
| `rounded-4xl` | 32 | Full-bleed CTA band |

### Elevation

| Class | Use |
| --- | --- |
| `shadow-card` | Flat dashboard surfaces |
| `shadow-soft` | Resting marketing cards |
| `shadow-lift` | Floating chips, modals |
| `shadow-brand` | Primary CTAs and their hover |
| `shadow-brand-lg` | Featured pricing plan, hero card |

Shadows are **purple-tinted**, not neutral grey — this is what keeps elevated
elements feeling on-brand.

---

## 5. Components

### Buttons

| Variant | Use |
| --- | --- |
| `primary` | The one most important action in view |
| `secondary` | Ink-neutral alternative |
| `outline` | The secondary path beside a primary |
| `ghost` | Tertiary, in dense UI |
| `danger` / `success` | Destructive / confirming actions only |

**Marketing CTA** (larger, squarer, brand shadow) — used on the landing page:

```jsx
<Link className="rounded-xl bg-primary-600 px-7 py-3.5 text-lg font-semibold
                 text-white shadow-brand transition-all
                 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-brand-lg">
  Start free
</Link>
```

**Rules:** one primary button per view. Never two primaries side by side. Every
button needs a visible focus ring (the global `:focus-visible` rule handles it).

### Badges

`primary` · `secondary` · `success` · `warning` · `danger` · `info` · `gray`.
Pill shape, `text-xs font-medium`. For status, not decoration.

### Cards

White, `border-secondary-200`, `rounded-2xl`, `shadow-soft`. Marketing cards add
`hover:-translate-y-1 hover:shadow-brand`. Interactive cards must be a `<Link>`
or `<a>` — never a clickable `<div>`.

### Inputs

`default` variant for forms; `minimal` (underline) for the auth pages. Always
pass `label`; use `error` and `helperText` rather than inventing new markup.

### Illustrations

All brand artwork lives in
[`components/landing/Illustrations.jsx`](src/components/landing/Illustrations.jsx) —
no photography, no icon-library clip art, no stock vectors.

These started as hand-drawn SVG scenes. They are now **animated product UI
panels**: real DOM built from Tailwind tokens, choreographed by GSAP when they
scroll into view. Pictures of software read as decoration; a panel that *behaves*
like software reads as a product.

| Component | Used by | Composition |
| --- | --- | --- |
| `HeroArt` | Hero | Dashboard — meters filling, bar chart rising, sparkline drawing, a live-status card settling in |
| `MarketingArt` | Service 01 | Funnel bars narrowing, a target ring drawing round, a rising results line |
| `SocialArt` | Service 02 | Content-calendar tiles popping in, format chips following, an audience row |

**Rules for adding or editing one:**

1. **The panel is the surface. Do not put it in a card.** These used to sit
   inside a white card with `shadow-soft` *and* a `blur-2xl` purple glow behind
   it, inside a tilting wrapper. That was wrong twice: the box was the most
   prominent object on the row while the panel — the thing worth looking at —
   was the quietest, and two surfaces (soft shadowed card, flat UI panel) were
   fighting. No wrapper, no border, no shadow, no glow, no hover scale.
2. **Tailwind tokens only — never a hex literal.** The SVG versions hard-coded
   hexes and that is exactly how artwork drifts off-palette. `bg-primary-*`,
   `bg-secondary-*`, `text-secondary-*`. A palette change then moves the panels
   for free.
3. **Tone-check every surface you add.** The panel field is `secondary-100`, so
   a `secondary-100` inset inside it is *invisible* — that is why the meter
   tracks are `secondary-200`, and the chart wells and chips are `white`. This
   is the failure mode to watch for: not a broken shape, a shape you cannot see.
4. **No figures.** Bars, arcs and tiles carry the shape; labels carry the
   meaning. A digit in a panel is an invented statistic (see §11). This is why
   the panels read as "Reach / Engagement / Conversions" and never "12.4k".
5. **Labels live in [`data/landingContent.js`](src/data/landingContent.js)**,
   in the `panels` export — never inline in the component (§9).
6. **`role="img"` plus a descriptive `aria-label` on the root.** That announces
   the panel as one thing and makes the internal labels presentational, so a
   screen reader does not read out fake UI chrome.
7. **Nothing is hidden in markup.** Every "from" value (`scaleY: 0`,
   `opacity: 0`, `strokeDashoffset: 1`) is written by `fromTo` at runtime. If
   GSAP never runs, the panel is complete static UI — the same safety property
   the entrances have (§6).
8. **Scale with the container** — `className="h-auto w-full"` from the caller,
   never a fixed width.

They gate through `usePanelScene`, a module-private helper in the same file:
`gsap.matchMedia().add(MOTION_OK, …)` builds a **paused** timeline and hands it
to a ScrollTrigger with `toggleActions: 'play none none reverse'` — the page's
`rise` policy (§6). Under reduced motion the callback never runs, so the panels
are ordinary static UI.

> **Why paused, and why the inner div.** A timeline with no ScrollTrigger plays
> the moment it is built, which would be page load, wherever the panel happens
> to be. And the `onRefresh` guard matters: a reload that starts *below* a panel
> leaves its timeline on frame 0 — an invisible panel — so it jumps to the last
> frame when the trigger is already behind the scroll position.

**Draw-on lines use `pathLength="1"`.** Normalising a path's length lets a
single `strokeDasharray: 1` / `strokeDashoffset: 1 → 0` draw any curve, with no
geometry measured in JS. The dash values are written by GSAP, never in JSX, so a
GSAP failure leaves the line fully drawn.

---

## 6. Motion

One animation library: **GSAP + ScrollTrigger**. `framer-motion` was removed —
two systems was a hazard before it was ever a weight problem.

| Trigger | Tool |
| --- | --- |
| Scroll position | GSAP + ScrollTrigger — every section entrance, word-by-word headings, the Process stack, the nav scroll-spy, the reading-progress bar |
| Pointer | GSAP — `TiltCard` (`gsap.quickTo`), the hero's floating chips |
| User action | GSAP — the FAQ accordion, a height tween |

**The rule is about the trigger, not the library:** if it animates because the
page moved, it belongs in `useScrollScenes`; if it answers a pointer or a click,
it belongs in the component that owns that element.

> ⚠️ **One node, one animator.** GSAP writes inline `transform`, and the last
> writer wins *per frame*. Two tweens animating one node do not blend — they
> fight, silently, and the bug looks like "the animation is a bit off" rather
> than an error. This used to mean "never animate a node with both GSAP and
> framer-motion"; with one library it now means "check the node is not already
> claimed by another scene" before you animate it. The complaint you will
> actually receive is a hover effect that quietly stopped working.

### How the section entrances work

One hook, `useScrollScenes`, mounted once in
[`LandingPage.jsx`](src/pages/landing/LandingPage.jsx). It finds every marked
element on the page and gives it a ScrollTrigger. **Sections opt in through
markup, not GSAP code**, so adding a section needs no animation code:

| Markup | Effect |
| --- | --- |
| `data-reveal` (via `<Reveal>`) | Fade + rise. Delay and distance come from the `--reveal-delay` / `--reveal-y` custom properties |
| `data-reveal="wipe"` | `clip-path` wipe, for the hero's gradient clause |
| `data-words` (via `<SplitWords>`) | Staggers its `[data-word]` children out of their overflow masks |

Timing, easing and the trigger point live in the hook; per-element variation
travels on custom properties, so a section can tune itself without touching JS.

### The hook reconciles, it does not just run once

A one-shot `querySelectorAll` on mount would miss half this page, so the hook
keeps re-checking. Every pass **releases what is no longer marked and claims
what is**, and re-measures only when that changed something:

| What changed | Why it needs a pass |
| --- | --- |
| Courses' cards arrive from react-query after mount | A child was added |
| `Process` switches between the grid and the pinned stack | Its steps gain or lose `data-reveal` — an *attribute* change, not a child change |

That second one is the reason the observer watches attributes as well as child
lists, and the reason un-claiming matters as much as claiming: a killed entrance
tween leaves behind whatever it last wrote, so without clearing the element's
props, un-marking a card that never entered the viewport would hide it
permanently rather than reveal it.

Claims are held in `Map`s in the effect's own scope, never as a
`data-scene-ready` attribute on the element. Under `<StrictMode>` the effect runs
twice in dev, and `gsap.context().revert()` restores inline styles but **cannot
un-write an attribute** — a DOM-attribute marker makes the second run find
everything already claimed and animate nothing at all. This is not hypothetical:
it is the bug that made the whole page render static.

### `toggleActions` — the two policies

ScrollTrigger's `toggleActions` reads as four slots:
`onEnter onLeave onEnterBack onLeaveBack`. Only two combinations are used here:

| Policy | `toggleActions` | Use |
| --- | --- | --- |
| `rise` (default) | `play none none reverse` | Headings, eyebrows, cards, CTAs. Reverses on the way back up, so the page re-animates in both directions instead of firing once and dying |
| `once` | `play none none none` | Reading copy — Services body and outcome, FAQ items, Contact prose and details, the Courses placeholder |

**Use `once` for anything someone reads.** A paragraph that fades back out while
they are mid-sentence is hostile, and it is the one way full reversal makes the
page worse. Pass `once` to `<Reveal>`.

> ⚠️ **The hidden state is applied by GSAP at runtime — never by CSS, and never
> in JSX.** `Reveal` renders a plain `<div>` with its content *visible* and
> merely describes the animation in data attributes. That ordering is the safety
> property: if GSAP fails to load, or the media query does not match, the page
> is an ordinary visible document. An `opacity: 0` class would instead ship a
> blank section on any JS error — the difference between degraded and broken.
> Do not "optimise" it into CSS.

> ⚠️ **Everything is inside `gsap.matchMedia(MOTION_OK)`.** When the query does
> not match, the callback never runs, so nothing is ever hidden.

### ⚠️ GSAP ignores the global reduced-motion rule

`index.css` kills CSS animation under `prefers-reduced-motion` — but GSAP writes
**inline transforms**. It never runs a CSS animation, so that rule does not
touch it. **Every GSAP scene must gate itself:**

```js
gsap.matchMedia().add(`(min-width: 1024px) and ${MOTION_OK}`, () => {
  /* scene */
});
```

`MOTION_OK` is exported from `utils/gsap.js`. Getting this wrong ships a pinned,
scrubbing section to someone who asked for no motion — the worst failure mode on
this page.

Not every gate is a `matchMedia` gate, because not every animation should be
*removed* under reduced motion:

| Scene | Gate |
| --- | --- |
| Section entrances, hero chips, Process stack, illustration panels | `matchMedia(MOTION_OK)` — the scene never runs, so nothing is hidden |
| `TiltCard` | `useMediaQuery(MOTION_REDUCED)` — the card is simply static |
| FAQ accordion | `duration: 0` — the answer still has to *appear*, it just snaps |
| Reading-progress bar | drops its `quickTo` glide, tracks scroll directly — it is a readout, not decoration |

The test is whether the motion is *decoration* or *the information itself*.
Decoration gets removed; information gets delivered instantly.

Import `gsap`, `ScrollTrigger` and `useGSAP` from `utils/gsap.js`, never from
`gsap` directly. `useGSAP` wraps `gsap.context()`, which reverts every tween and
trigger on unmount. That is required here: `<StrictMode>` double-mounts in dev,
so a bare effect would build two pins and leak one.

`useScrollScenes` is the one exception, and it is deliberate: it uses a layout
effect wrapping `gsap.context()` directly, because it also owns a
`MutationObserver` and both must be released together. It must be a **layout**
effect, not a passive one — `Reveal` renders visible and the hook is what hides
it, so a passive effect would let the browser paint the whole page and then hide
it, flashing on every load.

### The Process stack

[`Process.jsx`](src/components/landing/Process.jsx) is the page's one scene that
is *not* an entrance. Four full-height panels pin to the top of the viewport one
after another, each next panel rising over the one before it while the covered
panel shrinks and dims. It is the only scroll-driven set piece on the page, and
the reason `utils/gsap.js` carries a global config line.

**`pinSpacing: false` is the whole mechanism.** A pin normally adds scroll
distance equal to its duration, which *pushes* the following content down. With
`pinSpacing: false` the spacer still holds the card's own height, so the page
never reflows, but no distance is added — so the next card travels up and
**over** the pinned one. Because nothing adds height, the section is exactly as
tall as its panels end to end, and each panel contributes one panel of scroll.
**The pacing knob is the panel's `min-h` and nothing else.**

| Detail | Why |
| --- | --- |
| The pin is on an inner `<div data-step>`, not the `<li>` | GSAP wraps a pinned element in `<div class="pin-spacer">`. Pinning the `<li>` would put a div between `<ol>` and `<li>` — invalid HTML that costs the list its semantics |
| `endTrigger: next, end: 'top top'` | Bounds each pin to its own neighbour, so no card stays pinned past the card covering it |
| `zIndex: i + 1` on the `<li>`, not the card | A pinned card is `position: fixed`, which would otherwise paint *above* the in-flow card rising to cover it. Positioning the `<li>` makes it a stacking context, so whole cards sort by index — pinned or not |
| `transformOrigin: 'top center'` on the shrink | Holds the receding card's top edge under the incoming one. A centred origin lets it drift downwards, revealing the background behind it |
| `refreshPriority: 1` | Pins move every offset below them, so they must be measured before the triggers `useScrollScenes` creates for the sections underneath |
| `min-h-[72svh]`, content centred | `svh` does not change when a phone's address bar collapses, so a pinned card does not resize mid-scroll. Centring is also what keeps the sticky navbar from covering text — the bar overlays empty padding |
| `ScrollTrigger.config({ ignoreMobileResize: true })` in `utils/gsap.js` | The other half of the same problem: it tells ScrollTrigger to ignore viewport-height-only resizes on mobile, which is its documented remedy |
| The card is `bg-white` — **opaque** | Occlusion *is* the effect. A card can only stack on the one beneath it if it hides it, so opacity here is a functional requirement, not a styling preference. These cards were `bg-white/[0.07] backdrop-blur-sm`; at 7% white with a blur you see straight through to the card underneath, and the section reads as four ghosted panels overlapping rather than as a deck |
| No border, no shadow, no hover state | The panel edge against the gradient is already the highest-contrast edge on the page, so a shadow adds nothing. A pinned panel that brightens under the pointer is pretending to be clickable when it is not |

**The band behind the stack is flat.** The section used to carry a `bg-grid`
overlay and a blurred blob over the gradient. With four full-width panels over
it, the band is mostly a backdrop for the *gaps* between cards, and a busy
backdrop reads as noise through them — so the decoration was deleted and
`bg-brand-gradient` alone is left. That also removes the section's only
`overflow-hidden`, so nothing can clip a pinned card.

> ⚠️ **Never put `transition-all` on a node GSAP transforms.** GSAP writes
> `transform` inline *every frame*, so a CSS transition covering transform puts
> its duration of lag behind each frame — the tween looks like it is dragging
> through treacle. Scene-animated elements carry no transition at all, or a
> colour-only one if they have a hover state that needs it.

**The grid fallback.** `stacked` is `useMediaQuery(MOTION_OK)` — no width query,
because a full-height panel is what a phone is shaped for. Reduced motion gets
the plain `grid gap-6 sm:grid-cols-2 lg:grid-cols-4` layout with connector lines
and `data-reveal` entrances, and no GSAP runs at all. The two modes are
structurally different — grid vs `space-y`, connectors, reveal attributes — which
is why this is a React branch and not a Tailwind class.

### Primitives

- **`Reveal`** ([`Primitives.jsx`](src/components/landing/Primitives.jsx)) —
  markup only. A plain `<div>` carrying `data-reveal`, which `useScrollScenes`
  picks up. Props: `delay`, `y`, `once`, `className`. The default for anything
  entering the viewport.
- **`SplitWords`** ([`Motion.jsx`](src/components/landing/Motion.jsx)) — headings
  reveal word by word out of an overflow mask. `SectionHeading` uses it
  automatically, so most headings get it for free. It renders **static DOM** and
  lets `useScrollScenes` animate it, which is what lets a heading reverse with
  its section. It splits in JSX rather than with GSAP's SplitText, which rewrites
  DOM behind React's back — exactly what breaks under the React Compiler. The
  heading carries an `aria-label` of the whole sentence and the words are
  `aria-hidden`, so a screen reader hears one sentence instead of fragments.
- **`TiltCard`** ([`Motion.jsx`](src/components/landing/Motion.jsx)) — 3D tilt
  toward the pointer, plus a lift, driven by `gsap.quickTo`. Active only under
  `(hover: hover) and (pointer: fine)` and when motion is not reduced, so touch
  devices and reduced-motion visitors get a completely static card. When it is
  disabled it clears its own transform, so a card can never be stranded
  part-tilted if the preference changes mid-hover.
- **`FaqItem`** ([`Faq.jsx`](src/components/landing/Faq.jsx)) — a component
  rather than a block inside the parent's `.map()`, because the height animation
  needs its own ref and hooks cannot be called in a loop. The panel is **always
  mounted** and collapsed by animating `height`, so the transition works both
  ways and a JS failure leaves every answer visible instead of a column of dead
  buttons.

> ⚠️ **`TiltCard` owns the lift.** Do not also put Tailwind's
> `hover:-translate-y-1` on the card inside it — the tilt writes an inline
> `transform`, which silently beats the class, and the lift just stops working.
> This is why the cards in Services, Courses, WhyUs and Pricing carry no
> hover-translate class.

> ⚠️ **A `data-reveal` node owns its own transform too**, for the same reason
> and with the same silent failure. Anything GSAP reveals writes an inline
> `transform`, so a CSS hover-transform on *that same element* stops working.
> Put the hover effect on a child instead. This is why the Process cards lift
> with a border and background change rather than `hover:-translate-y-1`.

### Timing

`200ms` hover/colour · `300ms` transform · `550ms` entrance · `900ms` the hero
gradient wipe. Nothing longer. Stagger siblings by `0.04s`–`0.09s`.

**Still off the table:** parallax, auto-rotating carousels, scroll-jacking. The
pinned Process section is a deliberate set piece, not a pattern to copy — it is
the only place the page takes over scrolling, and it has a full static fallback.

---

## 7. Writing style

Copy is part of the design system.

1. **Lead with the outcome, not the feature.** "Cut your cost per lead", not
   "Advanced targeting module".
2. **Plain words.** "Use", not "utilise". "Help", not "facilitate".
3. **Second person.** "Your brand", "you will". Not "businesses should".
4. **Short sentences.** If it needs a comma splice to survive, split it.
5. **Specific over impressive.** "18-minute average lesson" beats "world-class
   learning experience".
6. **No hype.** No "revolutionary", "game-changing", "unlock your potential".
7. **Sentence case** for headings and buttons. Title Case only for proper nouns.

Working headline formula: **outcome + audience**.
> "Learn the skills that grow your brand — and your business."

---

## 8. Accessibility

Non-negotiable, and cheap if done from the start.

- **Contrast:** body text ≥ 4.5:1, large text ≥ 3:1. `secondary-400` is for
  muted meta text only, never body copy.
- **Focus visible:** never `outline-none` without a replacement ring.
- **Semantics:** one `<h1>` per page; headings in order; `<nav>`, `<main>`,
  `<footer>` landmarks; `aria-label` on icon-only buttons.
- **Motion:** respect `prefers-reduced-motion`.
- **Images:** meaningful `alt`, or `aria-hidden` for decoration. Decorative
  elements in this codebase are marked `aria-hidden="true"`.
- **Keyboard:** everything reachable and operable; the landing page has a
  "Skip to content" link.

---

## 9. Where things live

```
src/
├── data/landingContent.js          ← all landing-page copy and content
├── utils/gsap.js                   ← the ONLY module that imports from 'gsap'
├── hooks/useMediaQuery.js          ← layout-by-media-query (drives Process)
├── hooks/useScrollScenes.js        ← scroll entrances for every section
├── components/landing/
│   ├── Primitives.jsx              ← Reveal, Eyebrow, SectionHeading, SmartLink
│   ├── Motion.jsx                  ← SplitWords (markup), TiltCard (GSAP quickTo)
│   ├── Illustrations.jsx           ← HeroArt, MarketingArt, SocialArt — animated product panels
│   ├── ScrollProgress.jsx          ← top scroll-progress bar
│   ├── Navbar.jsx  Hero.jsx  TrustStrip.jsx
│   ├── Services.jsx                ← the two services, alternating rows
│   ├── Courses.jsx                 ← live catalogue from the API
│   ├── Process.jsx                 ← dark band + the stacking-cards scene
│   ├── WhyUs.jsx                   ← bento grid
│   ├── Pricing.jsx  Faq.jsx  Contact.jsx  FinalCta.jsx  Footer.jsx
├── pages/landing/LandingPage.jsx   ← composes the sections
├── pages/StyleGuidePage.jsx        ← this guide, rendered (/style-guide)
└── components/ui/                  ← shared primitives (Button, Card, …)
```

**Rule:** change copy in `data/landingContent.js`, never inside a component.
Sections are presentational and take their content as data.

### Two ways links are written

Content files mix in-page anchors (`#services`) and app routes (`/register`).
Always render them through `SmartLink` from `Primitives.jsx` — it emits an
`<a>` for hashes and a router `<Link>` for everything else. Do not hand-roll
that branch in a section.

---

## 10. Page structure

The landing page is deliberately ordered and should stay that way:

| # | Section | Job |
| --- | --- | --- |
| 1 | Hero | Who we are, in one line + a CTA to services |
| 2 | TrustStrip | Which industries we work in |
| 3 | Services | The two things we sell |
| 4 | Courses | The academy — **live data from the API** |
| 5 | Process | How an engagement runs (dark band) |
| 6 | WhyUs | Reasons to pick us (bento grid) |
| 7 | Pricing | The two ways to buy |
| 8 | FAQ | Objection handling |
| 9 | Contact | Destination of every "talk to us" CTA |
| 10 | FinalCta + Footer | Last ask and navigation |

Backgrounds alternate white → `secondary-50` → dark so sections separate without
borders. Keep that rhythm when inserting a section.

---

## 11. Content rules

Beyond the writing style in §7, the landing page holds to these:

- **No invented numbers.** No "2,400+ students", no "94% completion", no
  ratings we have not measured. The page currently carries zero statistics on
  purpose — see §12.
- **No fabricated testimonials.** Quotes require a real, named, consenting
  customer.
- **No invented prices.** Courses show real prices from the catalogue; service
  work is quoted after an audit rather than published as a rate card.
- **No fake logos.** The trust strip names *industries*, not client brands we
  have not worked with.
- **Icons, not emoji.** Use `react-icons/hi2`. Emoji render inconsistently
  across platforms and cannot inherit brand colour.

---

## 12. Known gaps & TODO

Flagged honestly rather than hidden.

**Must fix before launch**

- **Contact details are placeholders.** `contact` in `landingContent.js` has
  `hello@tucacademy.com` and `+234 000 000 0000`. Replace with real details —
  every "Get a free audit" CTA on the page routes here.
- **No privacy/terms pages.** The footer's legal links were removed rather than
  left pointing at `#`. Add real pages and restore them.

**Worth doing soon**

- **Add real social proof once you have it.** The page currently has no
  testimonials or statistics at all, which is honest but leaves conversion on
  the table. Even three real client quotes, or your first verified set of
  campaign results, would strengthen the Process band (§10) and the hero.
- **Courses need the API running.** `Courses.jsx` reads `GET /courses` and
  `GET /courses/categories` (both public via `optionalAuth`). With the server
  down it shows the "New courses are being published" placeholder — correct
  behaviour, but the section will look empty until the catalogue is populated.
- **Currency is inconsistent in the app.** The landing page now uses
  `utils/formatters.js → formatPrice` (which returns `$`) so it matches the
  dashboard. If you sell in Naira, change `formatPrice` once — both surfaces
  will follow.
- **Bundle size — re-measure.** Route-level code splitting is now in place
  (§9): every route except the landing page is `React.lazy`, so `recharts` and
  `react-player` no longer download for a marketing visitor. Before the split
  the single chunk was 1,407.07 kB / **397.16 kB gzipped**. Since then GSAP was
  added (~45 kB gzipped) and `framer-motion` was removed entirely (~34 kB
  gzipped, and it was only serving `TiltCard`, the FAQ accordion, the hero chips
  and the progress bar). The two roughly cancel. The illustration SVGs were then
  swapped for DOM panels, which is close to a wash — more markup per panel, but
  no SVG gradients or clip paths. **Run `npm install && npm run build` and put
  the real figure here** — it has not been measured since the change, and this
  line is the only record of it.

**Known limitations**

- **The animation layer has never been build-verified.** GSAP, `useScrollScenes`,
  `TiltCard`, the FAQ rewrite, the progress bar, the Process stack and the
  illustration panels were all written while the toolchain was unusable, so
  `npm run build` and `npm run lint` have not run against them. The
  scroll-entrance system did ship one real bug that only a browser would have
  caught — see the `WeakSet` note in `useScrollScenes.js` — which is the argument
  for scrolling the whole page once before trusting any of it.

- **The Process stack's pacing is unmeasured.** Pin distances and scroll pacing
  cannot be checked by reading code. Watch it on a phone as well as a desktop:
  the panels are `min-h-[72svh]`, so a narrow viewport with a long step body is
  the case most likely to make a pinned panel taller than the screen — and a
  pinned panel taller than the viewport is clipped with no way to scroll to its
  bottom. If that happens, shorten the copy in `process.steps` or lower the
  `min-h`.

- **No dark mode.** The palette is designed light-first; a dark theme needs its
  own token pass.
- **The illustration panels are DOM, not images.** They cannot be cached
  separately or reused outside React, and every colour is a Tailwind class — so
  they only render correctly inside this app's stylesheet. That is the trade for
  artwork that cannot drift off-palette and that animates without a second
  rendering path.

- **The bare panels are one step of contrast from their backgrounds.** With the
  wrapper card, shadow and glow gone, a panel's `bg-secondary-100` field is the
  only thing separating the artwork from the section behind it. On Services
  (`bg-white`) that step is clear. On the Hero it is `bg-brand-soft`, a wash that
  starts at `#f6f4ff` — near enough to `secondary-100` that the panel edge there
  is the weakest edge on the page, and the live-status card overlapping the
  corner is white *on* that wash. Both were chosen deliberately (a box was the
  thing being removed) but neither has been looked at. If the Hero panel reads
  as floating rather than as a surface, give `HeroArt` a `bg-white` field of its
  own rather than putting the box back.
