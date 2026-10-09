import { HiEnvelope, HiPhone, HiMapPin, HiOutlineClock } from 'react-icons/hi2';
import { Reveal, Eyebrow } from './Primitives';
import { SplitWords } from './Motion';
import { contact } from '../../data/landingContent';

/**
 * Contact block — the destination for every "talk to us" CTA on the page.
 *
 * NOTE: the address and number below are placeholders in
 * `data/landingContent.js`. Replace them with real details before launch.
 */
const Contact = () => (
  <section id="contact" className="scroll-mt-20 bg-white py-16 sm:py-20">
    <div className="container-page">
      <div className="overflow-hidden rounded-3xl border border-secondary-200 bg-secondary-50">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <Reveal>
              <Eyebrow>Get in touch</Eyebrow>
            </Reveal>
            <SplitWords
              as="h2"
              text="Tell us about your brand"
              delay={0.06}
              className="mt-4 block text-3xl font-extrabold tracking-tight text-secondary-900 sm:text-4xl"
            />
            <Reveal delay={0.12} once>
              <p className="mt-5 text-lg leading-relaxed text-secondary-600">
                Send us a short note about where your brand is and what you are trying to grow. We
                will reply with an honest read on whether we can help — and what we would do first.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <a
                href={`mailto:${contact.email}?subject=Brand%20audit%20enquiry`}
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-7 py-3.5 text-lg font-semibold text-white shadow-brand transition-all hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-brand-lg"
              >
                <HiEnvelope className="h-5 w-5" />
                Email us
              </a>
            </Reveal>
          </div>

          {/* Details — `once`, so the contact details cannot disappear while
              someone is reading them off the screen. */}
          <Reveal delay={0.14} once>
            <dl className="space-y-5 lg:pt-2">
              {[
                { icon: HiEnvelope, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
                { icon: HiPhone, label: 'Phone', value: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
                { icon: HiMapPin, label: 'Based in', value: contact.location },
                { icon: HiOutlineClock, label: 'Office hours', value: contact.hours },
              ].map((row) => {
                const Icon = row.icon;
                const content = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <dt className="text-sm font-semibold uppercase tracking-wide text-secondary-500">
                        {row.label}
                      </dt>
                      <dd className="text-base font-semibold text-secondary-900">{row.value}</dd>
                    </span>
                  </>
                );

                return row.href ? (
                  <a
                    key={row.label}
                    href={row.href}
                    className="flex items-center gap-4 rounded-2xl transition-colors hover:bg-white/70"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={row.label} className="flex items-center gap-4">
                    {content}
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;
