const ProgressBar = ({ 
  progress, 
  showLabel = true, 
  size = 'md',
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'from-primary-500 to-primary-600',
    accent: 'from-accent-500 to-accent-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-600">Progress</span>
          <span className="font-semibold text-slate-900">{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div 
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
