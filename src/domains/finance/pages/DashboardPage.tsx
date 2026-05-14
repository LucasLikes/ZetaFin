import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useFinance } from '../hooks/useFinance'
import { SavingsBox } from '../components/SavingsBox'
import { InsightsPage } from './InsightsPage'
import type { Transaction, Goal } from '../types'
import type { JSX } from 'react/jsx-runtime'

// ─── helpers ────────────────────────────────────────────────────────────────
const brl = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ─── paleta refinada — fintech premium (Stripe / Apple) ──────────────────────
const C = {
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  surf2: 'rgba(15,23,42,0.03)',
  border: '#E2E8F0',
  borderMid: '#CBD5E1',
  text: '#0F172A',
  muted: '#64748B',
  muted2: '#94A3B8',
  primary: '#7FE5A8',
  primaryText: '#0F2318',
  primaryHov: '#6DD99A',
  green: '#22C55E',
  greenDim: 'rgba(34,197,94,0.08)',
  greenBdr: 'rgba(34,197,94,0.20)',
  red: '#EF4444',
  redDim: 'rgba(239,68,68,0.07)',
  redBdr: 'rgba(239,68,68,0.20)',
  amber: '#F59E0B',
  amberDim: 'rgba(245,158,11,0.08)',
  amberBdr: 'rgba(245,158,11,0.20)',
  blue: '#3B82F6',
  blueDim: 'rgba(59,130,246,0.08)',
  blueBdr: 'rgba(59,130,246,0.20)',
  side: '#0F172A',
  sideBdr: 'rgba(255,255,255,0.06)',
  sideText: 'rgba(248,250,252,0.55)',
  sideActive: 'rgba(255,255,255,0.06)',
  shadow: '0 1px 2px rgba(0,0,0,0.04), 0 1px 6px rgba(0,0,0,0.03)',
  shadowMd: '0 4px 12px rgba(0,0,0,0.07)',
}

const FONT = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif`

// ─── ícones ──────────────────────────────────────────────────────────────────
const IcHome = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const IcList = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
const IcCard = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
const IcFlag = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
const IcBulb = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
const IcSettings = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
const IcPlus = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
const IcLogout = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
const IcTrash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>
const IcSearch = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
const IcChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
const IcUp = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 15 12 8 19 15" /></svg>
const IcDown = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="19 9 12 16 5 9" /></svg>
const IcTrend = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>

// ─── tipos ───────────────────────────────────────────────────────────────────
type Page = 'inicio' | 'historico' | 'dividas' | 'cartoes' | 'metas' | 'config'
const NAV: { id: Page; label: string; icon: () => JSX.Element }[] = [
  { id: 'inicio', label: 'Dashboard', icon: IcHome },
  { id: 'historico', label: 'Histórico', icon: IcList },
  { id: 'dividas', label: 'Dívidas', icon: IcCard },
  { id: 'metas', label: 'Metas', icon: IcFlag },
  { id: 'cartoes', label: 'Cartões', icon: IcBulb },
  { id: 'config', label: 'Config', icon: IcSettings },
]

const inputBase: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: '9px',
  background: C.surface, border: `1px solid ${C.border}`,
  color: C.text, fontSize: '14px', outline: 'none',
  boxSizing: 'border-box', fontFamily: FONT, fontWeight: 500,
  transition: 'border-color .15s, box-shadow .15s',
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const Sidebar = ({ page, setPage, user, onLogout }: {
  page: Page
  setPage: (p: Page) => void
  user: { name?: string; email?: string; avatar?: string } | null
  onLogout: () => void
}) => {
  const [expanded, setExpanded] = useState(false)
  const W = expanded ? 216 : 60

  return (
    <aside style={{
      width: `${W}px`, minWidth: `${W}px`, flexShrink: 0,
      background: C.side, borderRight: `1px solid ${C.sideBdr}`,
      display: 'flex', flexDirection: 'column',
      transition: 'width .2s cubic-bezier(.4,0,.2,1), min-width .2s cubic-bezier(.4,0,.2,1)',
      overflow: 'hidden', position: 'relative', zIndex: 10,
    }}>
      <div style={{
        padding: expanded ? '20px 16px 16px' : '20px 0 16px',
        display: 'flex', alignItems: 'center',
        justifyContent: expanded ? 'space-between' : 'center',
        borderBottom: `1px solid ${C.sideBdr}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div style={{
            width: '30px', height: '30px', borderRadius: '8px', flexShrink: 0,
            background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '15px', fontWeight: 700, color: C.primaryText, fontFamily: FONT,
          }}>Ζ</div>
          {expanded && (
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC', letterSpacing: '-.3px', whiteSpace: 'nowrap', fontFamily: FONT }}>ZetaFin</span>
          )}
        </div>
        {expanded && (
          <button onClick={() => setExpanded(false)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(248,250,252,0.3)', padding: '4px', borderRadius: '5px',
            display: 'flex', transition: 'color .15s', flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(248,250,252,0.3)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
        )}
      </div>

      <div style={{ flex: 1, padding: expanded ? '12px 10px' : '12px 6px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {NAV.map(({ id, label, icon: Ic }) => {
          const active = page === id
          return (
            <button key={id} onClick={() => setPage(id)} title={!expanded ? label : undefined} style={{
              display: 'flex', alignItems: 'center',
              gap: expanded ? '10px' : '0',
              justifyContent: expanded ? 'flex-start' : 'center',
              padding: expanded ? '9px 12px' : '10px 0',
              borderRadius: '8px', width: '100%',
              border: 'none',
              borderLeft: active ? `3px solid ${C.primary}` : '3px solid transparent',
              background: active ? C.sideActive : 'transparent',
              color: active ? '#F8FAFC' : C.sideText,
              cursor: 'pointer', transition: 'all .15s',
              fontSize: '13px', fontWeight: active ? 600 : 500, fontFamily: FONT,
              paddingLeft: expanded ? (active ? '9px' : '12px') : undefined,
            }}
              onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; (e.currentTarget as HTMLElement).style.color = 'rgba(248,250,252,0.85)' } }}
              onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = C.sideText } }}
            >
              <span style={{ flexShrink: 0 }}><Ic /></span>
              {expanded && <span style={{ whiteSpace: 'nowrap' }}>{label}</span>}
            </button>
          )
        })}
        {!expanded && (
          <button onClick={() => setExpanded(true)} title="Expandir menu" style={{
            marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '9px 0', borderRadius: '8px', width: '100%',
            border: '1px solid rgba(255,255,255,0.07)', background: 'transparent',
            color: 'rgba(248,250,252,0.25)', cursor: 'pointer', transition: 'all .15s', fontFamily: FONT,
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(248,250,252,0.6)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(248,250,252,0.25)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <IcChevron />
          </button>
        )}
      </div>

      <div style={{ padding: expanded ? '12px 10px' : '12px 6px', borderTop: `1px solid ${C.sideBdr}` }}>
        <button onClick={onLogout} title={!expanded ? 'Sair' : undefined} style={{
          display: 'flex', alignItems: 'center',
          gap: expanded ? '10px' : '0', justifyContent: expanded ? 'flex-start' : 'center',
          padding: expanded ? '9px 12px' : '9px 0',
          width: '100%', borderRadius: '8px',
          border: 'none', background: 'transparent',
          color: 'rgba(248,113,113,0.45)', cursor: 'pointer', transition: 'all .15s',
          fontSize: '12px', fontWeight: 500, fontFamily: FONT,
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; (e.currentTarget as HTMLElement).style.color = '#F87171' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(248,113,113,0.45)' }}
        >
          <IcLogout />
          {expanded && <span>Sair</span>}
        </button>
        {expanded && user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px 2px' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: C.primaryText }}>
              {user.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#E2E8F0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

// ─── DONUT CHART ─────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  'Alimentação': '#22C55E', 'Transporte': '#3B82F6', 'Moradia': '#8B5CF6',
  'Saúde': '#06B6D4', 'Lazer': '#EC4899', 'Assinaturas': '#F59E0B',
  'Educação': '#F97316', 'Geral': '#94A3B8',
}

const DonutChart = ({ transactions }: { transactions: Transaction[] }) => {
  const [hovered, setHovered] = useState<string | null>(null)
  const despesas = transactions.filter(t => t.tipo === 'despesa')
  const byCategory: Record<string, number> = {}
  despesas.forEach(t => { byCategory[t.categoria] = (byCategory[t.categoria] || 0) + t.valor })
  const total = Object.values(byCategory).reduce((a, b) => a + b, 0)
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1])

  if (total === 0) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '180px', color: C.muted, fontSize: '13px' }}>Sem despesas registradas</div>
  }

  const cx = 80, cy = 80, R = 68, r = 46
  let cumulAngle = -Math.PI / 2
  const arcs = entries.map(([cat, val]) => {
    const pct = val / total
    const angle = pct * 2 * Math.PI
    const x1 = cx + R * Math.cos(cumulAngle), y1 = cy + R * Math.sin(cumulAngle)
    const x2 = cx + R * Math.cos(cumulAngle + angle), y2 = cy + R * Math.sin(cumulAngle + angle)
    const ix1 = cx + r * Math.cos(cumulAngle), iy1 = cy + r * Math.sin(cumulAngle)
    const ix2 = cx + r * Math.cos(cumulAngle + angle), iy2 = cy + r * Math.sin(cumulAngle + angle)
    const large = angle > Math.PI ? 1 : 0
    const d = [`M ${x1} ${y1}`, `A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`, `L ${ix2} ${iy2}`, `A ${r} ${r} 0 ${large} 0 ${ix1} ${iy1}`, 'Z'].join(' ')
    const color = CATEGORY_COLORS[cat] || '#94A3B8'
    cumulAngle += angle
    return { cat, val, pct, d, color }
  })
  const hov = hovered ? entries.find(e => e[0] === hovered) : null

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {arcs.map(({ cat, d, color }) => {
            const isHov = hovered === cat
            return (
              <path key={cat} d={d} fill={color} opacity={hovered && !isHov ? 0.3 : 0.85}
                style={{ cursor: 'pointer', transition: 'opacity .2s, transform .15s', transformOrigin: '80px 80px', transform: isHov ? 'scale(1.03)' : 'scale(1)' }}
                onMouseEnter={() => setHovered(cat)} onMouseLeave={() => setHovered(null)} />
            )
          })}
          <circle cx="80" cy="80" r="40" fill={C.surface} />
          {hov ? (
            <>
              <text x="80" y="74" textAnchor="middle" fontSize="9.5" fill={C.muted} fontFamily={FONT}>{hov[0]}</text>
              <text x="80" y="89" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.text} fontFamily={FONT}>{(hov[1] / total * 100).toFixed(0)}%</text>
            </>
          ) : (
            <>
              <text x="80" y="77" textAnchor="middle" fontSize="9" fill={C.muted} fontFamily={FONT}>Despesas</text>
              <text x="80" y="90" textAnchor="middle" fontSize="11" fontWeight="700" fill={C.text} fontFamily={FONT}>R$ {(total / 1000).toFixed(1)}k</text>
            </>
          )}
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: '130px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {arcs.slice(0, 6).map(({ cat, val, pct, color }) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'default', opacity: hovered && hovered !== cat ? 0.35 : 1, transition: 'opacity .2s' }}
            onMouseEnter={() => setHovered(cat)} onMouseLeave={() => setHovered(null)}>
            <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '11px', color: C.muted, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: C.muted, whiteSpace: 'nowrap' }}>{(pct * 100).toFixed(0)}%</div>
            <div style={{ fontSize: '11px', color: C.muted2, whiteSpace: 'nowrap' }}>{brl(val)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────
const BarChart = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai']
  const des = [2100, 2800, 2400, 3100, 3350]
  const ent = [4500, 4500, 4200, 4800, 5200]
  const max = Math.max(...ent)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '100%', paddingBottom: '22px' }}>
      {months.map((m, i) => (
        <div key={m} style={{ flex: 1, display: 'flex', gap: '4px', alignItems: 'flex-end', position: 'relative' }}>
          <div title={`Despesas: ${brl(des[i])}`} style={{ flex: 1, height: `${Math.round((des[i] / max) * 110)}px`, background: 'rgba(239,68,68,0.55)', borderRadius: '6px 6px 0 0', transition: 'opacity .2s', cursor: 'default' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')} />
          <div title={`Entradas: ${brl(ent[i])}`} style={{ flex: 1, height: `${Math.round((ent[i] / max) * 110)}px`, background: 'rgba(34,197,94,0.65)', borderRadius: '6px 6px 0 0', transition: 'opacity .2s', cursor: 'default' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.65')} />
          <span style={{ position: 'absolute', bottom: '-20px', left: 0, right: 0, textAlign: 'center', fontSize: '9px', color: C.muted2, fontFamily: FONT }}>{m}</span>
        </div>
      ))}
    </div>
  )
}

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, valueSub, color, sub, accentBar }: {
  label: string; value: string; valueSub?: string; color: string; sub?: string; accentBar: string
}) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '18px 20px', position: 'relative', overflow: 'hidden', boxShadow: C.shadow, transition: 'box-shadow .2s, transform .2s' }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = C.shadowMd; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = C.shadow; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: accentBar, opacity: 0.7 }} />
    <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px', fontFamily: FONT }}>{label}</div>
    <div style={{ fontSize: '22px', fontWeight: 700, color, letterSpacing: '-.3px', lineHeight: 1, marginBottom: '5px', fontFamily: FONT }}>
      {value}
      {valueSub && <span style={{ fontSize: '11px', fontWeight: 500, color: C.green, marginLeft: '6px', verticalAlign: 'middle' }}><IcTrend /> {valueSub}</span>}
    </div>
    {sub && <div style={{ fontSize: '11px', color: C.muted2, fontFamily: FONT }}>{sub}</div>}
  </div>
)

// ─── TX ROW ──────────────────────────────────────────────────────────────────
const TxRow = ({ tx, onDelete }: { tx: Transaction; onDelete?: (id: string) => void }) => {
  const isE = tx.tipo === 'entrada'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 8px', borderBottom: `1px solid ${C.border}`, transition: 'background .15s', borderRadius: '6px', margin: '0 -8px' }}
      onMouseEnter={e => (e.currentTarget.style.background = C.surf2)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: isE ? C.greenDim : C.redDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: isE ? C.green : C.red }}>
        {isE ? <IcUp /> : <IcDown />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: FONT }}>{tx.descricao}</div>
        <div style={{ fontSize: '11px', color: C.muted2, marginTop: '1px', fontFamily: FONT }}>{tx.categoria} · {tx.data}</div>
      </div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: isE ? C.green : C.red, flexShrink: 0, fontFamily: FONT, letterSpacing: '-.2px' }}>
        {isE ? '+' : '−'}{brl(tx.valor)}
      </div>
      {onDelete && (
        <button onClick={() => onDelete(tx.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted2, display: 'flex', padding: '4px', borderRadius: '5px', transition: 'all .15s', flexShrink: 0 }}
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
    try {
      await onSave({ tipo, descricao: desc.trim(), categoria: cat, valor: Number(valor), data: '' })
      setDesc(''); setValor(''); onClose()
    } finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.14)', animation: 'fadeUp .18s ease', fontFamily: FONT }}>
        <div style={{ fontSize: '15px', fontWeight: 700, color: C.text, marginBottom: '18px', letterSpacing: '-.2px' }}>Nova transação</div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', background: C.bg, borderRadius: '9px', padding: '3px' }}>
          {(['despesa', 'entrada'] as const).map(t => (
            <button key={t} onClick={() => { setTipo(t); setCat(t === 'despesa' ? CATS_D[0] : CATS_E[0]) }} style={{
              flex: 1, padding: '9px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all .15s', fontFamily: FONT,
              background: tipo === t ? C.surface : 'transparent',
              color: tipo === t ? (t === 'despesa' ? C.red : C.green) : C.muted,
              border: tipo === t ? `1px solid ${C.border}` : '1px solid transparent',
              boxShadow: tipo === t ? C.shadow : 'none',
            }}>{t === 'despesa' ? '↓ Despesa' : '↑ Entrada'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: FONT }}>Descrição</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Mercado, Salário..." style={inputBase}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.primary; (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px rgba(127,229,168,0.12)` }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = C.border; (e.target as HTMLInputElement).style.boxShadow = 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: FONT }}>Valor (R$)</label>
              <input type="number" min="0" step="0.01" value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00" style={inputBase}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.primary; (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px rgba(127,229,168,0.12)` }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = C.border; (e.target as HTMLInputElement).style.boxShadow = 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: FONT }}>Categoria</label>
              <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inputBase, appearance: 'none' } as React.CSSProperties}
                onFocus={e => { (e.target as HTMLSelectElement).style.borderColor = C.primary; (e.target as HTMLSelectElement).style.boxShadow = `0 0 0 3px rgba(127,229,168,0.12)` }}
                onBlur={e => { (e.target as HTMLSelectElement).style.borderColor = C.border; (e.target as HTMLSelectElement).style.boxShadow = 'none' }}>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: '9px', border: `1px solid ${C.border}`, background: 'none', color: C.muted, fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: FONT, transition: 'all .15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >Cancelar</button>
          <button onClick={save} disabled={saving || !desc || Number(valor) <= 0} style={{
            flex: 1, padding: '11px', borderRadius: '9px', border: 'none',
            background: saving || !desc || Number(valor) <= 0 ? 'rgba(127,229,168,0.35)' : C.primary,
            color: C.primaryText, fontSize: '13px', fontWeight: 700,
            cursor: saving || !desc || Number(valor) <= 0 ? 'not-allowed' : 'pointer',
            fontFamily: FONT, transition: 'all .15s',
          }}>{saving ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE INICIO ─────────────────────────────────────────────────────────────
const PageInicio = ({ finance, onAddTx, onGoPage }: {
  finance: ReturnType<typeof useFinance>; onAddTx: () => void; onGoPage: (p: Page) => void
}) => {
  const savingsGoals: Goal[] = [
    {
      id: '1',
      title: 'Reserva de emergência',
      description: 'Meu fundo para imprevistos',
      targetAmount: 5000,
      currentAmount: 1200,
      type: 'investment',
      yieldRate: 0.115,
      monthlyContribution: 200,
      createdAt: new Date().toISOString(),
    },
  ]

  return (
    <div>
      {/* Caixinhas de investimento */}
      <div style={{ marginBottom: '20px' }}>
        {savingsGoals.map(goal => (
          <SavingsBox key={goal.id} goal={goal} />
        ))}
      </div>

      {/* metric cards */}
      <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginBottom: '18px' }}>
        {finance.loading
          ? [1, 2, 3, 4].map(k => <div key={k} style={{ height: '88px', background: C.surf2, borderRadius: '12px', animation: 'pulse 1.5s ease-in-out infinite' }} />)
          : <>
            <MetricCard label="Saldo do mês" value={brl(finance.summary?.saldo ?? 0)} color={C.text} accentBar={C.borderMid} sub="entradas − despesas" />
            <MetricCard label="Entradas" value={brl(finance.summary?.entradas ?? 0)} valueSub="+5.2%" color={C.green} accentBar={C.green} sub="mês atual" />
            <MetricCard label="Despesas" value={brl(finance.summary?.despesas ?? 0)} color={C.red} accentBar={C.red} sub="+8% vs anterior" />
            <MetricCard label="Limite diário" value={brl(finance.summary?.limiteDiario ?? 0)} color={C.blue} accentBar={C.blue} sub="Baseado no seu salário" />
          </>
        }
      </div>

      {/* charts row */}
      <div className="row2-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '18px 20px', boxShadow: C.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: C.text, fontFamily: FONT, letterSpacing: '-.2px' }}>Entradas vs Despesas</span>
            <div style={{ display: 'flex', gap: '12px' }}>
              {([[C.red, 'Despesas'], [C.green, 'Entradas']] as [string, string][]).map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: C.muted, fontWeight: 500, fontFamily: FONT }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '2px', background: c }} />{l}
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '148px' }}><BarChart /></div>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '18px 20px', boxShadow: C.shadow }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: C.text, marginBottom: '14px', fontFamily: FONT, letterSpacing: '-.2px' }}>Gastos por categoria</div>
          <DonutChart transactions={finance.transactions} />
        </div>
      </div>

      {/* bottom row */}
      <div className="row3-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '14px' }}>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '18px 20px', boxShadow: C.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: C.text, fontFamily: FONT, letterSpacing: '-.2px' }}>Últimas transações</span>
            <div style={{ display: 'flex', gap: '7px' }}>
              <button onClick={onAddTx} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 13px', borderRadius: '8px', border: 'none', background: C.primary, color: C.primaryText, fontSize: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all .15s', fontFamily: FONT }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.primaryHov }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.primary }}
              ><IcPlus /> Nova</button>
              <button onClick={() => onGoPage('historico')} style={{ padding: '7px 13px', borderRadius: '8px', border: `1px solid ${C.border}`, background: 'none', color: C.muted, fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all .15s', fontFamily: FONT }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.borderMid; (e.currentTarget as HTMLElement).style.color = C.text }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.color = C.muted }}
              >Ver tudo</button>
            </div>
          </div>
          {finance.transactions.slice(0, 6).map(tx => <TxRow key={tx.id} tx={tx} />)}
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '18px 20px', boxShadow: C.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: C.text, fontFamily: FONT, letterSpacing: '-.2px' }}>Dívidas ativas</span>
            <button onClick={() => onGoPage('dividas')} style={{ fontSize: '11px', padding: '4px 9px', borderRadius: '6px', border: `1px solid ${C.border}`, background: 'none', color: C.muted, cursor: 'pointer', fontWeight: 600, transition: 'all .15s', fontFamily: FONT }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = C.text; (e.currentTarget as HTMLElement).style.borderColor = C.borderMid }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.muted; (e.currentTarget as HTMLElement).style.borderColor = C.border }}
            >Ver todas</button>
          </div>
          {finance.debts.slice(0, 3).map(d => {
            const pct = Math.min((d.pago / d.total) * 100, 100)
            const clr = pct >= 100 ? C.green : pct > 60 ? C.amber : C.red
            return (
              <div key={d.id} style={{ marginBottom: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: C.text, fontFamily: FONT }}>{d.nome}</span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: clr, fontFamily: FONT }}>{pct.toFixed(0)}%</span>
                </div>
                <div style={{ background: C.bg, borderRadius: '3px', height: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '3px', background: clr, width: `${pct.toFixed(1)}%`, transition: 'width .4s' }} />
                </div>
              </div>
            )
          })}
          {finance.debts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: C.muted, fontSize: '12px', fontFamily: FONT }}>Sem dívidas 🎉</div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── PAGE HISTORICO ───────────────────────────────────────────────────────────
const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const PageHistorico = ({ finance }: { finance: ReturnType<typeof useFinance> }) => {
  // ← FIX: estado declarado DENTRO do componente
  const now = new Date()
  const [selMonth, setSelMonth] = useState(now.getMonth())
  const [selYear] = useState(now.getFullYear())
  const [filter, setFilter] = useState<'all' | 'entrada' | 'despesa'>('all')
  const [busca, setBusca] = useState('')

  const filtered = finance.transactions.filter(t =>
    (filter === 'all' || t.tipo === filter) &&
    (!busca || t.descricao.toLowerCase().includes(busca.toLowerCase()) || t.categoria.toLowerCase().includes(busca.toLowerCase()))
  )
  const totalEntradas = filtered.filter(t => t.tipo === 'entrada').reduce((a, t) => a + t.valor, 0)
  const totalDespesas = filtered.filter(t => t.tipo === 'despesa').reduce((a, t) => a + t.valor, 0)

  return (
    <div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '14px 18px', marginBottom: '14px', boxShadow: C.shadow }}>
        <div style={{ fontSize: '11px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px', fontFamily: FONT }}>
          Período — {selYear}
        </div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {MONTHS.map((m, i) => {
            const active = i === selMonth
            const future = i > now.getMonth()
            return (
              <button key={m} onClick={() => !future && setSelMonth(i)} disabled={future} style={{
                padding: '6px 13px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                cursor: future ? 'not-allowed' : 'pointer', transition: 'all .15s', fontFamily: FONT,
                background: active ? C.primary : 'transparent',
                color: future ? C.muted2 : active ? C.primaryText : C.muted,
                border: `1px solid ${active ? C.primary : C.border}`,
                opacity: future ? 0.4 : 1,
              }}>{m}</button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {[
          { label: 'Entradas', val: totalEntradas, color: C.green, bg: C.greenDim, bd: C.greenBdr },
          { label: 'Despesas', val: totalDespesas, color: C.red, bg: C.redDim, bd: C.redBdr },
          { label: 'Saldo', val: totalEntradas - totalDespesas, color: C.text, bg: C.surf2, bd: C.border },
        ].map(({ label, val, color, bg, bd }) => (
          <div key={label} style={{ padding: '9px 16px', borderRadius: '9px', background: bg, border: `1px solid ${bd}`, display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: FONT }}>{label}</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color, fontFamily: FONT, letterSpacing: '-.2px' }}>{brl(Math.abs(val))}</span>
          </div>
        ))}
      </div>

      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '18px 20px', boxShadow: C.shadow }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: C.text, fontFamily: FONT, letterSpacing: '-.2px' }}>
            {MONTHS[selMonth]} {selYear} · {filtered.length} transações
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['all', 'entrada', 'despesa'] as const).map(f => {
              const labels = { all: 'Todos', entrada: 'Entradas', despesa: 'Despesas' }
              const active = filter === f
              const ac = f === 'despesa' ? C.red : f === 'entrada' ? C.green : C.text
              return (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '5px 11px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all .15s', fontFamily: FONT,
                  background: active ? `${ac}10` : 'none',
                  color: active ? ac : C.muted,
                  border: `1px solid ${active ? `${ac}30` : C.border}`,
                }}>{labels[f]}</button>
              )
            })}
          </div>
        </div>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: C.muted2 }}><IcSearch /></span>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar transação ou categoria..." style={{ ...inputBase, paddingLeft: '38px' }}
            onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.primary; (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px rgba(127,229,168,0.12)` }}
            onBlur={e => { (e.target as HTMLInputElement).style.borderColor = C.border; (e.target as HTMLInputElement).style.boxShadow = 'none' }} />
        </div>
        {finance.loading
          ? [1, 2, 3, 4, 5].map(k => <div key={k} style={{ height: '50px', background: C.surf2, borderRadius: '8px', marginBottom: '5px', animation: 'pulse 1.5s ease-in-out infinite' }} />)
          : filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: '36px', color: C.muted, fontSize: '13px', fontFamily: FONT }}>Nenhuma transação encontrada</div>
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '14px', alignItems: 'start' }}>
      <div>
        {finance.loading
          ? [1, 2].map(k => <div key={k} style={{ height: '130px', background: C.surf2, borderRadius: '12px', marginBottom: '10px', animation: 'pulse 1.5s ease-in-out infinite' }} />)
          : finance.debts.length === 0
            ? <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '40px', textAlign: 'center', color: C.muted, fontSize: '13px', fontFamily: FONT }}>Nenhuma dívida cadastrada</div>
            : finance.debts.map(d => {
              const pct = Math.min((d.pago / d.total) * 100, 100)
              const rest = Math.max(d.total - d.pago, 0)
              const quitada = rest <= 0
              const clr = quitada ? C.green : pct > 60 ? C.amber : C.red
              return (
                <div key={d.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 18px', marginBottom: '10px', boxShadow: C.shadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, fontFamily: FONT, letterSpacing: '-.2px' }}>
                        {d.nome}{' '}
                        {quitada && <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 7px', borderRadius: '20px', background: C.greenDim, color: C.green, border: `1px solid ${C.greenBdr}`, fontFamily: FONT }}>Quitada</span>}
                      </div>
                      {d.descricao && <div style={{ fontSize: '12px', color: C.muted, marginTop: '2px', fontFamily: FONT }}>{d.descricao}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: `${clr}10`, color: clr, border: `1px solid ${clr}25`, fontFamily: FONT }}>{pct.toFixed(0)}%</span>
                      <button onClick={() => finance.deleteDebt(d.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted2, display: 'flex', padding: '4px', borderRadius: '5px', transition: 'all .15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = C.red)} onMouseLeave={e => (e.currentTarget.style.color = C.muted2)}><IcTrash /></button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: C.muted, marginBottom: '7px', fontFamily: FONT }}>
                    <span>Pago: <strong style={{ color: C.green }}>{brl(d.pago)}</strong></span>
                    <span>Resta: <strong style={{ color: C.amber }}>{brl(rest)}</strong></span>
                    <span>Total: <strong style={{ color: C.text }}>{brl(d.total)}</strong></span>
                  </div>
                  <div style={{ background: C.bg, borderRadius: '3px', height: '5px', overflow: 'hidden', marginBottom: '8px' }}>
                    <div style={{ height: '100%', borderRadius: '3px', background: clr, width: `${pct.toFixed(1)}%`, transition: 'width .4s' }} />
                  </div>
                  {!quitada && (
                    <div style={{ display: 'flex', gap: '7px', marginTop: '10px' }}>
                      <input type="number" min="0" step="0.01" placeholder="Valor do pagamento" value={pags[d.id] || ''} onChange={e => setPags(p => ({ ...p, [d.id]: e.target.value }))} style={{ ...inputBase, flex: 1 }}
                        onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.amber; (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px rgba(245,158,11,0.10)` }}
                        onBlur={e => { (e.target as HTMLInputElement).style.borderColor = C.border; (e.target as HTMLInputElement).style.boxShadow = 'none' }} />
                      <button onClick={() => pay(d.id)} style={{ padding: '10px 14px', borderRadius: '8px', border: 'none', background: C.amber, color: '#1a0f00', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>Pagar</button>
                    </div>
                  )}
                </div>
              )
            })
        }
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px 18px', position: 'sticky', top: '70px', boxShadow: C.shadow }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: C.text, marginBottom: '12px', fontFamily: FONT, letterSpacing: '-.2px' }}>Nova dívida</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {([
            ['Nome', 'text', nome, setNome, 'Ex: Banco, Cartão'],
            ['Valor total (R$)', 'number', total, setTotal, '0,00'],
            ['Descrição', 'text', desc, setDesc, 'Opcional'],
          ] as [string, string, string, (v: string) => void, string][]).map(([label, type, val, set, ph]) => (
            <div key={label}>
              <label style={{ fontSize: '11px', color: C.muted, fontWeight: 600, marginBottom: '4px', display: 'block', textTransform: 'uppercase', letterSpacing: '.05em', fontFamily: FONT }}>{label}</label>
              <input type={type} value={val} onChange={e => set(e.target.value)} placeholder={ph} style={inputBase}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = C.amber; (e.target as HTMLInputElement).style.boxShadow = `0 0 0 3px rgba(245,158,11,0.10)` }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = C.border; (e.target as HTMLInputElement).style.boxShadow = 'none' }} />
            </div>
          ))}
          <button onClick={addDivida} disabled={saving || !nome || Number(total) <= 0} style={{
            width: '100%', padding: '11px', borderRadius: '9px', border: 'none',
            background: saving || !nome || Number(total) <= 0 ? C.amberDim : C.amber,
            color: '#1a0f00', fontSize: '13px', fontWeight: 700,
            cursor: saving || !nome || Number(total) <= 0 ? 'not-allowed' : 'pointer',
            marginTop: '2px', fontFamily: FONT, transition: 'all .15s',
          }}>{saving ? 'Salvando...' : 'Adicionar dívida'}</button>
        </div>
      </div>
    </div>
  )
}

const cardStat: React.CSSProperties = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '14px' }
const statTitle: React.CSSProperties = { fontSize: '11px', color: C.muted, marginBottom: '6px' }
const statValue: React.CSSProperties = { fontSize: '20px', fontWeight: 700 }
const statSub: React.CSSProperties = { fontSize: '12px', color: C.muted }

// ─── PAGE METAS ───────────────────────────────────────────────────────────────
const PageMetas = () => {
  const goals = [
    { id: 1, title: 'Viagem para Paris', atual: 8500, meta: 15000, prazo: '31/12/2025', cor: '#8B5CF6' },
    { id: 2, title: 'Notebook Novo', atual: 2800, meta: 5000, prazo: '15/08/2025', cor: C.blue },
    { id: 3, title: 'Reserva de emergência', atual: 12000, meta: 20000, prazo: '30/06/2026', cor: C.green },
  ]
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: C.text, fontFamily: FONT }}>{goals.length} metas ativas</div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 13px', borderRadius: '8px', border: 'none', background: C.primary, color: C.primaryText, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: FONT }}>
          <IcPlus /> Nova meta
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
        {goals.map(g => {
          const pct = Math.min((g.atual / g.meta) * 100, 100)
          return (
            <div key={g.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '18px 20px', boxShadow: C.shadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, fontFamily: FONT, letterSpacing: '-.2px' }}>{g.title}</div>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: `${g.cor}12`, color: g.cor, border: `1px solid ${g.cor}25`, fontFamily: FONT }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{ background: C.bg, borderRadius: '5px', height: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                <div style={{ height: '100%', borderRadius: '5px', background: g.cor, width: `${pct.toFixed(1)}%`, transition: 'width .4s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: C.muted, marginBottom: '6px', fontFamily: FONT }}>
                <span>Atual: <strong style={{ color: g.cor }}>{brl(g.atual)}</strong></span>
                <span>Meta: <strong style={{ color: C.text }}>{brl(g.meta)}</strong></span>
              </div>
              <div style={{ fontSize: '11px', color: C.muted2, fontFamily: FONT }}>Prazo: {g.prazo}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── PAGE CONFIG ──────────────────────────────────────────────────────────────
const PageConfig = ({ finance }: { finance: ReturnType<typeof useFinance> }) => {
  const [name, setName] = useState('Lucas Gabriel')
  const [email] = useState('lucas@email.com')
  const [photo, setPhoto] = useState<string | null>(null)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px', maxWidth: '1000px' }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '18px', boxShadow: C.shadow }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto', background: photo ? `url(${photo}) center/cover` : C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.primaryText, fontSize: '22px', fontWeight: 700 }}>
              {!photo && name.charAt(0)}
            </div>
            <input type="file" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              onChange={(e) => { const file = e.target.files?.[0]; if (file) setPhoto(URL.createObjectURL(file)) }} />
          </div>
          <input value={name} onChange={e => setName(e.target.value)} style={{ ...inputBase, textAlign: 'center', marginBottom: '6px' }} />
          <div style={{ fontSize: '12px', color: C.muted }}>{email}</div>
          <button style={{ marginTop: '12px', width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: C.primary, color: C.primaryText, fontWeight: 600, cursor: 'pointer' }}>
            Editar Perfil
          </button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
        <div style={cardStat}><div style={statTitle}>Plano Atual</div><div style={statValue}>Pro</div><div style={statSub}>Ativo há 32 dias</div></div>
        <div style={cardStat}><div style={statTitle}>Limite mensal</div><div style={statValue}>R$ 5.200</div><div style={statSub}>Baseado no salário</div></div>
        <div style={cardStat}><div style={statTitle}>Economia</div><div style={statValue}>18%</div><div style={statSub}>+2.3% esse mês</div></div>
        <div style={{ ...cardStat, gridColumn: 'span 3', height: '140px' }}>
          <div style={statTitle}>Gastos Mensais</div>
          <div style={{ marginTop: '10px', height: '60px', display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
            {[40, 60, 30, 80, 55, 70].map((h, i) => (
              <div key={i} style={{ width: '10px', height: `${h}%`, background: C.primary, borderRadius: '4px', opacity: 0.8 }} />
            ))}
          </div>
        </div>
        <div style={{ ...cardStat, gridColumn: 'span 3' }}><div style={statTitle}>Salário mensal</div><div style={statValue}>R$ 5.200</div></div>
        <div style={{ ...cardStat, gridColumn: 'span 3' }}>
          <div style={statTitle}>Sobre</div>
          <div style={statSub}>Controle financeiro pessoal. Desenvolvido em teste por <b>Lucas Gabriel Likes</b>.</div>
        </div>
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
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }
  const handleSaveTx = useCallback(async (tx: Omit<Transaction, 'id'>) => {
    await finance.addTransaction(tx)
  }, [finance])

  const PAGE_TITLES: Record<Page, string> = {
    inicio: 'Dashboard', historico: 'Histórico',
    dividas: 'Dívidas', metas: 'Metas', cartoes: 'Cartões', config: 'Configurações',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; }
        @keyframes pulse  { 0%,100%{opacity:.5} 50%{opacity:.8} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        .page-anim { animation: fadeUp .2s ease both; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.borderMid}; border-radius: 4px; }
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

      <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: FONT, color: C.text, fontSize: '14px' }}>
        <div className="sidebar-wrap" style={{ display: 'flex', flexShrink: 0 }}>
          <Sidebar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <nav style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: '54px', padding: '0 24px',
            background: C.surface, borderBottom: `1px solid ${C.border}`,
            position: 'sticky', top: 0, zIndex: 50, flexShrink: 0,
            boxShadow: '0 1px 0 rgba(0,0,0,0.04)', gap: '14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: C.text, letterSpacing: '-.3px', fontFamily: FONT }}>{PAGE_TITLES[page]}</div>
              <div style={{ width: '1px', height: '14px', background: C.border }} />
              <div style={{ fontSize: '12px', color: C.muted, fontFamily: FONT }}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <button onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v) }} style={{
                width: '30px', height: '30px', borderRadius: '8px', background: C.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 700, color: C.primaryText, border: 'none', cursor: 'pointer',
              }}>
                {user?.name?.charAt(0).toUpperCase() ?? '?'}
              </button>
              {menuOpen && (
                <div onClick={(e) => e.stopPropagation()} style={{
                  position: 'absolute', top: '44px', right: 0, width: '220px',
                  background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                  zIndex: 200, overflow: 'hidden', animation: 'fadeUp .15s ease', color: '#e5e7eb',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '20%', background: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>
                        {user?.name}
                        <span style={{ marginLeft: '6px', fontSize: '10px', background: '#34d399', padding: '2px 6px', borderRadius: '6px' }}>PRO</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>{user?.email}</div>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                  {[
                    { label: 'Profile Settings', action: () => setPage('config') },
                    { label: 'Help Center', action: () => {} },
                    { label: 'Light Mode', action: () => {} },
                    { label: 'Upgrade Plan', action: () => {} },
                  ].map((item, i) => (
                    <button key={i} onClick={() => { item.action(); setMenuOpen(false) }} style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: '13px', color: '#e5e7eb', cursor: 'pointer' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >{item.label}</button>
                  ))}
                  <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
                  <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', textAlign: 'left', fontSize: '13px', color: '#f87171', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >Sign Out</button>
                </div>
              )}
            </div>
          </nav>

          <main className="content-main" style={{ flex: 1, overflowY: 'auto', padding: '22px 24px' }}>
            <div key={page} className="page-anim">
              {page === 'inicio' && <PageInicio finance={finance} onAddTx={() => setModal(true)} onGoPage={setPage} />}
              {page === 'historico' && <PageHistorico finance={finance} />}
              {page === 'dividas' && <PageDividas finance={finance} />}
              {page === 'metas' && <PageMetas />}
              {page === 'cartoes' && <InsightsPage />}
              {page === 'config' && <PageConfig finance={finance} />}
            </div>
          </main>
        </div>

        <nav className="bnav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, width: '100%', background: C.surface, borderTop: `1px solid ${C.border}`, zIndex: 100, height: '64px', display: 'flex', justifyContent: 'space-around' }}>
          {NAV.map(({ id, label, icon: Ic }) => (
            <button key={id} onClick={() => setPage(id)} style={{ flex: 1, maxWidth: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', background: 'none', border: 'none', color: page === id ? C.primary : C.muted2, fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>
              <Ic />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <TxModal open={modal} onClose={() => setModal(false)} onSave={handleSaveTx} />
    </>
  )
}

export default DashboardPage