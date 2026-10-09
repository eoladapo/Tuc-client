import { useEffect } from 'react';
import { useScrollScenes } from '../../hooks/useScrollScenes';

import Navbar from '../../components/landing/Navbar';
import ScrollProgress from '../../components/landing/ScrollProgress';
import Hero from '../../components/landing/Hero';
import TrustStrip from '../../components/landing/TrustStrip';
import Services from '../../components/landing/Services';
import Courses from '../../components/landing/Courses';
import Process from '../../components/landing/Process';
import WhyUs from '../../components/landing/WhyUs';
import Pricing from '../../components/landing/Pricing';
import Faq from '../../components/landing/Faq';
import Contact from '../../components/landing/Contact';
import FinalCta from '../../components/landing/FinalCta';
import Footer from '../../components/landing/Footer';

/**
 * Narrative order:
 *   who we are → proof of category → what we sell → what we teach →
 *   how we work → why us → what it costs → objections → contact → close.
 */
const LandingPage = () => {
  // Gives every `data-reveal` / `data-words` element on the page its own
  // ScrollTrigger. Mounted here, once, rather than inside each section — the
  // sections only describe *what* animates, through markup.
  useScrollScenes();

  // Smooth anchor scrolling, scoped to the marketing page so the dashboard
  // keeps its default behavior. The global reduced-motion rule still wins.
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'smooth';
    return () => {
      root.style.scrollBehavior = previous;
    };
  }, []);

  return (
    // The page runs a single animation library. Every scene here is GSAP, and
    // each one gates itself on `prefers-reduced-motion` — the scroll scenes
    // inside useScrollScenes, the hero chips and tilt cards through
    // `gsap.matchMedia`, the FAQ through a zero duration. There is no global
    // motion switch, because GSAP writes inline transforms rather than running
    // CSS animations, so the `prefers-reduced-motion` block in index.css does
    // not reach any of it.
    <div className="min-h-screen bg-white">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <ScrollProgress />
      <Navbar />

      <main id="main">
        <Hero />
        <TrustStrip />
        <Services />
        <Courses />
        <Process />
        <WhyUs />
        <Pricing />
        <Faq />
        <Contact />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
