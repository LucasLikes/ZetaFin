import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useFinance } from '../hooks/useFinance'
import type { Transaction } from '../types'
import type { JSX } from 'react/jsx-runtime'

// ─── helpers ────────────────────────────────────────────────────────────────
const brl = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ─── paleta ──────────────────────────────────────────────────────────────────
const C = {
  bg:       '#F0F7F4',
  surface:  '#FFFFFF',
  surf2:    'rgba(74,222,128,.06)',
  border:   '#E2EDE8',
  text:     '#0E1B15',
  muted:    '#5A7A6A',
  muted2:   '#8FADA0',
  green:    '#4ade80',
  greenDk:  '#16a34a',
  greenDim: 'rgba(74,222,128,.10)',
  greenBdr: 'rgba(74,222,128,.30)',
  greenGlo: '0 0 12px rgba(74,222,128,.25)',
  red:      '#f87171',
  redDim:   'rgba(248,113,113,.09)',
  redBdr:   'rgba(248,113,113,.28)',
  amber:    '#fbbf24',
  amberDim: 'rgba(251,191,36,.09)',
  amberBdr: 'rgba(251,191,36,.28)',
  blue:     '#60a5fa',
  shadow:   '0 1px 4px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04)',
  shadowLg: '0 6px 20px rgba(0,0,0,.09)',
}

// ─── ícones ──────────────────────────────────────────────────────────────────
const IcHome     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IcList     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const IcCard     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcFlag     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
const IcSettings = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
const IcPlus     = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IcLogout   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcAlert    = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IcTrash    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
const IcSearch   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcChevron  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
const IcUp       = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 15 12 8 19 15"/></svg>
const IcDown     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="19 9 12 16 5 9"/></svg>

// ─── tipos ───────────────────────────────────────────────────────────────────
type Page = 'inicio' | 'historico' | 'dividas' | 'metas' | 'config'
const NAV: { id: Page; label: string; icon: () => JSX.Element }[] = [
  { id: 'inicio',    label: 'Dashboard', icon: IcHome     },
  { id: 'historico', label: 'Histórico', icon: IcList     },
  { id: 'dividas',   label: 'Dívidas',   icon: IcCard     },
  { id: 'metas',     label: 'Metas',     icon: IcFlag     },
  { id: 'config',    label: 'Config',    icon: IcSettings },
]

const inputBase: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: '10px',
  background: C.surface, border: `1.5px solid ${C.border}`,
  color: C.text, fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', fontFamily: 'inherit', fontWeight: 500,
  transition: 'border-color .2s',
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage, user, onLogout }: {
  page: Page
  setPage: (p: Page) => void
  user: { name?: string; email?: string; avatar?: string } | null
  onLogout: () => void
}) => {
  const [expanded, setExpanded] = useState(false)
  const W = expanded ? 220 : 64

  return (
    <aside style={{
      width: `${W}px`, minWidth: `${W}px`, flexShrink: 0,
      background: '#0c1a14',
      borderRight: `1px solid rgba(74,222,128,.12)`,
      display: 'flex', flexDirection: 'column',
      transition: 'width .25s cubic-bezier(.4,0,.2,1), min-width .25s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden', position: 'relative', zIndex: 10,
    }}>
      {/* neon top bar */}
      <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #4ade80, transparent)', opacity: .7 }} />

      {/* logo */}
      <div style={{
        padding: expanded ? '20px 16px 12px' : '20px 0 12px',
        display: 'flex', alignItems: 'center',
        justifyContent: expanded ? 'space-between' : 'center',
        borderBottom: '1px solid rgba(74,222,128,.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
            background: 'linear-gradient(135deg,#4ade80,#16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: 800, color: '#0c1a14',
            boxShadow: '0 0 14px rgba(74,222,128,.3)',
          }}>Ζ</div>
          {expanded && (
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#f0fdf4', letterSpacing: '-.3px', whiteSpace: 'nowrap' }}>
              ZetaFin
            </span>
          )}
        </div>
        {expanded && (
          <button onClick={() => setExpanded(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(74,222,128,.5)', padding: '4px', borderRadius: '6px',
            display: 'flex', transition: 'color .2s', flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#4ade80')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(74,222,128,.5)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        )}
      </div>

      {/* nav items */}
      <div style={{ flex: 1, padding: expanded ? '12px 10px' : '12px 8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(({ id, label, icon: Ic }, idx) => {
          const active = page === id
          return (
            <div key={id} style={{ position: 'relative' }}>
              {/* neon bottom indicator */}
              {active && !expanded && (
                <div style={{
                  position: 'absolute', bottom: '-1px', left: '12px', right: '12px', height: '2px',
                  background: '#4ade80',
                  boxShadow: '0 0 8px rgba(74,222,128,.7)',
                  borderRadius: '1px',
                }} />
              )}
              <button
                onClick={() => { setPage(id); if (!expanded && idx !== -1) {} }}
                title={!expanded ? label : undefined}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: expanded ? '12px' : '0',
                  justifyContent: expanded ? 'flex-start' : 'center',
                  padding: expanded ? '10px 12px' : '11px 0',
                  borderRadius: '10px', width: '100%',
                  border: `1px solid ${active ? 'rgba(74,222,128,.25)' : 'transparent'}`,
                  background: active ? 'rgba(74,222,128,.1)' : 'transparent',
                  color: active ? '#4ade80' : 'rgba(240,253,244,.45)',
                  cursor: 'pointer', transition: 'all .18s',
                  fontSize: '13px', fontWeight: 600,
                  fontFamily: 'inherit',
                  boxShadow: active ? '0 0 10px rgba(74,222,128,.12)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,.06)'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(240,253,244,.8)'
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    (e.currentTarget as HTMLElement).style.background = 'transparent'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(240,253,244,.45)'
                  }
                }}
              >
                <span style={{ flexShrink: 0 }}><Ic /></span>
                {expanded && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
              </button>
            </div>
          )
        })}

        {/* expand button when collapsed */}
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            title="Expandir menu"
            style={{
              marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '10px 0', borderRadius: '10px', width: '100%',
              border: '1px solid rgba(74,222,128,.1)', background: 'transparent',
              color: 'rgba(74,222,128,.4)', cursor: 'pointer', transition: 'all .2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#4ade80'; (e.currentTarget as HTMLElement).style.background = 'rgba(74,222,128,.06)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(74,222,128,.4)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <IcChevron />
          </button>
        )}
      </div>

      {/* user footer */}
      <div style={{ padding: expanded ? '12px 10px' : '12px 8px', borderTop: '1px solid rgba(74,222,128,.08)' }}>
        <button onClick={onLogout} title={!expanded ? 'Sair' : undefined} style={{
          display: 'flex', alignItems: 'center',
          gap: expanded ? '10px' : '0', justifyContent: expanded ? 'flex-start' : 'center',
          padding: expanded ? '10px 12px' : '10px 0',
          width: '100%', borderRadius: '10px',
          border: '1px solid transparent', background: 'transparent',
          color: 'rgba(248,113,113,.55)', cursor: 'pointer', transition: 'all .2s',
          fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,.07)'; (e.currentTarget as HTMLElement).style.color = '#f87171'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(248,113,113,.2)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(248,113,113,.55)'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent' }}
        >
          <IcLogout />
          {expanded && <span>Sair</span>}
        </button>

        {expanded && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px 2px' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
              background: 'linear-gradient(135deg,#4ade80,#16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#0c1a14',
            }}>
              {user.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#d1fae5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '10px', color: 'rgba(74,222,128,.45)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  'Alimentação': '#4ade80',
  'Transporte':  '#60a5fa',
  'Moradia':     '#a78bfa',
  'Saúde':       '#34d399',
  'Lazer':       '#f472b6',
  'Assinaturas': '#fbbf24',
  'Educação':    '#fb923c',
  'Geral':       '#94a3b8',
}

const DonutChart = ({ transactions }: { transactions: Transaction[] }) => {
  const [hovered, setHovered] = useState<string | null>(null)

  const despesas = transactions.filter(t => t.tipo === 'despesa')
  const byCategory: Record<string, number> = {}
  despesas.forEach(t => {
    byCategory[t.categoria] = (byCategory[t.categoria] || 0) + t.valor
  })
  const total = Object.values(byCategory).reduce((a, b) => a + b, 0)
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  if (total === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', color: C.muted, fontSize: '13px' }}>
        Sem despesas registradas
      </div>
    )
  }

  // build SVG arcs
  const cx = 80, cy = 80, R = 68, r = 44
  let cumulAngle = -Math.PI / 2

  const arcs = entries.map(([cat, val]) => {
    const pct = val / total
    const angle = pct * 2 * Math.PI
    const x1 = cx + R * Math.cos(cumulAngle)
    const y1 = cy + R * Math.sin(cumulAngle)
    const x2 = cx + R * Math.cos(cumulAngle + angle)
    const y2 = cy + R * Math.sin(cumulAngle + angle)
    const ix1 = cx + r * Math.cos(cumulAngle)
    const iy1 = cy + r * Math.sin(cumulAngle)
    const ix2 = cx + r * Math.cos(cumulAngle + angle)
    const iy2 = cy + r * Math.sin(cumulAngle + angle)
    const large = angle > Math.PI ? 1 : 0
    const d = [
      `M ${x1} ${y1}`,
      `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1}`,
      'Z'
    ].join(' ')
    const color = CATEGORY_COLORS[cat] || '#94a3b8'
    const midAngle = cumulAngle + angle / 2
    cumulAngle += angle
    return { cat, val, pct, d, color, midAngle }
  })

  const hov = hovered ? entries.find(e => e[0] === hovered) : null

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {arcs.map(({ cat, d, color, pct }) => {
            const isHov = hovered === cat
            return (
              <path
                key={cat}
                d={d}
                fill={color}
                opacity={hovered && !isHov ? 0.35 : 0.92}
                style={{ cursor: 'pointer', transition: 'opacity .2s, transform .2s', transformOrigin: '80px 80px', transform: isHov ? 'scale(1.04)' : 'scale(1)' }}
                onMouseEnter={() => setHovered(cat)}
                onMouseLeave={() => setHovered(null)}
              />
            )
          })}
          {/* center */}
          <circle cx="80" cy="80" r="38" fill={C.surface} />
          {hov ? (
            <>
              <text x="80" y="74" textAnchor="middle" fontSize="10" fill={C.muted} fontFamily="inherit">{hov[0]}</text>
              <text x="80" y="90" textAnchor="middle" fontSize="12" fontWeight="700" fill={C.text} fontFamily="inherit">{(hov[1] / total * 100).toFixed(0)}%</text>
            </>
          ) : (
            <>
              <text x="80" y="76" textAnchor="middle" fontSize="9" fill={C.muted} fontFamily="inherit">Despesas</text>
              <text x="80" y="90" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.text} fontFamily="inherit">R$ {(total/1000).toFixed(1)}k</text>
            </>
          )}
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: '130px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {arcs.slice(0, 6).map(({ cat, val, pct, color }) => (
          <div key={cat}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default', opacity: hovered && hovered !== cat ? .45 : 1, transition: 'opacity .2s' }}
            onMouseEnter={() => setHovered(cat)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '11px', color: C.muted, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: C.text, whiteSpace: 'nowrap' }}>{(pct * 100).toFixed(0)}%</div>
            <div style={{ fontSize: '11px', color: C.muted, whiteSpace: 'nowrap' }}>{brl(val)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────
const BarChart = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai']
  const des    = [2100, 2800, 2400, 3100, 3350]
  const ent    = [4500, 4500, 4200, 4800, 5200]
  const max    = Math.max(...ent)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '100%', paddingBottom: '22px' }}>
      {months.map((m, i) => (
        <div key={m} style={{ flex: 1, display: 'flex', gap: '3px', alignItems: 'flex-end', position: 'relative' }}>
          <div
            title={`Despesas: ${brl(des[i])}`}
            style={{ flex: 1, height: `${Math.round((des[i] / max) * 110)}px`, background: 'rgba(248,113,113,.65)', borderRadius: '3px 3px 0 0', transition: 'opacity .2s', cursor: 'default' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '.65')}
          />
          <div
            title={`Entradas: ${brl(ent[i])}`}
            style={{ flex: 1, height: `${Math.round((ent[i] / max) * 110)}px`, background: 'rgba(74,222,128,.7)', borderRadius: '3px 3px 0 0', transition: 'opacity .2s', cursor: 'default', boxShadow: '0 0 8px rgba(74,222,128,.2)' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '.7')}
          />
          <span style={{ position: 'absolute', bottom: '-20px', left: 0, right: 0, textAlign: 'center', fontSize: '9px', color: C.muted }}>{m}</span>
        </div>
      ))}
    </div>
  )
}

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, color, sub, accent, glow }: {
  label: string; value: string; color: string; sub?: string; accent: string; glow?: string
}) => (
  <div
    style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: C.shadow, transition: 'all .25s' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = `${C.shadowLg}, ${glow || ''}` ; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = C.shadow; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accent, boxShadow: glow ? `0 0 8px ${accent}` : 'none' }} />
    <div style={{ fontSize: '11px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px' }}>{label}</div>
    <div style={{ fontSize: '24px', fontWeight: 800, color, letterSpacing: '-.5px', lineHeight: 1, marginBottom: '6px' }}>{value}</div>
    {sub && <div style={{ fontSize: '12px', color: C.muted2 }}>{sub}</div>}
  </div>
)

// ─── TX ROW ──────────────────────────────────────────────────────────────────
const TxRow = ({ tx, onDelete }: { tx: Transaction; onDelete?: (id: string) => void }) => {
  const isE = tx.tipo === 'entrada'
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: `1px solid ${C.border}`, transition: 'background .2s', borderRadius: '4px' }}
      onMouseEnter={e => (e.currentTarget.style.background = C.surf2)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isE ? C.greenDim : C.redDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: isE ? C.green : C.red }}>
        {isE ? <IcUp /> : <IcDown />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.descricao}</div>
        <div style={{ fontSize: '11px', color: C.muted, marginTop: '2px' }}>{tx.categoria} · {tx.data}</div>
      </div>
      <div style={{ fontSize: '13px', fontWeight: 800, color: isE ? C.green : C.red, flexShrink: 0 }}>
        {isE ? '+' : '−'}{brl(tx.valor)}
      </div>
      {onDelete && (
        <button onClick={() => onDelete(tx.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted2, display: 'flex', padding: '5px', borderRadius: '6px', transition: 'all .2s', flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.red; (e.currentTarget as HTMLElement).style.background = C.redDim }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.muted2; (e.currentTarget as HTMLElement).style.background = 'none' }}
        ><IcTrash /></button>
      )}
    </div>
  )
}

// ─── MODAL ───────────────────────────────────────────────────────────────────
const CATS_D = ['Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Lazer', 'Assinaturas', 'Educação', 'Geral']
const CATS_E = ['Salário', 'Freelance', 'Investimento', 'Bonus', 'Outro']

const TxModal = ({ open, onClose, onSave }: {
  open: boolean; onClose: () => void; onSave: (tx: Omit<Transaction, 'id'>) => Promise<void>
}) => {
  const [tipo, setTipo] = useState<'despesa' | 'entrada'>('despesa')
  const [desc, setDesc] = useState('')
  const [valor, setValor] = useState('')
  const [cat, setCat] = useState(CATS_D[0])
  const [saving, setSaving] = useState(false)
  if (!open) return null
  const cats = tipo === 'despesa' ? CATS_D : CATS_E
  const save = async () => {
    if (!desc.trim() || Number(valor) <= 0) return
    setSaving(true)
    try { await onSave({ tipo, descricao: desc.trim(), categoria: cat, valor: Number(valor), data: '' }); setDesc(''); setValor(''); onClose() }
    finally { setSaving(false) }
  }
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, border: `1.5px solid ${C.greenBdr}`, borderRadius: '18px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: `0 20px 60px rgba(0,0,0,.2), ${C.greenGlo}`, animation: 'fadeUp .2s ease' }}>
        <div style={{ fontSize: '16px', fontWeight: 800, color: C.text, marginBottom: '18px' }}>Nova transação</div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
          {(['despesa', 'entrada'] as const).map(t => (
            <button key={t} onClick={() => { setTipo(t); setCat(t === 'despesa' ? CATS_D[0] : CATS_E[0]) }} style={{
              flex: 1, padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all .18s', fontFamily: 'inherit',
              background: tipo === t ? (t === 'despesa' ? C.redDim : C.greenDim) : C.surf2,
              color:      tipo === t ? (t === 'despesa' ? C.red    : C.green)    : C.muted,
              border:     `1.5px solid ${tipo === t ? (t === 'despesa' ? C.redBdr : C.greenBdr) : C.border}`,
            }}>{t === 'despesa' ? '↓ Despesa' : '↑ Entrada'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em' }}>Descrição</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Mercado, Salário..." style={inputBase}
              onFocus={e => (e.target.style.borderColor = C.green)} onBlur={e => (e.target.style.borderColor = C.border)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em' }}>Valor (R$)</label>
              <input type="number" min="0" step="0.01" value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00" style={inputBase}
                onFocus={e => (e.target.style.borderColor = C.green)} onBlur={e => (e.target.style.borderColor = C.border)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em' }}>Categoria</label>
              <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inputBase, appearance: 'none' } as React.CSSProperties}
                onFocus={e => (e.target.style.borderColor = C.green)} onBlur={e => (e.target.style.borderColor = C.border)}>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: `1px solid ${C.border}`, background: 'none', color: C.muted, fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
          <button onClick={save} disabled={saving || !desc || Number(valor) <= 0} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', background: saving || !desc || Number(valor) <= 0 ? 'rgba(74,222,128,.3)' : C.green, color: '#0c1a14', fontSize: '13px', fontWeight: 800, cursor: saving || !desc || Number(valor) <= 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: saving || !desc || Number(valor) <= 0 ? 'none' : C.greenGlo }}>
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE INICIO ─────────────────────────────────────────────────────────────
const PageInicio = ({ finance, onAddTx, onGoPage }: {
  finance: ReturnType<typeof useFinance>; onAddTx: () => void; onGoPage: (p: Page) => void
}) => (
  <div>
    {/* alert */}
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', background: C.amberDim, border: `1px solid ${C.amberBdr}`, fontSize: '13px', color: C.amber, fontWeight: 500 }}>
      <IcAlert /> Você está gastando acima do padrão — delivery representa 31% das despesas este mês.
    </div>

    {/* metric cards */}
    <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
      {finance.loading ? [1, 2, 3, 4].map(k => <div key={k} style={{ height: '90px', background: C.surf2, borderRadius: '14px', animation: 'pulse 1.5s ease-in-out infinite' }} />) : <>
        <MetricCard label="Saldo do mês" value={brl(finance.summary?.saldo ?? 0)} color={C.green} accent={C.green} glow="0 0 10px rgba(74,222,128,.2)" sub="entradas − despesas" />
        <MetricCard label="Entradas"     value={brl(finance.summary?.entradas ?? 0)} color="#34d399" accent="#34d399" glow="0 0 10px rgba(52,211,153,.2)" sub="mês atual" />
        <MetricCard label="Despesas"     value={brl(finance.summary?.despesas ?? 0)} color={C.red} accent={C.red} sub="+8% vs anterior" />
        <MetricCard label="Limite diário" value={brl(finance.summary?.limiteDiario ?? 0)} color={C.blue} accent={C.blue} sub="pode gastar hoje" />
      </>}
    </div>

    {/* charts row */}
    <div className="row2-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
      {/* bar chart */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', boxShadow: C.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: C.text }}>Entradas vs Despesas</span>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[[C.red, 'Despesas'], [C.green, 'Entradas']].map(([c, l]) => (
              <div key={String(l)} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: C.muted, fontWeight: 600 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: String(c) }} />{l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: '150px' }}><BarChart /></div>
      </div>

      {/* donut chart */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', boxShadow: C.shadow }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: C.text, marginBottom: '16px' }}>Gastos por categoria</div>
        <DonutChart transactions={finance.transactions} />
      </div>
    </div>

    {/* bottom row */}
    <div className="row3-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>
      {/* transactions */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', boxShadow: C.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: C.text }}>Últimas transações</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={onAddTx} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '9px', border: 'none', background: C.green, color: '#0c1a14', fontSize: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all .2s', boxShadow: C.greenGlo, fontFamily: 'inherit' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(74,222,128,.35)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = C.greenGlo }}
            ><IcPlus /> Nova</button>
            <button onClick={() => onGoPage('historico')} style={{ padding: '8px 14px', borderRadius: '9px', border: `1.5px solid ${C.border}`, background: 'none', color: C.muted, fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all .2s', fontFamily: 'inherit' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.greenBdr; (e.currentTarget as HTMLElement).style.color = C.green }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted }}
            >Ver tudo</button>
          </div>
        </div>
        {finance.transactions.slice(0, 6).map(tx => <TxRow key={tx.id} tx={tx} />)}
      </div>

      {/* debts preview */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', boxShadow: C.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: C.text }}>Dívidas ativas</span>
          <button onClick={() => onGoPage('dividas')} style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '7px', border: `1px solid ${C.border}`, background: 'none', color: C.muted, cursor: 'pointer', fontWeight: 600, transition: 'all .2s', fontFamily: 'inherit' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.green; (e.currentTarget as HTMLElement).style.borderColor = C.greenBdr }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.muted; (e.currentTarget as HTMLElement).style.borderColor = C.border }}
          >Ver todas</button>
        </div>
        {finance.debts.slice(0, 3).map(d => {
          const pct = Math.min((d.pago / d.total) * 100, 100)
          const clr = pct >= 100 ? C.green : pct > 60 ? C.amber : C.red
          return (
            <div key={d.id} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: C.text }}>{d.nome}</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: clr }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{ background: C.border, borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '4px', background: clr, width: `${pct.toFixed(1)}%`, transition: 'width .5s', boxShadow: pct >= 100 ? C.greenGlo : 'none' }} />
              </div>
            </div>
          )
        })}
        {finance.debts.length === 0 && <div style={{ textAlign: 'center', padding: '20px', color: C.muted, fontSize: '12px' }}>Sem dívidas 🎉</div>}
      </div>
    </div>
  </div>
)

// ─── PAGE HISTORICO ───────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const PageHistorico = ({ finance }: { finance: ReturnType<typeof useFinance> }) => {
  const now = new Date()
  const [selMonth, setSelMonth] = useState(now.getMonth())
  const [selYear] = useState(now.getFullYear())
  const [filter, setFilter] = useState<'all' | 'entrada' | 'despesa'>('all')
  const [busca, setBusca] = useState('')

  // For demo purposes, show all transactions but filter by type/search
  const filtered = finance.transactions.filter(t =>
    (filter === 'all' || t.tipo === filter) &&
    (!busca || t.descricao.toLowerCase().includes(busca.toLowerCase()) || t.categoria.toLowerCase().includes(busca.toLowerCase()))
  )

  const totalEntradas = filtered.filter(t => t.tipo === 'entrada').reduce((a, t) => a + t.valor, 0)
  const totalDespesas = filtered.filter(t => t.tipo === 'despesa').reduce((a, t) => a + t.valor, 0)

  return (
    <div>
      {/* month selector */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', boxShadow: C.shadow }}>
        <div style={{ fontSize: '11px', color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '12px' }}>
          Período — {selYear}
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {MONTHS.map((m, i) => {
            const active = i === selMonth
            const future = i > now.getMonth()
            return (
              <button key={m} onClick={() => !future && setSelMonth(i)} disabled={future} style={{
                padding: '7px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: future ? 'not-allowed' : 'pointer',
                transition: 'all .18s', fontFamily: 'inherit',
                background: active ? C.green : 'transparent',
                color: future ? C.muted2 : active ? '#0c1a14' : C.muted,
                border: `1.5px solid ${active ? C.green : C.border}`,
                boxShadow: active ? C.greenGlo : 'none',
                opacity: future ? .4 : 1,
              }}>
                {m}
              </button>
            )
          })}
        </div>
      </div>

      {/* summary pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {[
          { label: 'Entradas', val: totalEntradas, color: C.green, bg: C.greenDim, bd: C.greenBdr },
          { label: 'Despesas', val: totalDespesas, color: C.red,   bg: C.redDim,   bd: C.redBdr   },
          { label: 'Saldo',    val: totalEntradas - totalDespesas, color: totalEntradas - totalDespesas >= 0 ? C.green : C.red, bg: C.surf2, bd: C.border },
        ].map(({ label, val, color, bg, bd }) => (
          <div key={label} style={{ padding: '10px 18px', borderRadius: '10px', background: bg, border: `1px solid ${bd}`, display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color }}>{brl(Math.abs(val))}</span>
          </div>
        ))}
      </div>

      {/* filter + search */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', boxShadow: C.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: C.text }}>
            {MONTHS[selMonth]} {selYear} · {filtered.length} transações
          </span>
          <div style={{ display: 'flex', gap: '5px' }}>
            {(['all', 'entrada', 'despesa'] as const).map(f => {
              const labels = { all: 'Todos', entrada: 'Entradas', despesa: 'Despesas' }
              const active = filter === f
              const ac = f === 'despesa' ? C.red : C.green
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all .18s', fontFamily: 'inherit',
                  background: active ? `${ac}18` : 'none',
                  color: active ? ac : C.muted,
                  border: `1.5px solid ${active ? ac : C.border}`,
                }}>{labels[f]}</button>
              )
            })}
          </div>
        </div>

        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <span style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)', color: C.muted }}><IcSearch /></span>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar transação ou categoria..." style={{ ...inputBase, paddingLeft: '40px' }}
            onFocus={e => (e.target.style.borderColor = C.green)} onBlur={e => (e.target.style.borderColor = C.border)} />
        </div>

        {finance.loading
          ? [1, 2, 3, 4, 5].map(k => <div key={k} style={{ height: '52px', background: C.surf2, borderRadius: '8px', marginBottom: '6px', animation: 'pulse 1.5s ease-in-out infinite' }} />)
          : filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: '40px', color: C.muted, fontSize: '14px' }}>Nenhuma transação encontrada</div>
            : filtered.map(tx => <TxRow key={tx.id} tx={tx} onDelete={finance.deleteTransaction} />)
        }
      </div>
    </div>
  )
}

// ─── PAGE DIVIDAS ─────────────────────────────────────────────────────────────
const PageDividas = ({ finance }: { finance: ReturnType<typeof useFinance> }) => {
  const [nome, setNome] = useState('')
  const [total, setTotal] = useState('')
  const [desc, setDesc] = useState('')
  const [pags, setPags] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const addDivida = async () => {
    if (!nome.trim() || Number(total) <= 0) return
    setSaving(true)
    try { await finance.addDebt({ nome: nome.trim(), descricao: desc.trim(), total: Number(total) }); setNome(''); setTotal(''); setDesc('') }
    finally { setSaving(false) }
  }
  const pay = async (id: string) => {
    const v = Number(pags[id] || 0)
    if (v <= 0) return
    await finance.payDebt(id, v)
    setPags(p => ({ ...p, [id]: '' }))
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: '16px', alignItems: 'start' }}>
      <div>
        {finance.loading
          ? [1, 2].map(k => <div key={k} style={{ height: '140px', background: C.surf2, borderRadius: '14px', marginBottom: '10px', animation: 'pulse 1.5s ease-in-out infinite' }} />)
          : finance.debts.length === 0
            ? <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '40px', textAlign: 'center', color: C.muted, fontSize: '13px' }}>Nenhuma dívida cadastrada</div>
            : finance.debts.map(d => {
              const pct = Math.min((d.pago / d.total) * 100, 100)
              const rest = Math.max(d.total - d.pago, 0)
              const quitada = rest <= 0
              const clr = quitada ? C.green : pct > 60 ? C.amber : C.red
              return (
                <div key={d.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '18px', marginBottom: '10px', boxShadow: C.shadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: C.text }}>{d.nome}{' '}
                        {quitada && <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: C.greenDim, color: C.green, border: `1px solid ${C.greenBdr}` }}>Quitada</span>}
                      </div>
                      {d.descricao && <div style={{ fontSize: '12px', color: C.muted, marginTop: '2px' }}>{d.descricao}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', background: `${clr}18`, color: clr, border: `1px solid ${clr}30` }}>{pct.toFixed(0)}%</span>
                      <button onClick={() => finance.deleteDebt(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted2, display: 'flex', padding: '4px', borderRadius: '6px', transition: 'all .2s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.red)} onMouseLeave={e => (e.currentTarget.style.color = C.muted2)}><IcTrash /></button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: C.muted, marginBottom: '8px' }}>
                    <span>Pago: <strong style={{ color: C.green }}>{brl(d.pago)}</strong></span>
                    <span>Resta: <strong style={{ color: C.amber }}>{brl(rest)}</strong></span>
                    <span>Total: <strong style={{ color: C.text }}>{brl(d.total)}</strong></span>
                  </div>
                  <div style={{ background: C.border, borderRadius: '4px', height: '6px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', borderRadius: '4px', background: clr, width: `${pct.toFixed(1)}%`, transition: 'width .5s', boxShadow: quitada ? C.greenGlo : 'none' }} />
                  </div>
                  {!quitada && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <input type="number" min="0" step="0.01" placeholder="Valor do pagamento" value={pags[d.id] || ''} onChange={e => setPags(p => ({ ...p, [d.id]: e.target.value }))} style={{ ...inputBase, flex: 1 }}
                        onFocus={e => (e.target.style.borderColor = C.amber)} onBlur={e => (e.target.style.borderColor = C.border)} />
                      <button onClick={() => pay(d.id)} style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: C.amber, color: '#1a0f00', fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>Registrar</button>
                    </div>
                  )}
                </div>
              )
            })
        }
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '18px', position: 'sticky', top: '70px', boxShadow: C.shadow }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: C.text, marginBottom: '14px' }}>Nova dívida</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[['Nome', 'text', nome, setNome, 'Ex: Banco, Cartão'], ['Valor total (R$)', 'number', total, setTotal, '0,00'], ['Descrição', 'text', desc, setDesc, 'Opcional']].map(([label, type, val, set, ph]) => (
            <div key={String(label)}>
              <label style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em' }}>{String(label)}</label>
              <input type={String(type)} value={String(val)} onChange={e => (set as (v: string) => void)(e.target.value)} placeholder={String(ph)} style={inputBase}
                onFocus={e => (e.target.style.borderColor = C.amber)} onBlur={e => (e.target.style.borderColor = C.border)} />
            </div>
          ))}
          <button onClick={addDivida} disabled={saving || !nome || Number(total) <= 0} style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: saving || !nome || Number(total) <= 0 ? C.amberDim : C.amber, color: '#1a0f00', fontSize: '13px', fontWeight: 800, cursor: saving || !nome || Number(total) <= 0 ? 'not-allowed' : 'pointer', marginTop: '2px', fontFamily: 'inherit' }}>
            {saving ? 'Salvando...' : 'Adicionar dívida'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE METAS ───────────────────────────────────────────────────────────────
const PageMetas = () => {
  const goals = [
    { id: 1, title: 'Viagem para Paris', atual: 8500, meta: 15000, prazo: '31/12/2025', cor: '#a78bfa' },
    { id: 2, title: 'Notebook Novo', atual: 2800, meta: 5000, prazo: '15/08/2025', cor: C.blue },
    { id: 3, title: 'Reserva de emergência', atual: 12000, meta: 20000, prazo: '30/06/2026', cor: C.green },
  ]
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: C.text }}>{goals.length} metas ativas</div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '9px', border: 'none', background: C.green, color: '#0c1a14', fontSize: '12px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: C.greenGlo }}>
          <IcPlus /> Nova meta
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
        {goals.map(g => {
          const pct = Math.min((g.atual / g.meta) * 100, 100)
          return (
            <div key={g.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', boxShadow: C.shadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: C.text }}>{g.title}</div>
                <span style={{ fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', background: `${g.cor}18`, color: g.cor, border: `1px solid ${g.cor}30` }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{ background: C.border, borderRadius: '6px', height: '8px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{ height: '100%', borderRadius: '6px', background: g.cor, width: `${pct.toFixed(1)}%`, transition: 'width .5s', boxShadow: `0 0 8px ${g.cor}40` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: C.muted, marginBottom: '8px' }}>
                <span>Atual: <strong style={{ color: g.cor }}>{brl(g.atual)}</strong></span>
                <span>Meta: <strong style={{ color: C.text }}>{brl(g.meta)}</strong></span>
              </div>
              <div style={{ fontSize: '11px', color: C.muted2 }}>Prazo: {g.prazo}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── PAGE CONFIG ──────────────────────────────────────────────────────────────
const PageConfig = ({ finance }: { finance: ReturnType<typeof useFinance> }) => {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState('5200')
  const [saving, setSaving] = useState(false)
  const save = async () => {
    setSaving(true)
    try { await import('../services/finance.service').then(m => m.financeService.setSalario(Number(value))); setEditing(false) }
    finally { setSaving(false) }
  }
  return (
    <div style={{ maxWidth: '480px' }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', marginBottom: '12px', boxShadow: C.shadow }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '14px' }}>Salário mensal</div>
        {editing ? (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input type="number" min="0" step="0.01" value={value} onChange={e => setValue(e.target.value)} style={{ ...inputBase, flex: 1 }}
              onFocus={e => (e.target.style.borderColor = C.green)} onBlur={e => (e.target.style.borderColor = C.border)} />
            <button onClick={save} disabled={saving} style={{ padding: '11px 16px', borderRadius: '9px', border: 'none', background: C.green, color: '#0c1a14', fontSize: '13px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>{saving ? '...' : 'Salvar'}</button>
            <button onClick={() => setEditing(false)} style={{ padding: '11px 12px', borderRadius: '9px', border: `1px solid ${C.border}`, background: 'none', color: C.muted, cursor: 'pointer', fontFamily: 'inherit' }}>✕</button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '28px', fontWeight: 800, color: C.green }}>{brl(Number(value))}</span>
            <button onClick={() => setEditing(true)} style={{ padding: '8px 14px', borderRadius: '9px', border: `1px solid ${C.border}`, background: 'none', color: C.muted, fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit' }}>Editar</button>
          </div>
        )}
        <p style={{ fontSize: '12px', color: C.muted, marginTop: '10px', lineHeight: '1.6' }}>Usado para calcular o limite diário e projeções.</p>
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', boxShadow: C.shadow }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '8px' }}>Sobre o ZetaFin</div>
        <p style={{ fontSize: '13px', color: C.muted, lineHeight: '1.7' }}>Controle financeiro pessoal — React + TypeScript. Conecte ao Firebase para persistência real.</p>
      </div>
    </div>
  )
}

// ─── DASHBOARD PAGE (ROOT) ────────────────────────────────────────────────────
export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()
  const finance = useFinance()
  const [page, setPage] = useState<Page>('inicio')
  const [modal, setModal] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const handleSaveTx = useCallback(async (tx: Omit<Transaction, 'id'>) => {
    await finance.addTransaction(tx)
  }, [finance])

  const PAGE_TITLES: Record<Page, string> = { inicio: 'Dashboard', historico: 'Histórico', dividas: 'Dívidas', metas: 'Metas', config: 'Configurações' }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        @keyframes pulse   { 0%,100%{opacity:.4} 50%{opacity:.7} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .page-anim { animation: fadeUp .22s ease both; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74,222,128,.25); border-radius: 4px; }
        .bnav { display: none !important; }
        @media(max-width: 768px) {
          .sidebar-wrap { display: none !important; }
          .bnav { display: flex !important; }
          .metrics-grid { grid-template-columns: repeat(2,1fr) !important; }
          .row2-grid { grid-template-columns: 1fr !important; }
          .row3-grid { grid-template-columns: 1fr !important; }
          .content-main { padding: 14px !important; padding-bottom: 80px !important; }
        }
        @media(max-width: 480px) {
          .metrics-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Syne', system-ui, sans-serif", color: C.text, fontSize: '14px' }}>

        {/* sidebar */}
        <div className="sidebar-wrap" style={{ display: 'flex', flexShrink: 0 }}>
          <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        </div>

        {/* main */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* topbar */}
          <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px', padding: '0 24px', background: C.surface, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 50, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,.05)', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: C.text, letterSpacing: '-.3px' }}>{PAGE_TITLES[page]}</div>
              <div style={{ width: '1px', height: '16px', background: C.border }} />
              <div style={{ fontSize: '12px', color: C.muted }}>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => setModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: 'none', background: C.green, color: '#0c1a14', fontSize: '13px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: C.greenGlo, transition: 'all .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 22px rgba(74,222,128,.4)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = C.greenGlo; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              ><IcPlus /> Nova transação</button>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'linear-gradient(135deg,#4ade80,#16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#0c1a14', boxShadow: C.greenGlo }}>
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </div>
            </div>
          </nav>

          {/* content */}
          <main className="content-main" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            <div key={page} className="page-anim">
              {page === 'inicio'    && <PageInicio    finance={finance} onAddTx={() => setModal(true)} onGoPage={setPage} />}
              {page === 'historico' && <PageHistorico finance={finance} />}
              {page === 'dividas'   && <PageDividas   finance={finance} />}
              {page === 'metas'     && <PageMetas />}
              {page === 'config'    && <PageConfig    finance={finance} />}
            </div>
          </main>
        </div>

        {/* mobile bottom nav */}
        <nav className="bnav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.surface, borderTop: `1px solid ${C.border}`, zIndex: 100, height: '56px' }}>
          <div style={{ display: 'flex', height: '100%' }}>
            {NAV.map(({ id, label, icon: Ic }) => (
              <button key={id} onClick={() => setPage(id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px', background: 'none', border: 'none', color: page === id ? C.green : C.muted2, fontSize: '9px', fontWeight: 700, cursor: 'pointer', transition: 'color .2s', fontFamily: 'inherit', position: 'relative' }}>
                {page === id && <div style={{ position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '2px', background: C.green, boxShadow: C.greenGlo, borderRadius: '1px' }} />}
                <Ic />{label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <TxModal open={modal} onClose={() => setModal(false)} onSave={handleSaveTx} />
    </>
  )
}

export default DashboardPage