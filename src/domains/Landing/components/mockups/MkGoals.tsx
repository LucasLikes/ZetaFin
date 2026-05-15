import React from 'react'
import MkBar from './MkBar'
import MkTabs from './MkTabs'

export default function MkGoals() {
  const goals = [
    { name: '✈️ Viagem para Europa',    sub: 'Prazo: dezembro de 2025', pct: 68, color: '#22c55e',             saved: 'R$ 6.800', left: 'R$ 3.200',  hi: true  },
    { name: '🚗 Trocar de carro',        sub: 'Prazo: sem prazo',        pct: 31, color: 'rgba(255,255,255,.6)', saved: 'R$ 9.300', left: 'R$ 20.700', hi: false },
    { name: '🏥 Reserva de emergência',  sub: 'Prazo: março de 2026',    pct: 52, color: '#f59e0b',             saved: 'R$ 7.800', left: 'R$ 7.200',  hi: false },
  ]

  return (
    <>
      <MkBar page="Metas" pill="3 ativas" />
      <MkTabs active="Metas" />
      <div className="mk-goals">
        {goals.map(g => (
          <div key={g.name} className={`mk-goal${g.hi ? ' hi' : ''}`}>
            <div className="mk-goal-head">
              <div>
                <div className="mk-goal-name">{g.name}</div>
                <div className="mk-goal-sub">{g.sub}</div>
              </div>
              <div className="mk-goal-pct" style={{ color: g.color }}>{g.pct}%</div>
            </div>
            <div className="mk-track">
              <div style={{ width: `${g.pct}%`, height: '100%', borderRadius: '100px', background: g.color }} />
            </div>
            <div className="mk-goal-footer">
              <span>{g.saved} guardados</span>
              <span>Falta <strong>{g.left}</strong></span>
            </div>
          </div>
        ))}
        <div className="mk-add-goal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Nova meta
        </div>
      </div>
    </>
  )
}
