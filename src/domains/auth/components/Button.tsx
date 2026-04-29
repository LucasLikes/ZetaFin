interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'google'
  fullWidth?: boolean
  isLoading?: boolean
}

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2'
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary-500 to-secondary-600 text-white hover:shadow-lg hover:shadow-primary-500/50 active:scale-95 disabled:opacity-50',
    secondary: 'bg-dark-700 text-white hover:bg-dark-600 border border-dark-600 active:scale-95 disabled:opacity-50',
    google: 'bg-white text-dark-900 border border-dark-200 hover:bg-dark-50 active:scale-95 disabled:opacity-50',
  }

  const widthStyle = fullWidth ? 'w-full' : ''
  const loadingStyle = isLoading ? 'opacity-70' : ''

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${loadingStyle} ${className}`}
      {...props}
    >
      {isLoading && (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
