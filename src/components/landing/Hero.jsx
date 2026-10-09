import { useEffect, useRef } from 'react';
import {
  HiArrowRight,
  HiOutlineMegaphone,
  HiOutlineDevicePhoneMobile,
  HiOutlineArrowTrendingUp,
} from 'react-icons/hi2';
import { gsap, MOTION_OK } from '../../utils/gsap';
import { Reveal } from './Primitives';
import { SplitWords } from './Motion';
import { HeroArt } from './Illustrations';
import { hero } from '../../data/landingContent';

/**
 * Gently bobbing icon chip that floats over the hero illustration.
 *
 * The chip sits *inside* a `Reveal`, so the wrapper is already animating `y`
 * for the entrance while the chip animates its own `y` for the bob. That is
 * safe because they are two different elements — the rule this page keeps
 * hitting is one animation system per node, not one motion per subtree.
 *
 * `delay` is what keeps the three chips from bobbing in lockstep.
 */
const FloatingChip = ({ icon: Icon, className = '', delay = 0, duration = 5 }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    // Gated, like every other scene on the page: a perpetual background motion
    // is exactly what `prefers-reduced-motion` exists to stop. When the query
    // does not match, no tween is ever created and the chip simply sits still.
    mm.add(MOTION_OK, () => {
      const tween = gsap.to(el, {
        y: -14,
        duration: duration / 2, // peak-to-peak; yoyo covers the return leg
        delay,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      return () => tween.kill();
    });

    return () => mm.revert();
  }, [delay, duration]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute hidden h-14 w-14 items-center justify-center rounded-2xl border border-secondary-100 bg-white text-primary-600 shadow-lift sm:flex ${className}`}
    >
      <Icon className="h-6 w-6" />
    </span>
  );
};

const Hero = () => (
  <section className="relative overflow-hidden bg-brand-soft pt-10 lg:pt-16">
    {/* Decorative background */}
    <div aria-hidden="true" className="absolute inset-0 bg-grid mask-fade-b opacity-70" />
    <div
      aria-hidden="true"
      className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary-200/40 blur-3xl"
    />
    <div
      aria-hidden="true"
      className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl"
    />

    <div className="container-page relative">
      <div className="grid items-center gap-14 pb-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-24">
        {/* Copy column */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-1.5 text-sm font-semibold text-primary-700 shadow-sm backdrop-blur-sm">
              <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-500" />
              {hero.badge}
            </span>
          </Reveal>

          <h1
            aria-label={`${hero.headline} ${hero.headlineHighlight}`}
            className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-secondary-900 sm:text-5xl lg:text-[3.5rem]"
          >
            <SplitWords as="span" text={hero.headline} stagger={0.075} delay={0.08} />{' '}
            {/* The gradient phrase wipes in as one piece rather than splitting
                per word: each word would then carry its own full gradient ramp
                instead of one ramp running across the phrase. Driven by
                `useScrollScenes`, which reads data-reveal="wipe". */}
            <span
              aria-hidden="true"
              data-reveal="wipe"
              style={{ '--reveal-delay': '0.5s' }}
              className="text-gradient-brand inline-block"
            >
              {hero.headlineHighlight}
            </span>
          </h1>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-secondary-600 lg:text-xl">
              {hero.subheadline}
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center">
              <a
                href={hero.primaryCta.href}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-lg font-semibold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-brand-lg"
              >
                {hero.primaryCta.label}
                <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href={hero.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary-200 bg-white px-7 py-3.5 text-lg font-semibold text-secondary-800 transition-all hover:border-primary-300 hover:text-primary-700"
              >
                {hero.secondaryCta.label}
              </a>
            </div>
          </Reveal>

          {/* Qualitative promises — no invented statistics */}
          <Reveal delay={0.32}>
            <ul className="mt-10 flex flex-wrap gap-3">
              {hero.highlights.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2.5 rounded-full border border-secondary-200 bg-white/80 px-4 py-2.5 text-base font-medium text-secondary-700 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700"
                >
                  <Icon className="h-5 w-5 shrink-0 text-primary-600" />
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Illustration column */}
        <Reveal delay={0.2} y={32}>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <HeroArt className="h-auto w-full" />

            {/* Floating service chips */}
            <FloatingChip icon={HiOutlineMegaphone} className="-left-2 top-8" delay={0} />
            <FloatingChip
              icon={HiOutlineDevicePhoneMobile}
              className="-right-1 top-1/3"
              delay={0.8}
              duration={5.6}
            />
            <FloatingChip
              icon={HiOutlineArrowTrendingUp}
              className="bottom-10 left-6"
              delay={1.6}
              duration={6.2}
            />
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default Hero;
