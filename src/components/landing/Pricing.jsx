import { HiCheck, HiArrowRight } from 'react-icons/hi2';
import { SectionHeading, Reveal, SmartLink } from './Primitives';
import { TiltCard } from './Motion';
import { pricing } from '../../data/landingContent';
import { cn } from '../../utils/cn';

/**
 * Two models, no invented numbers: courses are priced individually in the
 * catalogue, service engagements are quoted after an audit.
 */
const Pricing = () => (
  <section id="pricing" className="section-y scroll-mt-20 bg-secondary-50">
    <div className="container-page">
      <SectionHeading
        eyebrow={pricing.eyebrow}
        heading={pricing.heading}
        subheading={pricing.subheading}
      />

      <div className="mx-auto mt-14 grid max-w-4xl gap-7 lg:grid-cols-2">
        {pricing.options.map((option, i) => {
          const Icon = option.icon;
          return (
            <Reveal key={option.id} delay={i * 0.08}>
              <TiltCard max={5}>
                <div
                  className={cn(
                    'group relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300',
                    option.featured
                      ? 'border-primary-300 bg-white shadow-brand-lg'
                      : 'border-secondary-200 bg-white shadow-soft hover:border-primary-200'
                  )}
                >
                  {/* No accent bar on the featured card. It was an
                      absolutely-positioned gradient strip at `-top-px`, which
                      sat a pixel proud of the card — and because `TiltCard`
                      rotates the card in 3D, that overhang read as a loose line
                      floating above the corner rather than as part of the card.
                      The featured option is already carried by its border,
                      shadow, solid icon chip and filled button. */}
                  <span
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105',
                      option.featured
                        ? 'bg-primary-600 text-white shadow-brand'
                        : 'border border-primary-100 bg-primary-50 text-primary-600'
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </span>

                  <span className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
                    {option.tag}
                  </span>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-secondary-900">
                    {option.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-secondary-600">{option.lede}</p>

                  <ul className="mt-7 flex-1 space-y-3.5 border-t border-secondary-100 pt-7">
                    {option.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span
                          className={cn(
                            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                            option.featured ? 'bg-primary-100' : 'bg-secondary-100'
                          )}
                        >
                          <HiCheck
                            className={cn(
                              'h-3.5 w-3.5',
                              option.featured ? 'text-primary-700' : 'text-secondary-600'
                            )}
                          />
                        </span>
                        <span className="text-base leading-snug text-secondary-700">{point}</span>
                      </li>
                    ))}
                  </ul>

                  <SmartLink
                    href={option.cta.href}
                    className={cn(
                      'group/btn mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-base font-bold transition-all',
                      option.featured
                        ? 'bg-primary-600 text-white shadow-brand hover:bg-primary-700 hover:shadow-brand-lg'
                        : 'border-2 border-secondary-200 text-secondary-800 hover:border-primary-400 hover:text-primary-700'
                    )}
                  >
                    {option.cta.label}
                    <HiArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </SmartLink>
                </div>
              </TiltCard>
            </Reveal>
          );
        })}
      </div>

      {/* Honest note about why there is no rate card */}
      <Reveal delay={0.16}>
        <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-secondary-500">
          {pricing.note}
        </p>
      </Reveal>
    </div>
  </section>
);

export default Pricing;
