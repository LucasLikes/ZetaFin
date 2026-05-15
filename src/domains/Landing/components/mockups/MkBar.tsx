import React from 'react'

interface MkBarProps {
  page: string
  pill?: string
  pillVal?: string
  bell?: string
}

export default function MkBar({ page, pill, pillVal, bell }: MkBarProps) {
  return (
    <div className="mk-bar">
      <div className="mk-bar-l">
        <div className="mk-logo">Z</div>
        <span className="mk-brand">ZetaFin</span>
        <div className="mk-divider" />
        <span className="mk-page">{page}</span>
      </div>
      <div className="mk-bar-r">
        {pill && (
          <div className="mk-pill">
            <span className="mk-dot" />
            {pill}
            {pillVal && <strong style={{ color: '#22c55e', marginLeft: 3 }}>{pillVal}</strong>}
          </div>
        )}
        {bell && <div className="mk-bell">{bell}</div>}
        <div className="mk-av">LK</div>
      </div>
    </div>
  )
}
