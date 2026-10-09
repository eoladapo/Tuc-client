import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { SplitWords } from './Motion';

/**
 * Renders an in-page anchor for `#hash` targets and a router <Link> for
 * everything else — so content files can mix `#services` and `/register`
 * freely without every section re-implementing the branch.
 */
export const SmartLink = ({ href, children, className = '', ...rest }) =>
  href.startsWith('#') ? (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  ) : (
    <Link to={href} className={className} {...rest}>
      {children}
    </Link>
  );

/**
 * Marks a block for the scroll-entrance system in `hooks/useScrollScenes`.
 *
 * Deliberately a plain `<div>` that renders its content *visible* and merely
 * describes the animation in data attributes — the hook is what hides and
 * reveals it, at runtime. That ordering is the safety property: if GSAP never
 * loads, this is an ordinary visible block rather than a permanently blank one.
 *
 * @param {number} [delay=0] - seconds to hold after the trigger fires
 * @param {number} [y=24] - px to rise from
 * @param {boolean} [once=false] - play and stay put, instead of reversing when
 *   the visitor scrolls back above it. Use for reading copy, where vanishing
 *   mid-sentence is worse than a missing flourish.
 */
export const Reveal = ({ children, delay = 0, y = 24, once = false, className = '' }) => (
  <div
    className={className}
    data-reveal={once ? 'once' : 'rise'}
    style={{ '--reveal-delay': `${delay}s`, '--reveal-y': `${y}px` }}
  >
    {children}
  </div>
);

export const Eyebrow = ({ children, className = '' }) => (
  <span className={cn('eyebrow', className)}>
    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-500" />
    {children}
  </span>
);

/**
 * The one heading block every section uses. Keeps eyebrow → heading →
 * subheading spacing identical across the page.
 */
export const SectionHeading = ({
  eyebrow,
  heading,
  subheading,
  align = 'center',
  className = '',
}) => {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'max-w-3xl',
        centered && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow className={centered ? 'justify-center' : ''}>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      {/* Plain strings get the word-by-word reveal; anything else (JSX) falls
          back to the block reveal, which SplitWords cannot split. */}
      {typeof heading === 'string' ? (
        <SplitWords
          as="h2"
          text={heading}
          delay={0.06}
          className="mt-4 block text-3xl font-extrabold tracking-tight text-secondary-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
        />
      ) : (
        <Reveal delay={0.06}>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-secondary-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            {heading}
          </h2>
        </Reveal>
      )}
      {subheading && (
        <Reveal delay={0.12}>
          <p className={cn('mt-5 text-lg leading-relaxed text-secondary-600', centered && 'mx-auto')}>
            {subheading}
          </p>
        </Reveal>
      )}
    </div>
  );
};

export default SectionHeading;
