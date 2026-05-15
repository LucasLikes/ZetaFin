import React from 'react'

interface SectionTagProps {
  children: React.ReactNode
}

export default function SectionTag({ children }: SectionTagProps) {
  return (
    <div className="sec-tag">
      {children}
    </div>
  )
}
