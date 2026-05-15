import React from 'react'

interface RevealDivProps {
  children: React.ReactNode
  className?: string
}

export default function RevealDiv({ children, className = '' }: RevealDivProps) {
  return <div className={`rv${className ? ' ' + className : ''}`}>{children}</div>
}
