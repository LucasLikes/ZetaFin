interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-200 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 rounded-lg
          bg-dark-800 border border-dark-700
          text-white placeholder-dark-500
          focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
          transition-all duration-300
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  )
}
