import { HiUser } from 'react-icons/hi2';
import { cn } from '../../utils/cn';
import { getInitials } from '../../utils/formatters';

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export const Avatar = ({
  src,
  alt = '',
  name = '',
  size = 'md',
  className = ''
}) => {
  const initials = getInitials(name || alt);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full',
        'bg-gradient-to-br from-primary-500 to-primary-800',
        'text-white font-medium',
        avatarSizes[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full rounded-full object-cover"
        />
      ) : name ? (
        <span>{initials}</span>
      ) : (
        <HiUser className="w-1/2 h-1/2" />
      )}
    </div>
  );
};

export default Avatar;
