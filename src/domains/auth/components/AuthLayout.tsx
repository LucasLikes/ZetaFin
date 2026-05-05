import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  showBrandingArea?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  showBrandingArea = true,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center lg:items-stretch lg:justify-stretch bg-gradient-to-br from-gray-50 via-gray-50 to-green-50">
      {/* Branding Area - Hidden on mobile */}
      {showBrandingArea && (
        <div
          className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #7FE5A8 0%, #6DD99A 50%, #52C48B 100%)',
          }}
        >
          {/* Decorative blur elements - Enhanced */}
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full opacity-15 blur-3xl bg-white"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full opacity-12 blur-3xl bg-white"></div>
          <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full opacity-10 blur-3xl bg-green-900 transform -translate-x-1/2 -translate-y-1/2"></div>

          {/* Branding Content */}
          <div className="relative z-10 text-center">
            {/* Logo Area */}
            <div className="mb-8 flex justify-center">
              <div
                className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center border border-white/40"
                aria-hidden="true"
              >
                <span className="text-5xl font-bold text-white" style={{ letterSpacing: '-2px' }}>Ζ</span>
              </div>
            </div>

            {/* Brand Text */}
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              ZetaFin
            </h1>
            <p className="text-lg text-white/95 max-w-sm leading-relaxed font-medium">
              Inteligência financeira na palma da sua mão
            </p>

            {/* Benefits */}
            <div className="mt-12 space-y-4 pt-8 border-t border-white/30">
              {[
                'Visualize seus gastos em tempo real',
                'Planeje seu orçamento com facilidade',
                'Organize suas metas financeiras',
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-3 text-white/95"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};
