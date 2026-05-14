import { useState } from 'react'
import type { ColorPalette } from '../theme/theme'

const FONT = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif`

interface WeekBar {
  day: string
  val: number
  hasData: boolean
}

interface WeeklyBarChartProps {
  C: ColorPalette
  data?: WeekBar[]
  title?: string
  total?: string
  pctChange?: string
  onInsightClick?: () => void
}

const DEFAULT_DATA: WeekBar[] = [
  { day: 'Seg', val: 180, hasData: true },
  { day: 'Ter', val: 420, hasData: true },
  { day: 'Qua', val: 280, hasData: true },
  { day: 'Qui', val: 0,   hasData: false },
  { day: 'Sex', val: 0,   hasData: false },
  { day: 'Sáb', val: 0,   hasData: false },
  { day: 'Dom', val: 0,   hasData: false },
]

export const WeeklyBarChart = ({
  C,
  data = DEFAULT_DATA,
  title = 'Gastos essa semana',
  total = 'R$ 1.200,00',
  pctChange = '60%',
  onInsightClick,
}: WeeklyBarChartProps) => {
  const [hovered, setHovered] = useState<number | null>(null)

  const maxVal = Math.max(...data.map(d => d.val), 1)
  const BAR_MAX_H = 60

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '18px 20px', boxShadow: C.shadow }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: C.muted, fontFamily: FONT }}>{title}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>

      {/* total + badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <span style={{ fontSize: '22px', fontWeight: 800, color: C.text, letterSpacing: '-.5px', fontFamily: FONT }}>{total}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '3px',
          fontSize: '12px', fontWeight: 700, color: C.green,
          background: C.greenDim, border: `1px solid ${C.greenBdr}`,
          padding: '2px 8px', borderRadius: '20px',
        }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
          </svg>
          {pctChange}
        </span>
      </div>

      {/* ref line */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
        <span style={{ fontSize: '10px', color: C.muted2, fontFamily: FONT }}>R$ 200</span>
      </div>

      {/* bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: `${BAR_MAX_H}px`, marginBottom: '6px' }}>
        {data.map((d, i) => {
          const h = d.hasData && d.val > 0 ? Math.max((d.val / maxVal) * BAR_MAX_H, 6) : 20
          const isHov = hovered === i
          return (
            <div
              key={d.day}
              style={{ flex: 1, position: 'relative', height: `${BAR_MAX_H}px`, display: 'flex', alignItems: 'flex-end' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHov && d.hasData && d.val > 0 && (
                <div style={{
                  position: 'absolute', bottom: `${h + 6}px`, left: '50%', transform: 'translateX(-50%)',
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: '6px', padding: '3px 7px', whiteSpace: 'nowrap',
                  fontSize: '10px', fontWeight: 700, color: C.text, zIndex: 10,
                  boxShadow: C.shadowMd, fontFamily: FONT,
                }}>
                  R$ {d.val}
                </div>
              )}
              <div style={{
                width: '100%',
                height: `${h}px`,
                borderRadius: '5px 5px 0 0',
                background: d.hasData && d.val > 0 ? C.green : 'transparent',
                border: d.hasData && d.val > 0 ? 'none' : `1.5px dashed ${C.barEmptyBorder}`,
                backgroundColor: d.hasData && d.val > 0 ? C.green : C.barEmpty,
                transition: 'opacity .15s',
                opacity: isHov ? 0.75 : 1,
                cursor: 'default',
              }} />
            </div>
          )
        })}
      </div>

      {/* ref line bottom */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px' }}>
        <span style={{ fontSize: '10px', color: C.muted2, fontFamily: FONT }}>R$ 0</span>
      </div>

      {/* day labels */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
        {data.map(d => (
          <div key={d.day} style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: C.muted, fontFamily: FONT }}>{d.day}</div>
        ))}
      </div>

      {/* insights footer */}
      <div
        onClick={onInsightClick}
        style={{
          borderTop: `1px solid ${C.border}`, paddingTop: '12px',
          display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
        }}
        onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span style={{ fontSize: '12px', fontWeight: 600, color: C.text, fontFamily: FONT }}>Insights financeiros</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto' }}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </div>
  )
}

export default WeeklyBarChart