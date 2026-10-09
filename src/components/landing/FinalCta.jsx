import { HiArrowRight } from 'react-icons/hi2';
import { Reveal, SmartLink } from './Primitives';
import { SplitWords } from './Motion';
import { finalCta } from '../../data/landingContent';

const FinalCta = () => (
  <section className="bg-white pb-20 pt-4 sm:pb-24">
    <div className="container-page">
      <Reveal>
        <div className="relative overflow-hidden rounded-4xl bg-brand-gradient px-6 py-16 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="absolute inset-0 bg-grid opacity-30" />
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary-400/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-primary-300/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <SplitWords
              as="h2"
              text={finalCta.heading}
              className="block text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
            />
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-primary-100">
              {finalCta.subheading}
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3.5 sm:flex-row">
              <SmartLink
                href={finalCta.primaryCta.href}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-lg font-bold text-primary-700 shadow-lift transition-all hover:-translate-y-0.5"
              >
                {finalCta.primaryCta.label}
                <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </SmartLink>
              <SmartLink
                href={finalCta.secondaryCta.href}
                className="inline-flex items-center justify-center rounded-xl border-2 border-white/30 px-7 py-3.5 text-lg font-semibold text-white transition-all hover:border-white/60 hover:bg-white/10"
              >
                {finalCta.secondaryCta.label}
              </SmartLink>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default FinalCta;
