import { HiCheck, HiArrowRight, HiOutlineArrowTrendingUp } from 'react-icons/hi2';
import { SectionHeading, Reveal } from './Primitives';
import { TiltCard, SplitWords } from './Motion';
import { MarketingArt, SocialArt } from './Illustrations';
import { services } from '../../data/landingContent';
import { cn } from '../../utils/cn';

const art = {
  marketing: MarketingArt,
  social: SocialArt,
};

const ServiceRow = ({ service, index }) => {
  const Art = art[service.art];
  const Icon = service.icon;
  const flipped = index % 2 === 1;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Illustration.
          No wrapper card, no drop shadow, no blurred glow behind it, and no
          hover scale. All three were doing the same bad thing: putting a soft
          white box with a purple halo around a flat UI panel, so the box was the
          most prominent object on the row and the panel — the thing worth
          looking at — was the quietest. The panel supplies its own surface
          (see `Illustrations.jsx`) and the copy column is the only other
          object, which is the whole layout. */}
      <Reveal y={28} className={cn(flipped && 'lg:order-2')}>
        <TiltCard max={6}>
          <Art className="h-auto w-full" />
        </TiltCard>
      </Reveal>

      {/* Copy */}
      <div className={cn(flipped && 'lg:order-1')}>
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-brand">
              <Icon className="h-6 w-6" />
            </span>
            <span className="eyebrow">{service.tag}</span>
          </div>
        </Reveal>

        <SplitWords
          as="h3"
          text={service.title}
          delay={0.06}
          className="mt-5 block text-3xl font-extrabold tracking-tight text-secondary-900 sm:text-4xl"
        />

        {/* Reading copy — plays once and stays. Reversing it would make the
            body text vanish while someone is part-way through reading it. */}
        <Reveal delay={0.12} once>
          <p className="mt-5 text-lg leading-relaxed text-secondary-600">{service.body}</p>
        </Reveal>

        <Reveal delay={0.18}>
          <ul className="mt-7 grid gap-3.5 sm:grid-cols-2">
            {service.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-primary-100 hover:bg-primary-50/60"
              >
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100">
                  <HiCheck className="h-3.5 w-3.5 text-primary-700" />
                </span>
                <span className="text-base leading-snug text-secondary-700">{bullet}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.24} once>
          <p className="mt-7 flex items-start gap-3 rounded-2xl border border-primary-100 bg-primary-50/70 px-5 py-4 text-base font-semibold text-primary-900">
            <HiOutlineArrowTrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
            {service.outcome}
          </p>
        </Reveal>
      </div>
    </div>
  );
};

const Services = () => (
  <section id="services" className="section-y scroll-mt-20 bg-white">
    <div className="container-page">
      <SectionHeading
        eyebrow={services.eyebrow}
        heading={services.heading}
        subheading={services.subheading}
      />

      <div className="mt-16 space-y-20 lg:space-y-28">
        {services.items.map((service, i) => (
          <ServiceRow key={service.id} service={service} index={i} />
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-20 text-center">
          <a
            href={services.cta.href}
            className="group inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-lg font-semibold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-brand-lg"
          >
            {services.cta.label}
            <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Services;
