import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const sizes = {
  tiny: {
    container: 'gap-0',
    tuc: 'text-base',
    academy: 'text-[8px]',
    badge: 'w-1 h-1',
  },
  small: {
    container: 'gap-0',
    tuc: 'text-xl',
    academy: 'text-[10px]',
    badge: 'w-1 h-1',
  },
  default: {
    container: 'gap-0',
    tuc: 'text-2xl',
    academy: 'text-xs',
    badge: 'w-1.5 h-1.5',
  },
  large: {
    container: 'gap-0',
    tuc: 'text-3xl',
    academy: 'text-sm',
    badge: 'w-2 h-2',
  },
};

/**
 * TUC Academy wordmark.
 *
 * @param {'default'|'inverse'} variant - `inverse` is for dark surfaces
 *   (e.g. the footer), where the default slate subtitle would disappear.
 */
const Logo = ({ size = 'default', variant = 'default', className = '' }) => {
  const config = sizes[size];
  const inverse = variant === 'inverse';

  return (
    <Link
      to="/"
      aria-label="TUC Academy — home"
      className={cn(
        'group inline-flex flex-col transition-all',
        config.container,
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* TUC Text with gradient */}
        <span
          className={cn(
            config.tuc,
            'font-black tracking-tighter bg-clip-text text-transparent',
            inverse
              ? 'bg-gradient-to-r from-white via-primary-100 to-white'
              : 'bg-gradient-to-r from-primary-700 via-primary-600 to-accent-500'
          )}
        >
          TUC
        </span>

        {/* Decorative Badge */}
        <div
          className={cn(
            config.badge,
            'rounded-full animate-pulse',
            inverse ? 'bg-primary-300' : 'bg-accent-500'
          )}
        />
      </div>

      {/* Academy Subtitle */}
      <span
        className={cn(
          config.academy,
          'font-semibold tracking-widest uppercase -mt-1 ml-0.5',
          inverse ? 'text-secondary-400' : 'text-secondary-600'
        )}
      >
        Academy
      </span>
    </Link>
  );
};

export default Logo;
