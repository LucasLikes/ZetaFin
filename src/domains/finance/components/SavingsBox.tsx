import { useState } from 'react'
import type { Goal } from '../types'

// ─── helpers ─────────────────────────────────────────────────────────────────
const brl = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const FONT = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif`

const C = {
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  surf2: 'rgba(15,23,42,0.03)',
  border: '#E2E8F0',
  text: '#0F172A',
  muted: '#64748B',
  muted2: '#94A3B8',
  primary: '#7FE5A8',
  primaryText: '#0F2318',
  green: '#22C55E',
  greenDim: 'rgba(34,197,94,0.08)',
  greenBdr: 'rgba(34,197,94,0.20)',
  blue: '#3B82F6',
  blueDim: 'rgba(59,130,246,0.08)',
  blueBdr: 'rgba(59,130,246,0.20)',
  shadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 6px rgba(0,0,0,0.03)',
}

// ─── cálculo de projeção (juros compostos + aporte mensal) ────────────────────
// M = P*(1+i)^n + C * ((1+i)^n - 1) / i
function projectAmount(
  principal: number,
  monthlyRate: number,
  months: number,
  monthlyContribution = 0
): number {
  const growth = Math.pow(1 + monthlyRate, months)
  return principal * growth + monthlyContribution * ((growth - 1) / monthlyRate)
}

// ─── SAVINGS BOX ──────────────────────────────────────────────────────────────
export const SavingsBox = ({ goal }: { goal: Goal }) => {
  const [expanded, setExpanded] = useState(false)

  // taxa mensal a partir da anual
  const monthlyRate = Math.pow(1 + (goal.yieldRate ?? 0.115), 1 / 12) - 1
  const monthlyContrib = goal.monthlyContribution ?? 0

  const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  const remaining = Math.max(goal.targetAmount - goal.currentAmount, 0)

  const CHECKPOINTS = [6, 12, 18, 24]
  const projections = CHECKPOINTS.map((months) => ({
    months,
    value: projectAmount(goal.currentAmount, monthlyRate, months, monthlyContrib),
  }))

  // primeiro mês em que atinge a meta
  const targetMonth = (() => {
    for (let m = 1; m <= 60; m++) {
      if (projectAmount(goal.currentAmount, monthlyRate, m, monthlyContrib) >= goal.targetAmount)
        return m
    }
    return null
  })()

  const maxProj = projections[projections.length - 1].value

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: '14px',
        padding: '18px 20px',
        marginBottom: '12px',
        boxShadow: C.shadow,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: FONT,
        transition: 'box-shadow .2s',
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.07)')}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = C.shadow)}
    >
      {/* faixa superior colorida */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: `linear-gradient(90deg, ${C.primary}, ${C.blue})`,
          opacity: 0.85,
        }}
      />

      {/* header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, letterSpacing: '-.2px' }}>
            {goal.title}
          </div>
          {goal.description && (
            <div style={{ fontSize: '11px', color: C.muted2, marginTop: '2px' }}>{goal.description}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
          <span style={{
            fontSize: '10px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px',
            background: C.blueDim, color: C.blue, border: `1px solid ${C.blueBdr}`,
            letterSpacing: '.03em',
          }}>
            📈 Investimento
          </span>
          {targetMonth && (
            <span style={{
              fontSize: '10px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px',
              background: C.greenDim, color: C.green, border: `1px solid ${C.greenBdr}`,
            }}>
              Meta em {targetMonth}m
            </span>
          )}
        </div>
      </div>

      {/* valores */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { label: 'Atual', value: brl(goal.currentAmount), color: C.text },
          { label: 'Meta', value: brl(goal.targetAmount), color: C.muted },
          ...(monthlyContrib > 0
            ? [{ label: 'Aporte/mês', value: brl(monthlyContrib), color: C.blue }]
            : []),
          { label: 'Taxa anual', value: `${((goal.yieldRate ?? 0.115) * 100).toFixed(1)}%`, color: C.muted },
        ].map(({ label, value, color }) => (
          <div key={label}>
            <div style={{ fontSize: '10px', color: C.muted2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '3px' }}>
              {label}
            </div>
            <div style={{ fontSize: '17px', fontWeight: 700, color, letterSpacing: '-.2px' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* barra de progresso */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ height: '5px', background: C.bg, borderRadius: '3px', overflow: 'hidden', marginBottom: '5px' }}>
          <div
            style={{
              height: '100%', borderRadius: '3px',
              background: `linear-gradient(90deg, ${C.primary}, ${C.green})`,
              width: `${pct.toFixed(1)}%`,
              transition: 'width .5s cubic-bezier(.4,0,.2,1)',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: C.muted2 }}>
          <span>{pct.toFixed(0)}% da meta</span>
          <span>Faltam {brl(remaining)}</span>
        </div>
      </div>

      {/* projeções */}
      <div style={{
        background: C.bg, border: `1px solid ${C.border}`,
        borderRadius: '10px', padding: '12px 14px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: expanded ? '12px' : '0',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.07em' }}>
            📈 Projeção com rendimento (~{(monthlyRate * 100).toFixed(1)}%/mês)
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '11px', fontWeight: 600, color: C.blue,
              padding: '2px 6px', borderRadius: '5px',
              transition: 'all .15s', fontFamily: FONT,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = C.blueDim)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'none')}
          >
            {expanded ? '▲ Ocultar' : '▼ Ver projeção'}
          </button>
        </div>

        {expanded && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {projections.map(({ months, value }) => {
              const reached = value >= goal.targetAmount
              const barPct = Math.min((value / Math.max(maxProj, goal.targetAmount)) * 100, 100)
              return (
                <div key={months} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ fontSize: '11px', color: C.muted2, fontWeight: 500, width: '54px', flexShrink: 0 }}>
                    {months} meses
                  </div>
                  <div style={{ flex: 1, height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      background: reached
                        ? `linear-gradient(90deg, ${C.primary}, ${C.green})`
                        : `linear-gradient(90deg, ${C.primary}, ${C.blue})`,
                      width: `${barPct.toFixed(1)}%`,
                      transition: 'width .4s',
                    }} />
                  </div>
                  <div style={{
                    fontSize: '11px', fontWeight: 700,
                    color: reached ? C.green : C.text,
                    width: '80px', textAlign: 'right', flexShrink: 0,
                  }}>
                    {brl(value)}
                    {reached && (
                      <span style={{
                        display: 'inline-block', marginLeft: '4px',
                        fontSize: '9px', fontWeight: 700,
                        padding: '1px 5px', borderRadius: '20px',
                        background: C.greenDim, color: C.green,
                        border: `1px solid ${C.greenBdr}`,
                      }}>✓</span>
                    )}
                  </div>
                </div>
              )
            })}

            {/* insight automático */}
            {targetMonth && (
              <div style={{
                marginTop: '8px', padding: '8px 11px',
                background: C.greenDim, border: `1px solid ${C.greenBdr}`,
                borderRadius: '8px', fontSize: '11px', color: C.green, fontWeight: 600,
              }}>
                💡 {monthlyContrib > 0
                  ? `Investindo ${brl(monthlyContrib)}/mês, você atinge ${brl(goal.targetAmount)} em ${targetMonth} meses`
                  : `Sem aportes, você atinge ${brl(goal.targetAmount)} em ${targetMonth} meses`}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavingsBox
