import { useState } from 'react'
import type { Goal } from '../types'

const brl = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

function projectAmount(principal: number, monthlyRate: number, months: number, monthlyContribution = 0): number {
  const growth = Math.pow(1 + monthlyRate, months)
  return principal * growth + monthlyContribution * ((growth - 1) / monthlyRate)
}

export const SavingsBox = ({ goal }: { goal: Goal }) => {
  const [expanded, setExpanded] = useState(false)
  const monthlyRate = Math.pow(1 + (goal.yieldRate ?? 0.115), 1 / 12) - 1
  const monthlyContrib = goal.monthlyContribution ?? 0
  const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0)
  const CHECKPOINTS = [6, 12, 18, 24]
  const projections = CHECKPOINTS.map(months => ({
    months,
    value: projectAmount(goal.currentAmount, monthlyRate, months, monthlyContrib),
  }))
  const targetMonth = (() => {
    for (let m = 1; m <= 60; m++) {
      if (projectAmount(goal.currentAmount, monthlyRate, m, monthlyContrib) >= goal.targetAmount) return m
    }
    return null
  })()
  const maxProj = projections[projections.length - 1].value
  const FONT = `'Plus Jakarta Sans', system-ui, sans-serif`

  return (
    <div style={{
      background: '#111', border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '14px', padding: '18px 20px', marginBottom: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.4)', position: 'relative',
      overflow: 'hidden', fontFamily: FONT,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #22c55e, #3b82f6)', opacity: 0.8 }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', letterSpacing: '-.2px', fontFamily: FONT }}>{goal.title}</div>
          {goal.description && <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '2px', fontFamily: FONT }}>{goal.description}</div>}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)', fontFamily: FONT }}>📈 Investimento</span>
          {targetMonth && <span style={{ fontSize: '10px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', fontFamily: FONT }}>Meta em {targetMonth}m</span>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { label: 'Atual', value: brl(goal.currentAmount), color: '#f8fafc' },
          { label: 'Meta', value: brl(goal.targetAmount), color: 'rgba(255,255,255,0.5)' },
          ...(monthlyContrib > 0 ? [{ label: 'Aporte/mês', value: brl(monthlyContrib), color: '#3b82f6' }] : []),
          { label: 'Taxa anual', value: `${((goal.yieldRate ?? 0.115) * 100).toFixed(1)}%`, color: 'rgba(255,255,255,0.5)' },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '3px', fontFamily: FONT }}>{label}</div>
            <div style={{ fontSize: '17px', fontWeight: 700, color, letterSpacing: '-.2px', fontFamily: FONT }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden', marginBottom: '5px' }}>
          <div style={{ height: '100%', borderRadius: '3px', background: 'linear-gradient(90deg, #22c55e, #3b82f6)', width: `${pct.toFixed(1)}%`, transition: 'width .5s cubic-bezier(.4,0,.2,1)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: FONT }}>
          <span>{pct.toFixed(0)}% da meta</span>
          <span>Faltam {brl(remaining)}</span>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: expanded ? '12px' : '0' }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '.07em', fontFamily: FONT }}>
            📈 Projeção com rendimento (~{(monthlyRate * 100).toFixed(1)}%/mês)
          </div>
          <button onClick={() => setExpanded(v => !v)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '11px', fontWeight: 600, color: '#3b82f6',
            padding: '2px 6px', borderRadius: '5px', transition: 'all .15s', fontFamily: FONT,
          }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(59,130,246,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >{expanded ? '▲ Ocultar' : '▼ Ver projeção'}</button>
        </div>

        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {projections.map(({ months, value }) => {
              const reached = value >= goal.targetAmount
              const barPct = Math.min((value / Math.max(maxProj, goal.targetAmount)) * 100, 100)
              return (
                <div key={months} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 500, width: '54px', flexShrink: 0, fontFamily: FONT }}>{months} meses</div>
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: '2px', background: reached ? 'linear-gradient(90deg,#22c55e,#16a34a)' : 'linear-gradient(90deg,#22c55e,#3b82f6)', width: `${barPct.toFixed(1)}%`, transition: 'width .4s' }} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: reached ? '#22c55e' : '#f8fafc', width: '80px', textAlign: 'right', flexShrink: 0, fontFamily: FONT }}>
                    {brl(value)}{reached && <span style={{ display: 'inline-block', marginLeft: '4px', fontSize: '9px', fontWeight: 700, padding: '1px 5px', borderRadius: '20px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)' }}>✓</span>}
                  </div>
                </div>
              )
            })}
            {targetMonth && (
              <div style={{ marginTop: '8px', padding: '8px 11px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', fontSize: '11px', color: '#22c55e', fontWeight: 600, fontFamily: FONT }}>
                💡 {monthlyContrib > 0 ? `Investindo ${brl(monthlyContrib)}/mês, você atinge ${brl(goal.targetAmount)} em ${targetMonth} meses` : `Sem aportes, você atinge ${brl(goal.targetAmount)} em ${targetMonth} meses`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavingsBox