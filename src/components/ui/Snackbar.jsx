import { useEffect, useState } from 'react';
import { HiXMark, HiCheckCircle, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi2';

const Snackbar = ({
  message,
  type = 'info',
  duration = 6000,
  isOpen,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger entry animation
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);

      // Auto close after duration
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, duration]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const variants = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: HiCheckCircle,
      iconColor: 'text-green-500'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: HiExclamationCircle,
      iconColor: 'text-red-500'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: HiExclamationCircle,
      iconColor: 'text-yellow-500'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: HiInformationCircle,
      iconColor: 'text-blue-500'
    }
  };

  const variant = variants[type] || variants.info;
  const Icon = variant.icon;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-300 ease-out ${isAnimating
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 -translate-y-4'
        }`}
    >
      <div
        className={`
          ${variant.bg} ${variant.text}
          border rounded-xl shadow-lg
          px-5 py-3.5 pr-12
          flex items-center gap-3
          min-w-[320px] max-w-md
          backdrop-blur-sm
        `}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${variant.iconColor}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={handleClose}
          className={`
            absolute right-3 top-1/2 -translate-y-1/2
            ${variant.text} hover:opacity-70
            transition-opacity p-1
          `}
        >
          <HiXMark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;
