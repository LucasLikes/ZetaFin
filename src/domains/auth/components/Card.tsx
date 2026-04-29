interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div
      className={`
        bg-dark-800/50 backdrop-blur-md
        border border-dark-700/50
        rounded-2xl p-8
        shadow-xl shadow-dark-950/50
        ${className}
      `}
    >
      {children}
    </div>
  )
}
