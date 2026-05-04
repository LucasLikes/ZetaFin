import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useFinance } from '../hooks/useFinance'
import type { Transaction } from '../types'
import type { JSX } from 'react/jsx-runtime'

// ─── helpers ────────────────────────────────────────────────────────────────
const brl = (v: number) =>
  'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ─── ícones inline ───────────────────────────────────────────────────────────
const IcHome = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IcList = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const IcCard = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcSettings = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
const IcPlus = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IcLogout = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcAlert = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IcTrash = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
const IcSearch = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcUp = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 15 12 8 19 15"/></svg>
const IcDown = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="19 9 12 16 5 9"/></svg>

// ─── tipos ───────────────────────────────────────────────────────────────────
type Page = 'inicio' | 'historico' | 'dividas' | 'config'
const NAV: { id: Page; label: string; icon: () => JSX.Element }[] = [
  { id: 'inicio',    label: 'Dashboard',  icon: IcHome     },
  { id: 'historico', label: 'Histórico',  icon: IcList     },
  { id: 'dividas',   label: 'Dívidas',    icon: IcCard     },
  { id: 'config',    label: 'Config',     icon: IcSettings },
]
const PAGE_TITLES: Record<Page, string> = { inicio:'Dashboard', historico:'Histórico', dividas:'Dívidas', config:'Configurações' }

// ─── constantes de estilo ────────────────────────────────────────────────────
const C = {
  // Paleta ZetaFin (alinhada com login)
  bg:      '#F8FAFB',           // Fundo principal - cinza claro
  surface: '#FFFFFF',           // Cards e superfícies - branco puro
  surf2:   'rgba(127,229,168,.05)', // Hover states
  border:  '#E5E7EB',           // Bordas - cinza claro
  text:    '#1A1A1A',           // Texto principal - escuro
  muted:   '#757575',           // Texto secundário - cinza médio
  muted2:  '#9CA3AF',           // Texto terciário - cinza claro
  green:   '#7FE5A8',           // Verde principal (login)
  greenDim:'rgba(127,229,168,.08)',
  greenBdr:'rgba(127,229,168,.25)',
  red:     '#F44336',           // Erro/Despesa
  redDim:  'rgba(244,67,54,.08)',
  redBdr:  'rgba(244,67,54,.25)',
  amber:   '#FFA726',           // Aviso
  amberDim:'rgba(255,167,38,.08)',
  amberBdr:'rgba(255,167,38,.25)',
  blue:    '#42A5F5',           // Info
  success: '#4CAF50',           // Sucesso (alternativo)
  shadow:  '0 1px 3px rgba(0,0,0,.06), 0 2px 6px rgba(0,0,0,.04)',
  shadowLg:'0 4px 12px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.06)',
}

const inputBase: React.CSSProperties = {
  width: '100%', padding: '11px 13px', borderRadius: '10px',
  background: C.surface, border: `1.5px solid ${C.border}`,
  color: C.text, fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  fontFamily: 'inherit', fontWeight: 500,
}

// ─── componentes menores ─────────────────────────────────────────────────────

const Skeleton = ({ h = 80 }: { h?: number }) => (
  <div style={{ background: C.surf2, borderRadius: '12px', height: `${h}px`, animation: 'pulse 1.5s ease-in-out infinite' }} />
)

const MetricCard = ({ label, value, color, sub, accent }: { label:string; value:string; color:string; sub?:string; accent:string }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden', boxShadow: C.shadow, transition: 'all .3s ease' }}
    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = C.shadowLg; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)' }}
    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = C.shadow; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}
  >
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: accent }} />
    <div style={{ fontSize: '12px', color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: '10px' }}>{label}</div>
    <div style={{ fontSize: '26px', fontWeight: 800, color, letterSpacing: '-.5px', lineHeight: 1, marginBottom: '8px' }}>{value}</div>
    {sub && <div style={{ fontSize: '12px', color: C.muted, marginTop: '6px' }}>{sub}</div>}
  </div>
)

const TxRow = ({ tx, onDelete }: { tx: Transaction; onDelete?: (id: string) => void }) => {
  const isE = tx.tipo === 'entrada'
  const clr = isE ? C.green : C.red
  const bg  = isE ? C.greenDim : C.redDim
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${C.border}`, transition: 'background .2s' }}
      onMouseEnter={e => (e.currentTarget.style.background = C.surf2)}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: clr }}>
        {isE ? <IcUp /> : <IcDown />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: C.text }}>{tx.descricao}</div>
        <div style={{ fontSize: '12px', color: C.muted, marginTop: '2px' }}>{tx.categoria} · {tx.data}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 800, color: clr }}>{isE ? '+' : '−'}{brl(tx.valor)}</div>
      </div>
      {onDelete && (
        <button onClick={() => onDelete(tx.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.muted, display: 'flex', padding: '6px', borderRadius: '7px', transition: 'all .2s', flexShrink: 0 }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.red; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,67,54,.08)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = C.muted; (e.currentTarget as HTMLButtonElement).style.background = 'none' }}
        ><IcTrash /></button>
      )}
    </div>
  )
}

// ─── modal nova transação ────────────────────────────────────────────────────
const CATS_D = ['Alimentação','Moradia','Transporte','Saúde','Lazer','Assinaturas','Educação','Geral']
const CATS_E = ['Salário','Freelance','Investimento','Bonus','Outro']

const TxModal = ({ open, onClose, onSave }: { open:boolean; onClose:()=>void; onSave:(tx:Omit<Transaction,'id'>)=>Promise<void> }) => {
  const [tipo,   setTipo]   = useState<'despesa'|'entrada'>('despesa')
  const [desc,   setDesc]   = useState('')
  const [valor,  setValor]  = useState('')
  const [cat,    setCat]    = useState(CATS_D[0])
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const cats = tipo === 'despesa' ? CATS_D : CATS_E

  const save = async () => {
    if (!desc.trim() || Number(valor) <= 0) return
    setSaving(true)
    try {
      await onSave({ tipo, descricao: desc.trim(), categoria: cat, valor: Number(valor), data: '' })
      setDesc(''); setValor('')
      onClose()
    } finally { setSaving(false) }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '16px 16px 0 0', width: '100%', maxWidth: '480px', padding: '20px 20px 32px', animation: 'slideUp .22s ease' }}>
        <div style={{ width: '32px', height: '3px', background: C.border, borderRadius: '2px', margin: '0 auto 16px' }} />
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Nova transação</div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {(['despesa','entrada'] as const).map(t => (
            <button key={t} onClick={() => { setTipo(t); setCat(t === 'despesa' ? CATS_D[0] : CATS_E[0]) }} style={{
              flex: 1, padding: '9px', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all .18s',
              background: tipo===t ? (t==='despesa' ? C.redDim : C.greenDim) : C.surf2,
              color:      tipo===t ? (t==='despesa' ? C.red    : C.green)    : C.muted,
              border:     `1px solid ${tipo===t ? (t==='despesa' ? C.redBdr : C.greenBdr) : C.border}`,
            }}>{t === 'despesa' ? '— Despesa' : '+ Entrada'}</button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', color: C.muted, fontWeight: 500, marginBottom: '4px', display: 'block' }}>Descrição</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Ex: Mercado, Salário..." style={inputBase}
              onFocus={e => (e.target.style.borderColor = C.green)} onBlur={e => (e.target.style.borderColor = C.border)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', color: C.muted, fontWeight: 500, marginBottom: '4px', display: 'block' }}>Valor (R$)</label>
              <input type="number" min="0" step="0.01" value={valor} onChange={e => setValor(e.target.value)} placeholder="0,00" style={inputBase}
                onFocus={e => (e.target.style.borderColor = C.green)} onBlur={e => (e.target.style.borderColor = C.border)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: C.muted, fontWeight: 500, marginBottom: '4px', display: 'block' }}>Categoria</label>
              <select value={cat} onChange={e => setCat(e.target.value)} style={{ ...inputBase, appearance: 'none' }}
                onFocus={e => (e.target.style.borderColor = C.green)} onBlur={e => (e.target.style.borderColor = C.border)}>
                {cats.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <button onClick={onClose} style={{ flex:1, padding:'11px', borderRadius:'8px', border:`1px solid ${C.border}`, background:C.surf2, color:C.muted2, fontSize:'13px', fontWeight:600, cursor:'pointer' }}>Cancelar</button>
          <button onClick={save} disabled={saving || !desc || Number(valor) <= 0} style={{ flex:1, padding:'11px', borderRadius:'8px', border:'none', background:saving||!desc||Number(valor)<=0?'rgba(52,211,153,.3)':C.green, color:'#0a1a12', fontSize:'13px', fontWeight:700, cursor:saving||!desc||Number(valor)<=0?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
            {saving ? <><span style={{ width:'13px', height:'13px', border:'2px solid rgba(0,0,0,.25)', borderTopColor:'#0a1a12', borderRadius:'50%', display:'inline-block', animation:'spin .6s linear infinite' }}/> Salvando...</> : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── gráfico de barras ───────────────────────────────────────────────────────
const BarChart = () => {
  const months  = ['Jan','Fev','Mar','Abr','Mai']
  const des = [2100,2800,2400,3100,3350]
  const ent = [4500,4500,4200,4800,5200]
  const max = Math.max(...ent)
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:'8px', height:'100%', paddingBottom:'22px', position:'relative' }}>
      {months.map((m,i) => (
        <div key={m} style={{ flex:1, display:'flex', gap:'3px', alignItems:'flex-end', position:'relative' }}>
          <div title={`Despesas: ${brl(des[i])}`} style={{ flex:1, height:`${Math.round((des[i]/max)*110)}px`, background:'rgba(248,113,113,.7)', borderRadius:'3px 3px 0 0', transition:'opacity .2s', cursor:'default' }} onMouseEnter={e => (e.currentTarget.style.opacity='1')} onMouseLeave={e => (e.currentTarget.style.opacity='.7')} />
          <div title={`Entradas: ${brl(ent[i])}`} style={{ flex:1, height:`${Math.round((ent[i]/max)*110)}px`, background:'rgba(52,211,153,.7)', borderRadius:'3px 3px 0 0', transition:'opacity .2s', cursor:'default' }} onMouseEnter={e => (e.currentTarget.style.opacity='1')} onMouseLeave={e => (e.currentTarget.style.opacity='.7')} />
          <span style={{ position:'absolute', bottom:'-20px', left:0, right:0, textAlign:'center', fontSize:'9px', color:C.muted }}>{m}</span>
        </div>
      ))}
    </div>
  )
}

// ─── páginas ─────────────────────────────────────────────────────────────────

const PageInicio = ({ finance, onAddTx, onGoPage }: { finance: ReturnType<typeof useFinance>; onAddTx:()=>void; onGoPage:(p:Page)=>void }) => (
  <div>
    <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'14px 16px', borderRadius:'11px', marginBottom:'20px', background:'rgba(255,167,38,.08)', border:`1.5px solid rgba(255,167,38,.25)`, fontSize:'13px', color:'#FFA726', fontWeight: 500 }}>
      <IcAlert /> Você está gastando acima do padrão este mês — delivery representa 31% das despesas.
    </div>

    <div className="metrics-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'14px', marginBottom:'20px' }}>
      {finance.loading ? [1,2,3,4].map(k=><Skeleton key={k}/>) : <>
        <MetricCard label="Saldo do mês"  value={brl(finance.summary?.saldo??0)}        color={C.green} accent={C.green} sub="entradas − despesas"/>
        <MetricCard label="Entradas"      value={brl(finance.summary?.entradas??0)}      color={C.green} accent={C.green} sub="mês atual"/>
        <MetricCard label="Despesas"      value={brl(finance.summary?.despesas??0)}      color={C.red}   accent={C.red}   sub="+8% vs anterior"/>
        <MetricCard label="Limite diário" value={brl(finance.summary?.limiteDiario??0)}  color={C.blue}  accent={C.blue}  sub="pode gastar hoje"/>
      </>}
    </div>

    <div className="row2-grid" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'16px', marginBottom:'16px' }}>
      <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:'14px', padding:'20px', boxShadow: C.shadow }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
          <span style={{ fontSize:'15px', fontWeight:700, color: C.text }}>Gastos por mês</span>
          <div style={{ display:'flex', gap:'14px' }}>
            {[[C.red,'Despesas'],[C.green,'Entradas']].map(([c,l])=>(
              <div key={String(l)} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:C.muted, fontWeight: 500 }}>
                <div style={{ width:'8px', height:'8px', borderRadius:'2px', background:String(c) }}/>{l}
              </div>
            ))}
          </div>
        </div>
        <div style={{ height:'140px', position:'relative' }}><BarChart /></div>
      </div>

      <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:'14px', padding:'20px', boxShadow: C.shadow }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
          <span style={{ fontSize:'15px', fontWeight:700, color: C.text }}>Dívidas ativas</span>
          <button onClick={()=>onGoPage('dividas')} style={{ fontSize:'12px', padding:'6px 11px', borderRadius:'7px', border:`1px solid ${C.border}`, background:C.surface, color:C.muted, cursor:'pointer', fontWeight: 600, transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = C.green; (e.currentTarget as HTMLButtonElement).style.borderColor = C.greenBdr;  }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = C.muted; (e.currentTarget as HTMLButtonElement).style.borderColor = C.border }}
          >Ver todas</button>
        </div>
        {finance.debts.slice(0,2).map(d=>{
          const pct=Math.min((d.pago/d.total)*100,100)
          const clr=pct>=100?C.green:pct>60?C.amber:C.red
          return (
            <div key={d.id} style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:'10px', padding:'14px', marginBottom:'10px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <div style={{ fontSize:'13px', fontWeight:700, color: C.text }}>{d.nome}</div>
                <span style={{ fontSize:'11px', fontWeight:700, padding:'3px 9px', borderRadius:'6px', background:`${clr}18`, color:clr, border:`1px solid ${clr}30` }}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{ background:C.border, borderRadius:'5px', height:'6px', overflow:'hidden', marginBottom:'6px' }}>
                <div style={{ height:'100%', borderRadius:'5px', background:clr, width:`${pct.toFixed(1)}%`, transition:'width .5s ease' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'11px', color:C.muted, fontWeight: 500 }}>
                <span>Pago: {brl(d.pago)}</span><span>Resta: {brl(Math.max(d.total-d.pago,0))}</span>
              </div>
            </div>
          )
        })}
        {finance.debts.length===0 && <div style={{ textAlign:'center', padding:'24px 16px', color:C.muted, fontSize:'13px' }}>Nenhuma dívida</div>}
      </div>
    </div>

    <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:'14px', padding:'20px', boxShadow: C.shadow }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
        <span style={{ fontSize:'15px', fontWeight:700, color: C.text }}>Últimas transações</span>
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={onAddTx} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 13px', borderRadius:'9px', border:'none', background:C.green, color:'#1A1A1A', fontSize:'13px', fontWeight:700, cursor:'pointer', transition: 'all .2s', boxShadow: '0 2px 4px rgba(127,229,168,.2)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(127,229,168,.3)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(127,229,168,.2)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
          ><IcPlus/> Nova</button>
          <button onClick={()=>onGoPage('historico')} style={{ padding:'8px 13px', borderRadius:'9px', border:`1.5px solid ${C.border}`, background:C.surface, color:C.muted, fontSize:'13px', fontWeight: 600, cursor:'pointer', transition: 'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.green; (e.currentTarget as HTMLButtonElement).style.color = C.green }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.muted }}
          >Ver tudo</button>
        </div>
      </div>
      {finance.loading
        ? [1,2,3].map(k=><Skeleton key={k} h={50}/>)
        : finance.transactions.slice(0,6).map(tx=><TxRow key={tx.id} tx={tx}/>)
      }
    </div>
  </div>
)

const PageHistorico = ({ finance }: { finance: ReturnType<typeof useFinance> }) => {
  const [filter, setFilter] = useState<'all'|'entrada'|'despesa'>('all')
  const [busca,  setBusca]  = useState('')
  const filtered = finance.transactions.filter(t =>
    (filter==='all'||t.tipo===filter) &&
    (!busca || t.descricao.toLowerCase().includes(busca.toLowerCase()) || t.categoria.toLowerCase().includes(busca.toLowerCase()))
  )
  return (
    <div style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:'14px', padding:'20px', boxShadow: C.shadow }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', flexWrap:'wrap', gap:'10px' }}>
        <span style={{ fontSize:'15px', fontWeight:700, color: C.text }}>Histórico completo</span>
        <div style={{ display:'flex', gap:'6px' }}>
          {(['all','entrada','despesa'] as const).map(f=>{
            const labels={all:'Todos',entrada:'Entradas',despesa:'Despesas'}
            const active=filter===f
            const ac = f==='despesa'?C.red:C.green
            return <button key={f} onClick={()=>setFilter(f)} style={{ padding:'6px 13px', borderRadius:'8px', border:`1.5px solid ${active?ac:C.border}`, fontSize:'12px', fontWeight:700, cursor:'pointer', transition:'all .2s', background:active?`${ac}18`:C.surface, color:active?ac:C.muted }}>{labels[f]}</button>
          })}
        </div>
      </div>
      <div style={{ position:'relative', marginBottom:'14px' }}>
        <span style={{ position:'absolute', left:'13px', top:'50%', transform:'translateY(-50%)', color:C.muted }}><IcSearch/></span>
        <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar por descrição ou categoria..." style={{ ...inputBase, paddingLeft:'40px' }}
          onFocus={e=>(e.target.style.borderColor=C.green)} onBlur={e=>(e.target.style.borderColor=C.border)}/>
      </div>
      {finance.loading
        ? [1,2,3,4,5].map(k=><Skeleton key={k} h={50}/>)
        : filtered.length===0
          ? <div style={{ textAlign:'center', padding:'40px 24px', color:C.muted, fontSize:'14px' }}>Nenhum resultado</div>
          : filtered.map(tx=><TxRow key={tx.id} tx={tx} onDelete={finance.deleteTransaction}/>)
      }
    </div>
  )
}

const PageDividas = ({ finance }: { finance: ReturnType<typeof useFinance> }) => {
  const [nome,  setNome]  = useState('')
  const [total, setTotal] = useState('')
  const [desc,  setDesc]  = useState('')
  const [pags,  setPags]  = useState<Record<string,string>>({})
  const [saving,setSaving]= useState(false)

  const addDivida = async () => {
    if (!nome.trim()||Number(total)<=0) return
    setSaving(true)
    try { await finance.addDebt({ nome:nome.trim(), descricao:desc.trim(), total:Number(total) }); setNome('');setTotal('');setDesc('') }
    finally { setSaving(false) }
  }
  const pay = async (id:string) => {
    const v=Number(pags[id]||0)
    if (v<=0) return
    await finance.payDebt(id,v)
    setPags(p=>({...p,[id]:''}))
  }
  return (
    <div className="dividas-grid" style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'14px', alignItems:'start' }}>
      <div>
        {finance.loading ? [1,2].map(k=><Skeleton key={k} h={130}/>) : finance.debts.length===0
          ? <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'40px', textAlign:'center', color:C.muted, fontSize:'13px' }}>Nenhuma dívida cadastrada</div>
          : finance.debts.map(d=>{
              const pct=Math.min((d.pago/d.total)*100,100)
              const rest=Math.max(d.total-d.pago,0)
              const quitada=rest<=0
              const clr=quitada?C.green:pct>60?C.amber:C.red
              return (
                <div key={d.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'16px', marginBottom:'10px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'10px' }}>
                    <div>
                      <div style={{ fontSize:'14px', fontWeight:700 }}>
                        {d.nome}{' '}
                        {quitada&&<span style={{ fontSize:'10px', fontWeight:600, padding:'2px 7px', borderRadius:'20px', background:C.greenDim, color:C.green, border:`1px solid ${C.greenBdr}` }}>Quitada</span>}
                      </div>
                      {d.descricao&&<div style={{ fontSize:'12px', color:C.muted, marginTop:'2px' }}>{d.descricao}</div>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <span style={{ fontSize:'11px', fontWeight:600, padding:'3px 9px', borderRadius:'20px', background:`${clr}18`, color:clr, border:`1px solid ${clr}30` }}>{pct.toFixed(0)}%</span>
                      <button onClick={()=>finance.deleteDebt(d.id)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, display:'flex', padding:'3px', borderRadius:'5px' }} onMouseEnter={e=>(e.currentTarget.style.color=C.red)} onMouseLeave={e=>(e.currentTarget.style.color=C.muted)}><IcTrash/></button>
                    </div>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px', color:C.muted, marginBottom:'6px' }}>
                    <span>Pago: <strong style={{ color:C.green }}>{brl(d.pago)}</strong></span>
                    <span>Resta: <strong style={{ color:C.amber }}>{brl(rest)}</strong></span>
                    <span>Total: <strong style={{ color:C.text }}>{brl(d.total)}</strong></span>
                  </div>
                  <div style={{ background:C.border, borderRadius:'4px', height:'6px', overflow:'hidden', marginBottom:'6px' }}>
                    <div style={{ height:'100%', borderRadius:'4px', background:clr, width:`${pct.toFixed(1)}%`, transition:'width .5s ease' }}/>
                  </div>
                  {!quitada&&(
                    <div style={{ display:'flex', gap:'8px', marginTop:'12px' }}>
                      <input type="number" min="0" step="0.01" placeholder="Valor do pagamento" value={pags[d.id]||''} onChange={e=>setPags(p=>({...p,[d.id]:e.target.value}))} style={{ ...inputBase, flex:1 }} onFocus={e=>(e.target.style.borderColor=C.amber)} onBlur={e=>(e.target.style.borderColor=C.border)}/>
                      <button onClick={()=>pay(d.id)} style={{ padding:'10px 14px', borderRadius:'8px', border:'none', background:C.amber, color:'#1a0f00', fontSize:'12px', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>Registrar</button>
                    </div>
                  )}
                </div>
              )
            })
        }
      </div>
      <div className="divida-form-sticky" style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'16px', position:'sticky', top:'70px' }}>
        <div style={{ fontSize:'13px', fontWeight:600, marginBottom:'14px' }}>Nova dívida</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {[['Nome','text',nome,setNome,'Ex: Empréstimo Banco'],['Valor total (R$)','number',total,setTotal,'0,00'],['Descrição (opcional)','text',desc,setDesc,'Ex: 12x de R$ 500']].map(([label,type,val,set,ph])=>(
            <div key={String(label)}>
              <label style={{ fontSize:'11px', color:C.muted, fontWeight:500, marginBottom:'4px', display:'block' }}>{String(label)}</label>
              <input type={String(type)} value={String(val)} onChange={e=>(set as (v:string)=>void)(e.target.value)} placeholder={String(ph)} style={inputBase} onFocus={e=>(e.target.style.borderColor=C.amber)} onBlur={e=>(e.target.style.borderColor=C.border)}/>
            </div>
          ))}
          <button onClick={addDivida} disabled={saving||!nome||Number(total)<=0} style={{ width:'100%', padding:'11px', borderRadius:'8px', border:'none', background:saving||!nome||Number(total)<=0?'rgba(251,191,36,.3)':C.amber, color:'#1a0f00', fontSize:'13px', fontWeight:700, cursor:saving||!nome||Number(total)<=0?'not-allowed':'pointer', marginTop:'2px' }}>
            {saving?'Salvando...':'Adicionar dívida'}
          </button>
        </div>
      </div>
    </div>
  )
}

const PageConfig = ({ finance }: { finance: ReturnType<typeof useFinance> }) => {
  const [editing,setEditing]=useState(false)
  const [value,  setValue]  =useState('5200')
  const [saving, setSaving] =useState(false)
  const save = async ()=>{ setSaving(true); try { await import('../services/finance.service').then(m=>m.financeService.setSalario(Number(value))); setEditing(false) } finally { setSaving(false) } }
  return (
    <div style={{ maxWidth:'480px' }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'20px', marginBottom:'12px' }}>
        <div style={{ fontSize:'11px', color:C.muted, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'14px' }}>Salário do mês</div>
        {editing
          ? <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
              <input type="number" min="0" step="0.01" value={value} onChange={e=>setValue(e.target.value)} style={{ ...inputBase, flex:1 }} onFocus={e=>(e.target.style.borderColor=C.green)} onBlur={e=>(e.target.style.borderColor=C.border)}/>
              <button onClick={save} disabled={saving} style={{ padding:'10px 14px', borderRadius:'8px', border:'none', background:C.green, color:'#0a1a12', fontSize:'13px', fontWeight:700, cursor:'pointer' }}>{saving?'...':'Salvar'}</button>
              <button onClick={()=>setEditing(false)} style={{ padding:'10px 12px', borderRadius:'8px', border:`1px solid ${C.border}`, background:'none', color:C.muted, cursor:'pointer' }}>✕</button>
            </div>
          : <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'28px', fontWeight:700, color:C.green }}>{brl(Number(value))}</span>
              <button onClick={()=>setEditing(true)} style={{ padding:'8px 14px', borderRadius:'8px', border:`1px solid ${C.border}`, background:'none', color:C.muted, fontSize:'12px', cursor:'pointer' }}>Editar</button>
            </div>
        }
        <p style={{ fontSize:'12px', color:C.muted, marginTop:'10px', lineHeight:'1.6' }}>Usado para calcular o limite diário e projeções do mês.</p>
      </div>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:'12px', padding:'20px' }}>
        <div style={{ fontSize:'11px', color:C.muted, fontWeight:600, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'8px' }}>Sobre o ZetaFin</div>
        <p style={{ fontSize:'13px', color:C.muted, lineHeight:'1.7' }}>App de controle financeiro pessoal — conectado ao Firebase. Seus dados ficam privados no seu Firestore.</p>
      </div>
    </div>
  )
}

// ─── DashboardPage (raiz) ────────────────────────────────────────────────────
export const DashboardPage = () => {
  const navigate  = useNavigate()
  const { user, logout } = useAuthContext()
  const finance   = useFinance()
  const [page,    setPage]     = useState<Page>('inicio')
  const [modal,   setModal]    = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const handleSaveTx = useCallback(async (tx: Omit<Transaction,'id'>) => {
    await finance.addTransaction(tx)
  }, [finance])

  return (
    <>
      <style>{`
        @keyframes pulse    { 0%,100%{opacity:.4} 50%{opacity:.7} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes slideUp  { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:#1e2d42;border-radius:4px}
        .page-anim { animation: fadeUp .25s ease both; }
        .sidebar   { display: flex !important; }
        .bnav      { display: none !important; }
        .mob-title { display: none !important; }
        @media(max-width:768px){
          .sidebar   { display: none !important; }
          .bnav      { display: flex  !important; }
          .mob-title { display: block !important; }
          .dtabs     { display: none  !important; }
          .metrics-grid { grid-template-columns: repeat(2,1fr) !important; }
          .row2-grid    { grid-template-columns: 1fr !important; }
          .dividas-grid { grid-template-columns: 1fr !important; }
          .divida-form-sticky { position: static !important; }
          .content-pad  { padding: 14px !important; padding-bottom: 80px !important; }
        }
        @media(max-width:480px){
          .metrics-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', minHeight:'100vh', background:C.bg, color:C.text, fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell',sans-serif", fontSize:'14px' }}>

        {/* topbar */}
        <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', height:'56px', padding:'0 20px', background:C.surface, borderBottom:`1px solid ${C.border}`, position:'sticky', top:0, zIndex:100, flexShrink:0, gap:'14px', boxShadow: '0 1px 3px rgba(0,0,0,.05)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'16px', overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
              <div style={{ width:'32px', height:'32px', borderRadius:'10px', background:'linear-gradient(135deg,#7FE5A8,#6DD99A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', fontWeight:800, color:'#1A1A1A' }}>Ζ</div>
              <span style={{ fontSize:'16px', fontWeight:800, letterSpacing:'-.3px', whiteSpace:'nowrap', color: C.text }}>ZetaFin</span>
            </div>
            <div className="dtabs" style={{ display:'flex', gap:'3px' }}>
              {NAV.map(({id,label,icon:Ic})=>(
                <button key={id} onClick={()=>setPage(id)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'9px', border:'none', background:page===id?C.greenDim:'transparent', color:page===id?C.green:C.muted, fontSize:'14px', fontWeight:600, cursor:'pointer', transition:'all .2s', whiteSpace:'nowrap' }}>
                  <Ic/>{label}
                </button>
              ))}
            </div>
            <span className="mob-title" style={{ fontSize:'16px', fontWeight:700, color: C.text }}>{PAGE_TITLES[page]}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
            <button onClick={()=>setModal(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 14px', borderRadius:'9px', border:'none', background:C.green, color:'#1A1A1A', fontSize:'14px', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', transition:'all .2s', boxShadow: '0 2px 4px rgba(127,229,168,.2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(127,229,168,.3)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(127,229,168,.2)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)' }}
            >
              <IcPlus/><span>Nova</span>
            </button>
            <button onClick={handleLogout} title="Sair" style={{ display:'flex', alignItems:'center', gap:'6px', padding:'8px 12px', borderRadius:'9px', border:`1.5px solid ${C.border}`, background:C.surface, color:C.muted, fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all .2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.red; (e.currentTarget as HTMLButtonElement).style.color = C.red; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,67,54,.04)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.border; (e.currentTarget as HTMLButtonElement).style.color = C.muted; (e.currentTarget as HTMLButtonElement).style.background = C.surface }}
            >
              <IcLogout/><span>Sair</span>
            </button>
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} style={{ width:'32px', height:'32px', borderRadius:'8px', objectFit:'cover', flexShrink:0, border: `2px solid ${C.border}` }}/>
              : <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg,#7FE5A8,#6DD99A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:700, color:'#1A1A1A', flexShrink:0 }}>{user?.name?.charAt(0).toUpperCase()??'?'}</div>
            }
          </div>
        </nav>

        <div style={{ display:'flex', flex:1, overflow:'hidden' }}>

          {/* sidebar desktop */}
          <aside className="sidebar" style={{ width:'220px', flexShrink:0, background:C.surface, borderRight:`1.5px solid ${C.border}`, padding:'16px 12px', flexDirection:'column', gap:'3px', overflowY:'auto', boxShadow: '1px 0 2px rgba(0,0,0,.02)' }}>
            <div style={{ fontSize:'10px', fontWeight:700, color:C.muted, letterSpacing:'.08em', textTransform:'uppercase', padding:'10px 12px 6px', marginBottom:'4px' }}>Menu</div>
            {NAV.map(({id,label,icon:Ic})=>(
              <button key={id} onClick={()=>setPage(id)} style={{ display:'flex', alignItems:'center', gap:'11px', padding:'11px 12px', borderRadius:'10px', border:`1.5px solid ${page===id?C.greenBdr:'transparent'}`, background:page===id?C.greenDim:'none', color:page===id?C.green:C.muted, fontSize:'14px', fontWeight:600, cursor:'pointer', transition:'all .2s', width:'100%', textAlign:'left' }}
                onMouseEnter={e=>{ if(page!==id){(e.currentTarget as HTMLButtonElement).style.background=C.surf2;(e.currentTarget as HTMLButtonElement).style.color=C.text} }}
                onMouseLeave={e=>{ if(page!==id){(e.currentTarget as HTMLButtonElement).style.background='none';(e.currentTarget as HTMLButtonElement).style.color=C.muted} }}
              ><Ic/>{label}</button>
            ))}
            <div style={{ marginTop:'auto', paddingTop:'16px', borderTop:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px' }}>
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} style={{ width:'32px', height:'32px', borderRadius:'8px', objectFit:'cover', border: `1.5px solid ${C.border}` }}/>
                  : <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'linear-gradient(135deg,#7FE5A8,#6DD99A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:700, color:'#1A1A1A' }}>{user?.name?.charAt(0).toUpperCase()}</div>
                }
                <div style={{ overflow:'hidden' }}>
                  <div style={{ fontSize:'13px', fontWeight:700, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color: C.text }}>{user?.name}</div>
                  <div style={{ fontSize:'11px', color:C.muted, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.email}</div>
                </div>
              </div>
            </div>
          </aside>

          {/* conteúdo */}
          <main className="content-pad" style={{ flex:1, overflowY:'auto', padding:'28px 24px', paddingBottom:'28px', backgroundColor: C.bg }}>
            <div key={page} className="page-anim">
              {page==='inicio'    && <PageInicio    finance={finance} onAddTx={()=>setModal(true)} onGoPage={setPage}/>}
              {page==='historico' && <PageHistorico finance={finance}/>}
              {page==='dividas'   && <PageDividas   finance={finance}/>}
              {page==='config'    && <PageConfig    finance={finance}/>}
            </div>
          </main>
        </div>

        {/* bottom nav mobile */}
        <nav className="bnav" style={{ position:'fixed', bottom:0, left:0, right:0, background:C.surface, borderTop:`1px solid ${C.border}`, zIndex:100, paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
          <div style={{ display:'flex', height:'56px' }}>
            {NAV.map(({id,label,icon:Ic})=>(
              <button key={id} onClick={()=>setPage(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'3px', background:'none', border:'none', color:page===id?C.green:C.muted, fontSize:'10px', fontWeight:500, cursor:'pointer', transition:'color .18s' }}>
                <Ic/>{label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <TxModal open={modal} onClose={()=>setModal(false)} onSave={handleSaveTx}/>
    </>
  )
}

export default DashboardPage