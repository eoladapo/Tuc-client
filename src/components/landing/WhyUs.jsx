import { SectionHeading, Reveal } from './Primitives';
import { TiltCard } from './Motion';
import { whyUs } from '../../data/landingContent';

/**
 * Bento layout: the first claim is the headline tile (wide, brand-filled),
 * the rest are quiet white cards. Breaks the "six identical boxes" rhythm
 * while keeping one heading block above it.
 */
const WhyUs = () => {
  const [lead, ...rest] = whyUs.items;
  const LeadIcon = lead.icon;

  return (
    <section id="why-us" className="section-y scroll-mt-20 bg-white">
      <div className="container-page">
        <SectionHeading
          eyebrow={whyUs.eyebrow}
          heading={whyUs.heading}
          subheading={whyUs.subheading}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {/* Lead tile */}
          <Reveal className="lg:col-span-2">
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-brand-gradient p-8 sm:p-10">
              <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-30" />
              <div
                aria-hidden="true"
                className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary-400/25 blur-3xl"
              />

              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:-translate-y-1">
                  <LeadIcon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-2xl font-extrabold tracking-tight text-white">
                  {lead.title}
                </h3>
                <p className="mt-3 max-w-lg text-lg leading-relaxed text-primary-100">
                  {lead.body}
                </p>
              </div>

              {/* Decorative arc */}
              <svg
                aria-hidden="true"
                viewBox="0 0 200 60"
                className="relative mt-8 h-14 w-full max-w-xs text-white/25"
              >
                <path
                  d="M2 56 C 40 56, 60 12, 100 12 C 140 12, 160 40, 198 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="12" r="5" fill="currentColor" />
              </svg>
            </div>
          </Reveal>

          {/* Remaining tiles */}
          {rest.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.06 * (i + 1)}>
                <TiltCard>
                  <div className="group flex h-full gap-4 rounded-3xl border border-secondary-200 bg-white p-7 transition-all duration-300 hover:border-primary-200 hover:shadow-brand">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary-100 bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-secondary-900">{item.title}</h3>
                      <p className="mt-2 text-base leading-relaxed text-secondary-600">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
