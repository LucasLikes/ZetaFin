import React from 'react'

interface MkTabsProps {
  active: string
}

export default function MkTabs({ active }: MkTabsProps) {
  const map: Record<string, string> = {
    'Dashboard': 'Dashboard',
    'Lançamentos': 'Lançamentos',
    'Metas': 'Metas',
    'Relatórios': 'Relatórios',
    'Score & Relatórios': 'Relatórios',
  }

  return (
    <div className="mk-tabs">
      {['Dashboard', 'Lançamentos', 'Metas', 'Relatórios'].map(t => (
        <div key={t} className={`mk-tab${map[active] === t ? ' on' : ''}`}>{t}</div>
      ))}
    </div>
  )
}
