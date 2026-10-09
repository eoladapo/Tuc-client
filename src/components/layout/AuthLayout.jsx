import { Link } from 'react-router-dom';
import { HiAcademicCap } from 'react-icons/hi2';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-primary-50 flex flex-col">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-800 transition-colors">
            <HiAcademicCap className="w-8 h-8" />
            <span className="text-xl font-bold">TUC LMS</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-white to-gray-50">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>

            {/* Body */}
            <div className="px-8 py-6">
              {children}
            </div>
          </div>

          {/* Footer Text */}
          <p className="mt-8 text-center text-sm text-gray-600">
            &copy; 2024 TUC Learning Management System. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
