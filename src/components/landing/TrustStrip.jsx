import { Reveal } from './Primitives';
import { industries } from '../../data/landingContent';

/**
 * Industry strip, not a logo wall — we are not claiming endorsements we do not
 * have. Duplicated once so the marquee loops seamlessly.
 */
const TrustStrip = () => (
  <section className="border-y border-secondary-200 bg-white py-10">
    <div className="container-page">
      <Reveal>
        <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-secondary-400">
          {industries.label}
        </p>
      </Reveal>
    </div>

    <div className="mask-fade-x relative mt-7 overflow-hidden">
      <div className="flex w-max animate-marquee items-center gap-4 hover:[animation-play-state:paused]">
        {[...industries.items, ...industries.items].map((industry, i) => (
          <span
            key={`${industry}-${i}`}
            aria-hidden={i >= industries.items.length}
            className="whitespace-nowrap rounded-full border border-secondary-200 bg-secondary-50 px-5 py-2.5 text-base font-semibold text-secondary-600"
          >
            {industry}
          </span>
        ))}
      </div>
    </div>
  </section>
);

export default TrustStrip;
