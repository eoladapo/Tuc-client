import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiBars3, HiXMark, HiArrowRight } from 'react-icons/hi2';
import Logo from '../ui/Logo';
import { nav } from '../../data/landingContent';
import { ScrollTrigger, useGSAP } from '../../utils/gsap';
import { cn } from '../../utils/cn';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);

  // Solidify the bar once the user leaves the hero, so links stay legible over
  // scrolling content.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-spy: highlight whichever section owns the middle of the viewport.
  // Reuses ScrollTrigger rather than a second scroll listener, and picks up the
  // Process section's pin correctly because ScrollTrigger measures the spacer.
  useGSAP(() => {
    const links = nav.links
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);

    links.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setActive(`#${section.id}`);
        },
      });
    });

    // Clear the highlight while the hero is on screen, so scrolling back to the
    // top does not leave the last-visited section looking current.
    const hero = document.querySelector('main > section');
    if (hero) {
      ScrollTrigger.create({
        trigger: hero,
        start: 'top top',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setActive(null);
        },
      });
    }
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-secondary-200/70 bg-white/85 backdrop-blur-lg'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav
        className="container-page flex h-16 items-center justify-between gap-6 lg:h-20"
        aria-label="Main"
      >
        <Logo size="small" />

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {nav.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? 'true' : undefined}
                className={cn(
                  'rounded-lg px-3.5 py-2 text-base font-medium transition-colors',
                  active === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-secondary-600 hover:bg-primary-50 hover:text-primary-700'
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-base font-semibold text-secondary-700 transition-colors hover:text-primary-700"
          >
            Sign in
          </Link>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 text-base font-semibold text-white shadow-brand transition-all hover:bg-primary-700 hover:shadow-brand-lg"
          >
            Get a free audit
            <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-secondary-200 bg-white/70 text-secondary-800 transition-colors hover:bg-white lg:hidden"
        >
          {open ? <HiXMark className="h-6 w-6" /> : <HiBars3 className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-secondary-200 bg-white lg:hidden">
          <ul className="container-page flex flex-col py-4">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={close}
                  className="block rounded-lg px-3 py-3 text-lg font-medium text-secondary-700 transition-colors hover:bg-primary-50 hover:text-primary-700"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="container-page flex flex-col gap-3 pb-8">
            <Link
              to="/login"
              onClick={close}
              className="rounded-xl border-2 border-secondary-200 px-5 py-3 text-center text-lg font-semibold text-secondary-800 transition-colors hover:border-primary-300 hover:text-primary-700"
            >
              Sign in
            </Link>
            <a
              href="#contact"
              onClick={close}
              className="rounded-xl bg-primary-600 px-5 py-3 text-center text-lg font-semibold text-white shadow-brand transition-colors hover:bg-primary-700"
            >
              Get a free audit
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
