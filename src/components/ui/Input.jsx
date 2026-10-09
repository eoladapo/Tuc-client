import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  variant = 'default', // 'default' or 'minimal'
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const isMinimal = variant === 'minimal';

  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className={cn(
          'block font-medium mb-2',
          isMinimal ? 'text-sm text-gray-600' : 'text-sm text-gray-700'
        )}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'w-full transition-all duration-200',
            'focus:outline-none',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            isMinimal ? [
              'border-0 border-b-2 bg-transparent py-3',
              'border-gray-300 focus:border-primary-600',
              leftIcon ? 'pl-0' : 'pl-0',
              error && 'border-red-500 focus:border-red-500',
            ] : [
              'px-4 py-2.5 rounded-lg border',
              'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              leftIcon ? 'pl-11' : 'pl-4',
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
            ],
            className
          )}
          {...props}
        />

        {leftIcon && isMinimal && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {leftIcon && !isMinimal && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {leftIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="mt-1.5 text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
