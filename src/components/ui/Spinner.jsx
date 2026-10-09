import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { cn } from '../../utils/cn';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <AiOutlineLoading3Quarters
      className={cn(
        'animate-spin text-primary-600',
        sizes[size],
        className
      )}
    />
  );
};

export const PageSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default Spinner;
