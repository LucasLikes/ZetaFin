interface AlertProps {
  message: string
  type?: 'error' | 'success' | 'warning'
}

export const Alert = ({ message, type = 'error' }: AlertProps) => {
  const typeStyles = {
    error: 'bg-red-500/10 border border-red-500/30 text-red-400',
    success: 'bg-green-500/10 border border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400',
  }

  return (
    <div className={`p-4 rounded-lg text-sm ${typeStyles[type]} animate-fade-in`}>
      {message}
    </div>
  )
}
