import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const LoadingSpinner = () => (
  <svg
    className="w-5 h-5 animate-spin"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  disabled,
  className,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center gap-2.5 font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-green-500 text-gray-900 hover:bg-green-600 active:scale-95 focus:ring-green-500 focus:ring-offset-2',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95 focus:ring-green-500 focus:ring-offset-2',
    outline:
      'border border-gray-300 text-gray-900 hover:bg-gray-50 active:scale-95 focus:ring-green-500 focus:ring-offset-2',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className || ''}
      `}
      style={{
        backgroundColor:
          variant === 'primary' ? '#7FE5A8' : undefined,
        color: variant === 'primary' ? '#1A1A1A' : undefined,
      }}
      {...props}
    >
      {isLoading ? <LoadingSpinner /> : icon}
      {children}
    </button>
  );
};
