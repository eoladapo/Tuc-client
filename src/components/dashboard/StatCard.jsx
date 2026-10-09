import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendDirection = 'up',
  subtitle,
  color = 'primary' 
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trendDirection === 'up' ? (
                <HiTrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <HiTrendingDown className="w-4 h-4 text-red-600" />
              )}
              <p className={`text-sm font-medium ${
                trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend}
              </p>
            </div>
          )}
          
          {subtitle && !trend && (
            <p className="text-sm text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>
        
        {Icon && (
          <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
