import React, { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import { useFinance } from '../hooks/useFinance'
import type { Transaction } from '../types'
import type { JSX } from 'react/jsx-runtime'

const brl = (v: number) => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const F = `'Plus Jakarta Sans', system-ui, sans-serif`
const G = '#22c55e'
const C = {
  bg: '#111113', card: '#161618', card2: '#1c1c1f',
  border: 'rgba(255,255,255,0.08)', text: '#fff',
  muted: 'rgba(255,255,255,0.42)', muted2: 'rgba(255,255,255,0.22)',
  green: G, gDim: 'rgba(34,197,94,0.07)', gBdr: 'rgba(34,197,94,0.15)',
  red: '#e05a6e', rDim: 'rgba(224,90,110,0.07)', rBdr: 'rgba(224,90,110,0.15)',
  amber: '#c98a0a', aDim: 'rgba(201,138,10,0.07)', aBdr: 'rgba(201,138,10,0.15)',
  blue: '#3b82f6', bDim: 'rgba(59,130,246,0.07)', bBdr: 'rgba(59,130,246,0.15)',
  purple: '#7c5cbf',
}

const BRANDS: Record<string,string> = {
  ifood:'#EA1D2C',uber:'#111',spotify:'#1DB954',netflix:'#E50914',
  amazon:'#FF9900',nubank:'#8A05BE',bradesco:'#CC092F',itau:'#EC7000',
  caixa:'#005CA9',santander:'#EC0000',c6:'#242424',inter:'#FF7A00',
  mercado:'#00b1ea',picpay:'#21c25e',booking:'#003B95',vr:'#2d7a3a',
  salario:'#22c55e',freelance:'#8b5cf6',supermercado:'#3b82f6',
}
const brandBg = (n: string) => { const k = Object.keys(BRANDS).find(k => n.toLowerCase().includes(k)); return k ? BRANDS[k] : 'rgba(255,255,255,0.1)' }

// Icons
const IcPlus   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
const IcTrash  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
const IcSearch = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IcHome   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
const IcList   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const IcCard   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const IcFlag   = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
const IcCog    = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
const IcLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
const IcChevL  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
const IcChevR  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
const IcChevRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
const IcBell   = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
const IcEye    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const IcEnergy = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
const IcTrend  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const IcTrendDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
const IcRefresh = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>

type Tab = 'home'|'historico'|'dividas'|'metas'|'config'
const TABS: { id: Tab; label: string; Icon: () => JSX.Element }[] = [
  { id:'home',      label:'Dashboard', Icon: IcHome  },
  { id:'historico', label:'Histórico', Icon: IcList  },
  { id:'dividas',   label:'Dívidas',   Icon: IcCard  },
  { id:'metas',     label:'Metas',     Icon: IcFlag  },
  { id:'config',    label:'Config',    Icon: IcCog   },
]

const inp: React.CSSProperties = {
  width:'100%', padding:'11px 14px', borderRadius:'12px',
  background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)',
  color:C.text, fontSize:'14px', outline:'none', boxSizing:'border-box',
  fontFamily:F, fontWeight:500, transition:'border-color .15s, box-shadow .15s',
}
const foc = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>, col=G) => { e.target.style.borderColor=col; e.target.style.boxShadow=`0 0 0 3px ${col}18` }
const blr = (e: React.FocusEvent<HTMLInputElement|HTMLSelectElement>) => { e.target.style.borderColor='rgba(255,255,255,0.08)'; e.target.style.boxShadow='none' }

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:'16px', padding:'18px 20px', ...style }}>{children}</div>
)

// ── Sparkline 3D Glow (igual à referência) ────────────────────────────────────
const Sparkline3D = () => {
  const pts = [18, 28, 22, 38, 30, 45, 36, 55, 42, 65, 52, 78, 60, 88, 72, 95]
  const W = 340, H = 110, padX = 8, padY = 10
  const max = Math.max(...pts), min = Math.min(...pts) - 5
  const sx = (i: number) => padX + (i / (pts.length - 1)) * (W - padX * 2)
  const sy = (v: number) => H - padY - ((v - min) / (max - min)) * (H - padY * 2)
  const line = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${sx(i).toFixed(2)},${sy(v).toFixed(2)}`).join(' ')
  const area = line + ` L${sx(pts.length-1).toFixed(2)},${H} L${sx(0).toFixed(2)},${H} Z`
  const ex = sx(pts.length - 1), ey = sy(pts[pts.length - 1])
  const id = 'spark3d'
  return (
    <svg width="100%" height="110" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      style={{position:'absolute',bottom:0,left:0,right:0,width:'100%'}}>
      <defs>
        {/* Gradiente principal área */}
        <linearGradient id={`${id}area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={G} stopOpacity="0.35"/>
          <stop offset="60%" stopColor={G} stopOpacity="0.08"/>
          <stop offset="100%" stopColor={G} stopOpacity="0"/>
        </linearGradient>
        {/* Linha com glow — blur filter */}
        <filter id={`${id}glow`} x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={`${id}glow2`} x="-40%" y="-100%" width="180%" height="300%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Dot glow */}
        <filter id={`${id}dot`} x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Gradiente da linha do escuro → verde */}
        <linearGradient id={`${id}line`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={G} stopOpacity="0.2"/>
          <stop offset="50%" stopColor={G} stopOpacity="0.7"/>
          <stop offset="100%" stopColor={G} stopOpacity="1"/>
        </linearGradient>
      </defs>
      {/* Área preenchida */}
      <path d={area} fill={`url(#${id}area)`}/>
      {/* Linha glow suave atrás */}
      <path d={line} fill="none" stroke={G} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity="0.15" filter={`url(#${id}glow2)`}/>
      {/* Linha principal com gradiente */}
      <path d={line} fill="none" stroke={`url(#${id}line)`} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${id}glow)`}/>
      {/* Ponto final — halo externo */}
      <circle cx={ex} cy={ey} r="12" fill={G} opacity="0.12" filter={`url(#${id}glow2)`}/>
      {/* Ponto final — anel */}
      <circle cx={ex} cy={ey} r="6" fill="none" stroke={G} strokeWidth="2" opacity="0.5"/>
      {/* Ponto final — centro sólido */}
      <circle cx={ex} cy={ey} r="4" fill={G} filter={`url(#${id}dot)`}/>
      <circle cx={ex} cy={ey} r="2.5" fill="#fff" opacity="0.9"/>
    </svg>
  )
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ tab, goTab, user, onLogout }: { tab:Tab; goTab:(t:Tab)=>void; user:{name?:string;email?:string}|null; onLogout:()=>void }) => {
  const [exp, setExp] = useState(true)
  const W = exp ? 210 : 64
  return (
    <aside className="sidebar-desk" style={{ width:W, minWidth:W, maxWidth:W, flexShrink:0, background:'rgba(10,10,12,0.7)', borderRight:'1px solid rgba(255,255,255,0.07)', display:'flex', flexDirection:'column', transition:'width .22s cubic-bezier(.4,0,.2,1), min-width .22s, max-width .22s', overflow:'hidden', height:'100vh', position:'sticky', top:0 }}>
      <div style={{ padding:exp?'20px 16px 16px':'20px 0 16px', display:'flex', alignItems:'center', justifyContent:exp?'space-between':'center', borderBottom:'1px solid rgba(255,255,255,0.05)', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:32, height:32, borderRadius:9, flexShrink:0, background:G, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:'#000', fontFamily:F }}>Z</div>
          {exp && <span style={{ fontSize:15, fontWeight:800, color:C.text, letterSpacing:'-.4px', whiteSpace:'nowrap', fontFamily:F }}>ZetaFin</span>}
        </div>
        {exp && <button onClick={()=>setExp(false)} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted2, padding:4, display:'flex' }} onMouseEnter={e=>(e.currentTarget.style.color=C.muted)} onMouseLeave={e=>(e.currentTarget.style.color=C.muted2)}><IcChevL/></button>}
      </div>
      <div style={{ flex:1, padding:exp?'12px 10px':'12px 8px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' }}>
        {TABS.map(({id,label,Icon})=>{
          const active=tab===id
          return (
            <button key={id} onClick={()=>goTab(id)} title={!exp?label:undefined} style={{ display:'flex', alignItems:'center', gap:exp?11:0, justifyContent:exp?'flex-start':'center', padding:exp?'11px 13px':'11px 0', borderRadius:12, width:'100%', border:'none', background:active?'rgba(34,197,94,0.08)':'transparent', color:active?G:C.muted, cursor:'pointer', transition:'all .15s', fontSize:13, fontWeight:active?700:500, fontFamily:F }}
              onMouseEnter={e=>{ if(!active){(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.color=C.text} }}
              onMouseLeave={e=>{ if(!active){(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color=C.muted} }}>
              <span style={{ flexShrink:0 }}><Icon/></span>
              {exp && <span style={{ whiteSpace:'nowrap' }}>{label}</span>}
            </button>
          )
        })}
        {!exp && <button onClick={()=>setExp(true)} style={{ marginTop:8, display:'flex', alignItems:'center', justifyContent:'center', padding:'10px 0', borderRadius:12, width:'100%', border:`1px solid rgba(255,255,255,0.07)`, background:'transparent', color:C.muted2, cursor:'pointer', transition:'all .15s' }} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.color=C.muted}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color=C.muted2}}><IcChevR/></button>}
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', flexShrink:0, padding:exp?'12px 10px':'12px 8px' }}>
        {exp && user && (
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'9px 13px', marginBottom:4, background:'rgba(255,255,255,0.04)', borderRadius:11 }}>
            <div style={{ width:30, height:30, borderRadius:8, flexShrink:0, background:G, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color:'#000', fontFamily:F }}>{user.name?.charAt(0).toUpperCase()??'?'}</div>
            <div style={{ overflow:'hidden', flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:C.text, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontFamily:F }}>{user.name}</div>
              <div style={{ fontSize:10, color:C.muted2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', fontFamily:F }}>{user.email}</div>
            </div>
          </div>
        )}
        <button onClick={onLogout} title={!exp?'Sair':undefined} style={{ display:'flex', alignItems:'center', gap:exp?10:0, justifyContent:exp?'flex-start':'center', padding:exp?'10px 13px':'10px 0', width:'100%', borderRadius:11, border:'none', background:'transparent', color:'rgba(251,113,133,0.5)', cursor:'pointer', transition:'all .15s', fontSize:13, fontWeight:500, fontFamily:F }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background=C.rDim;(e.currentTarget as HTMLElement).style.color=C.red}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='transparent';(e.currentTarget as HTMLElement).style.color='rgba(251,113,133,0.5)'}}>
          <IcLogout/>{exp&&<span>Sair</span>}
        </button>
      </div>
    </aside>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
const CATS_D=['Alimentação','Moradia','Transporte','Saúde','Lazer','Assinaturas','Educação','Geral']
const CATS_E=['Salário','Freelance','Investimento','Bonus','Outro']
const TxModal = ({onClose,onSave}:{onClose:()=>void;onSave:(tx:Omit<Transaction,'id'>)=>Promise<void>}) => {
  const [tipo,setTipo]=useState<'despesa'|'entrada'>('despesa')
  const [desc,setDesc]=useState(''), [valor,setValor]=useState(''), [cat,setCat]=useState(CATS_D[0]), [saving,setSaving]=useState(false)
  const cats=tipo==='despesa'?CATS_D:CATS_E
  const save=async()=>{
    if(!desc.trim()||Number(valor)<=0)return; setSaving(true)
    try{await onSave({tipo,descricao:desc.trim(),categoria:cat,valor:Number(valor),data:new Date().toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}); onClose()}finally{setSaving(false)}
  }
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',backdropFilter:'blur(16px)'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#131416',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'22px',width:'100%',maxWidth:'440px',padding:'28px',boxShadow:'0 40px 100px rgba(0,0,0,0.8)',fontFamily:F}}>
        <div style={{fontSize:'18px',fontWeight:900,color:C.text,marginBottom:'20px',letterSpacing:'-.4px'}}>Nova transação</div>
        <div style={{display:'flex',gap:'6px',marginBottom:'18px',background:'rgba(255,255,255,0.05)',borderRadius:'14px',padding:'4px'}}>
          {(['despesa','entrada'] as const).map(t=>(
            <button key={t} onClick={()=>{setTipo(t);setCat(t==='despesa'?CATS_D[0]:CATS_E[0])}} style={{flex:1,padding:'11px',borderRadius:'11px',fontWeight:800,fontSize:'14px',cursor:'pointer',transition:'all .15s',fontFamily:F,background:tipo===t?(t==='despesa'?C.rDim:C.gDim):'transparent',color:tipo===t?(t==='despesa'?C.red:G):C.muted,border:tipo===t?`1px solid ${t==='despesa'?C.rBdr:C.gBdr}`:'1px solid transparent'}}>
              {t==='despesa'?'↓ Despesa':'↑ Entrada'}
            </button>
          ))}
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
          <div><label style={{fontSize:'12px',color:C.muted,fontWeight:600,marginBottom:'6px',display:'block',fontFamily:F}}>Descrição</label><input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Ex: Supermercado, Salário..." style={inp} autoFocus onFocus={e=>foc(e)} onBlur={blr}/></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
            <div><label style={{fontSize:'12px',color:C.muted,fontWeight:600,marginBottom:'6px',display:'block',fontFamily:F}}>Valor (R$)</label><input type="number" min="0" step="0.01" value={valor} onChange={e=>setValor(e.target.value)} placeholder="0,00" style={inp} onFocus={e=>foc(e)} onBlur={blr}/></div>
            <div><label style={{fontSize:'12px',color:C.muted,fontWeight:600,marginBottom:'6px',display:'block',fontFamily:F}}>Categoria</label><select value={cat} onChange={e=>setCat(e.target.value)} style={{...inp,appearance:'none'} as React.CSSProperties} onFocus={e=>foc(e as any)} onBlur={e=>blr(e as any)}>{cats.map(c=><option key={c} value={c} style={{background:'#131416'}}>{c}</option>)}</select></div>
          </div>
        </div>
        <div style={{display:'flex',gap:'8px',marginTop:'20px'}}>
          <button onClick={onClose} style={{flex:1,padding:'13px',borderRadius:'13px',border:'1px solid rgba(255,255,255,0.1)',background:'none',color:C.muted,fontSize:'14px',fontWeight:600,cursor:'pointer',fontFamily:F}}>Cancelar</button>
          <button onClick={save} disabled={saving||!desc||Number(valor)<=0} style={{flex:1,padding:'13px',borderRadius:'13px',border:'none',background:saving||!desc||Number(valor)<=0?'rgba(34,197,94,0.3)':G,color:'#000',fontSize:'14px',fontWeight:800,cursor:saving||!desc||Number(valor)<=0?'not-allowed':'pointer',fontFamily:F}}>{saving?'Salvando...':'Salvar'}</button>
        </div>
      </div>
    </div>
  )
}

// ── TX Row ────────────────────────────────────────────────────────────────────
const TxRow = ({tx,onDelete}:{tx:Transaction;onDelete?:(id:string)=>void}) => {
  const isE=tx.tipo==='entrada'
  return (
    <div style={{display:'flex',alignItems:'center',gap:'11px',padding:'10px 8px',borderBottom:'1px solid rgba(255,255,255,0.04)',borderRadius:'11px',margin:'0 -8px',transition:'background .15s'}} onMouseEnter={e=>(e.currentTarget.style.background='rgba(255,255,255,0.03)')} onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
      {getBrandLogo(tx.descricao, 38, tx.categoria)}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:'13px',fontWeight:600,color:C.text,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',fontFamily:F}}>{tx.descricao}</div>
        <div style={{fontSize:'11px',color:C.muted2,marginTop:'1px',fontFamily:F}}>{tx.categoria} · {tx.data}</div>
      </div>
      <div style={{fontSize:'14px',fontWeight:700,color:isE?G:C.red,flexShrink:0,fontFamily:F,letterSpacing:'-.2px'}}>{isE?'+':'-'}{brl(tx.valor)}</div>
      {onDelete&&<button onClick={()=>onDelete(tx.id)} style={{background:'none',border:'none',cursor:'pointer',color:C.muted2,display:'flex',padding:'4px',borderRadius:'6px',transition:'all .15s',flexShrink:0}} onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color=C.red;(e.currentTarget as HTMLElement).style.background=C.rDim}} onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=C.muted2;(e.currentTarget as HTMLElement).style.background='none'}}><IcTrash/></button>}
    </div>
  )
}

// ── Brand SVG logos inline ───────────────────────────────────────────────────
const BRAND_LOGOS: Record<string, React.ReactNode> = {
  ifood: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="ifg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f72c35"/><stop offset="100%" stopColor="#c41020"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#ifg)"/>
      <rect x="4" y="4" width="32" height="32" rx="8" fill="rgba(255,255,255,0.05)"/>
      <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff" fontFamily="'Plus Jakarta Sans',Arial,sans-serif" letterSpacing="-0.5">iF</text>
      <ellipse cx="20" cy="33" rx="7" ry="1.5" fill="rgba(0,0,0,0.2)"/>
    </svg>
  ),
  uber: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="ubg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1a1a1a"/><stop offset="100%" stopColor="#000"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#ubg)"/>
      <rect x="8" y="15" width="24" height="3" rx="1.5" fill="#fff" opacity="0.9"/>
      <rect x="8" y="22" width="16" height="3" rx="1.5" fill="#fff" opacity="0.5"/>
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="spg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1ed760"/><stop offset="100%" stopColor="#1db954"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#spg)"/>
      <path d="M11 15.5c5.5-2 12-1.5 17 1.5" stroke="#000" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.8"/>
      <path d="M12.5 20c4.5-1.5 9.5-1 13.5 1.2" stroke="#000" strokeWidth="1.9" strokeLinecap="round" fill="none" opacity="0.8"/>
      <path d="M14 24.5c3.5-1 7.5-.8 10.5 1" stroke="#000" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.8"/>
    </svg>
  ),
  netflix: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="nfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e50914"/><stop offset="100%" stopColor="#b20710"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#nfg)"/>
      <text x="13" y="28" fontSize="20" fontWeight="900" fill="#fff" fontFamily="Georgia,serif" opacity="0.95">N</text>
    </svg>
  ),
  nubank: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="nug" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#9b06d4"/><stop offset="100%" stopColor="#6c03a0"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#nug)"/>
      <circle cx="20" cy="20" r="9" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
      <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" fontFamily="'Plus Jakarta Sans',Arial,sans-serif">Nu</text>
    </svg>
  ),
  mercado: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="mpg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00cfff"/><stop offset="100%" stopColor="#009dbd"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#mpg)"/>
      <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily="'Plus Jakarta Sans',Arial,sans-serif" letterSpacing="-0.3">MP</text>
    </svg>
  ),
  bradesco: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="bdg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e0102f"/><stop offset="100%" stopColor="#a80b22"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#bdg)"/>
      <circle cx="20" cy="18" r="5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2"/>
      <circle cx="20" cy="18" r="2.5" fill="rgba(255,255,255,0.7)"/>
      <rect x="12" y="26" width="16" height="2" rx="1" fill="rgba(255,255,255,0.4)"/>
    </svg>
  ),
  itau: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="itg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff8c00"/><stop offset="100%" stopColor="#d46400"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#itg)"/>
      <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily="'Plus Jakarta Sans',Arial,sans-serif">itaú</text>
    </svg>
  ),
  inter: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="ing" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ff8c1a"/><stop offset="100%" stopColor="#e06800"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#ing)"/>
      <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="'Plus Jakarta Sans',Arial,sans-serif">Inter</text>
    </svg>
  ),
  c6: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="c6g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#2c2c2c"/><stop offset="100%" stopColor="#111"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#c6g)"/>
      <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fontSize="14" fontWeight="900" fill="#d4a843" fontFamily="'Plus Jakarta Sans',Arial,sans-serif">C6</text>
    </svg>
  ),
  amazon: (
    <svg viewBox="0 0 40 40" width="40" height="40">
      <defs><linearGradient id="azg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f0a500"/><stop offset="100%" stopColor="#c47d00"/></linearGradient></defs>
      <rect width="40" height="40" rx="11" fill="url(#azg)"/>
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fontWeight="900" fill="#fff" fontFamily="'Plus Jakarta Sans',Arial,sans-serif">amazon</text>
      <path d="M11 26c5 3 13 3 18 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.7"/>
    </svg>
  ),
}

// Category color mapping for generic entries
const CAT_BG: Record<string,string> = {
  alimentação:'#16a34a', moradia:'#7c3aed', transporte:'#2563eb',
  saúde:'#0891b2', lazer:'#db2777', assinaturas:'#d97706',
  educação:'#ea580c', geral:'#475569', salário:'#15803d',
  freelance:'#6d28d9', investimento:'#1d4ed8', bonus:'#92400e',
}
const getCatBg = (cat: string) => CAT_BG[cat.toLowerCase()] || '#334155'

const getBrandLogo = (name: string, size = 40, cat?: string) => {
  const n = name.toLowerCase()
  const key = Object.keys(BRAND_LOGOS).find(k => n.includes(k))
  if (key) {
    return (
      <div style={{ width:size, height:size, borderRadius:size*0.28, flexShrink:0, overflow:'hidden', border:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,0.3)' }}>
        {BRAND_LOGOS[key]}
      </div>
    )
  }
  // Fallback com gradiente e inicial — mais premium
  const bg = cat ? getCatBg(cat) : brandBg(name)
  const initial = name.charAt(0).toUpperCase()
  return (
    <div style={{ width:size, height:size, borderRadius:size*0.28, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 2px 8px rgba(0,0,0,0.3)', overflow:'hidden', position:'relative' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={`fg${initial}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bg} stopOpacity="1"/>
            <stop offset="100%" stopColor={bg} stopOpacity="0.7"/>
          </linearGradient>
        </defs>
        <rect width={size} height={size} rx={size*0.28} fill={`url(#fg${initial})`}/>
        <rect x="0" y="0" width={size} height={size*0.5} rx={size*0.28} fill="rgba(255,255,255,0.08)"/>
        <text x="50%" y="57%" dominantBaseline="middle" textAnchor="middle" fontSize={size*0.38} fontWeight="700" fill="#fff" fontFamily="'Plus Jakarta Sans',Arial,sans-serif" opacity="0.95">{initial}</text>
      </svg>
    </div>
  )
}


// ── Donut – visual exato da referência ───────────────────────────────────────
const CAT_COLORS: Record<string,string> = {
  Alimentação:'#22C55E', Moradia:'#8B5CF6', Transporte:'#3B82F6',
  Assinaturas:'#F59E0B', Lazer:'#EC4899',  Saúde:'#06B6D4',
  Educação:'#F97316',    Geral:'#94A3B8',
}

const DonutChart = ({ txs }: { txs: Transaction[] }) => {
  const [hov, setHov] = useState<string|null>(null)
  const by: Record<string,number> = {}
  txs.filter(t=>t.tipo==='despesa').forEach(t=>{by[t.categoria]=(by[t.categoria]||0)+t.valor})
  const total = Object.values(by).reduce((a,b)=>a+b,0)
  if(!total) return <div style={{display:'flex',gap:'16px',alignItems:'center',minHeight:'120px'}}><div style={{width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.02)',border:'2px dashed rgba(255,255,255,0.06)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><span style={{fontSize:'10px',color:C.muted2,fontFamily:F,textAlign:'center'}}>Sem<br/>dados</span></div></div>
  const entries = Object.entries(by).sort((a,b)=>b[1]-a[1])
  // build arcs com gap entre fatias
  const cx=65,cy=65,R=57,r=36,GAP=0.025; let ang=-Math.PI/2
  const arcs = entries.map(([cat,val])=>{
    const sweep = Math.max((val/total)*2*Math.PI - GAP, 0.02)
    const a0=ang+GAP/2, a1=a0+sweep
    const d=`M${(cx+R*Math.cos(a0)).toFixed(2)} ${(cy+R*Math.sin(a0)).toFixed(2)} A${R} ${R} 0 ${sweep>Math.PI?1:0} 1 ${(cx+R*Math.cos(a1)).toFixed(2)} ${(cy+R*Math.sin(a1)).toFixed(2)} L${(cx+r*Math.cos(a1)).toFixed(2)} ${(cy+r*Math.sin(a1)).toFixed(2)} A${r} ${r} 0 ${sweep>Math.PI?1:0} 0 ${(cx+r*Math.cos(a0)).toFixed(2)} ${(cy+r*Math.sin(a0)).toFixed(2)} Z`
    ang += (val/total)*2*Math.PI
    return {cat,val,pct:val/total,d,color:CAT_COLORS[cat]||'#94A3B8'}
  })
  const hovArc = hov ? arcs.find(a=>a.cat===hov) : null
  return (
    <div style={{display:'flex',gap:'20px',alignItems:'center'}}>
      <div style={{flexShrink:0,position:'relative'}}>
        <svg width="130" height="130" viewBox="0 0 130 130">
          <defs>
            {arcs.map(({cat,color})=>(
              <radialGradient key={cat} id={`rg_${cat.replace(/\s/g,'_')}`} cx="38%" cy="32%" r="68%">
                <stop offset="0%" stopColor={color} stopOpacity="1"/>
                <stop offset="100%" stopColor={color} stopOpacity="0.55"/>
              </radialGradient>
            ))}
            <radialGradient id="ctr" cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#1a1a1d"/>
              <stop offset="100%" stopColor="#111113"/>
            </radialGradient>
          </defs>
          {/* Sombra suave do anel inteiro */}
          <circle cx="65" cy="67" r="57" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="24"/>
          {/* Fatias */}
          {arcs.map(({cat,d,color})=>{
            const isH=hov===cat
            return (
              <path key={cat} d={d}
                fill={`url(#rg_${cat.replace(/\s/g,'_')})`}
                stroke="rgba(15,15,15,0.9)" strokeWidth="1.5"
                opacity={hov&&!isH?0.22:1}
                style={{cursor:'pointer',transformOrigin:'65px 65px',transform:isH?'scale(1.07)':'scale(1)',transition:'all .22s cubic-bezier(.34,1.28,.64,1)',filter:isH?`drop-shadow(0 0 7px ${color}88)`:'none'}}
                onMouseEnter={()=>setHov(cat)} onMouseLeave={()=>setHov(null)}/>
            )
          })}
          {/* Buraco central */}
          <circle cx="65" cy="65" r="34" fill="url(#ctr)"/>
          {/* Brilho sutil no topo */}
          <ellipse cx="56" cy="51" rx="11" ry="7" fill="rgba(255,255,255,0.03)"/>
          {/* Texto */}
          {hovArc
            ? <><text x="65" y="61" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily={F}>{hovArc.cat}</text><text x="65" y="74" textAnchor="middle" fontSize="14" fontWeight="800" fill={hovArc.color} fontFamily={F}>{(hovArc.pct*100).toFixed(0)}%</text></>
            : <><text x="65" y="61" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.35)" fontFamily={F}>Total</text><text x="65" y="74" textAnchor="middle" fontSize="12" fontWeight="800" fill={C.text} fontFamily={F}>R${(total/1000).toFixed(1)}k</text></>
          }
        </svg>
      </div>
      {/* Legenda igual referência — texto à esquerda, % bold à direita */}
      <div style={{flex:1,display:'flex',flexDirection:'column',gap:'8px'}}>
        {arcs.slice(0,5).map(({cat,pct,color})=>(
          <div key={cat} style={{display:'flex',alignItems:'center',gap:'9px',opacity:hov&&hov!==cat?.2:1,transition:'opacity .16s',cursor:'default'}}
            onMouseEnter={()=>setHov(cat)} onMouseLeave={()=>setHov(null)}>
            <div style={{width:9,height:9,borderRadius:'50%',background:color,flexShrink:0,boxShadow:`0 0 7px ${color}`}}/>
            <div style={{flex:1,fontSize:'13px',color:'rgba(255,255,255,0.6)',fontFamily:F}}>{cat}</div>
            <div style={{fontSize:'13px',fontWeight:800,color:C.text,fontFamily:F}}>{(pct*100).toFixed(0)}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── TAB HOME (Desktop layout — idêntico ao print) ─────────────────────────────
const TabHome = ({finance,onAdd,onGo,userName}:{finance:ReturnType<typeof useFinance>;onAdd:()=>void;onGo:(t:Tab)=>void;userName:string}) => {
  const s=finance.summary
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>

      {/* Saudação */}
      <div>
        <div style={{fontSize:'20px',fontWeight:800,color:C.text,fontFamily:F,letterSpacing:'-.3px'}}>Olá, {userName} 👋</div>
        <div style={{fontSize:'13px',color:C.muted,marginTop:'2px',fontFamily:F}}>Bem-vindo de volta!</div>
      </div>

      {/* Row 1: Saldo + Visão Geral — mesma altura */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',alignItems:'stretch'}} className="row-main">

        {/* Card saldo com sparkline 3D */}
        <div style={{background:'linear-gradient(145deg,#0e1a10 0%,#111d13 40%,#0a1409 100%)',border:`1px solid rgba(34,197,94,0.18)`,borderRadius:'20px',padding:'24px 24px 0',position:'relative',overflow:'hidden',minHeight:'200px',display:'flex',flexDirection:'column',boxShadow:'0 0 40px rgba(34,197,94,0.04),inset 0 1px 0 rgba(34,197,94,0.1)'}}>
          {/* Grid lines decorativas */}
          <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(34,197,94,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.03) 1px,transparent 1px)',backgroundSize:'40px 30px',borderRadius:'20px'}}/>
          {/* Glow radial no fundo */}
          <div style={{position:'absolute',bottom:'-20px',right:'-20px',width:'200px',height:'160px',background:'radial-gradient(ellipse,rgba(34,197,94,0.12) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{position:'relative',zIndex:1,flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
              <span style={{fontSize:'13px',fontWeight:600,color:'rgba(255,255,255,0.5)',fontFamily:F}}>Saldo total</span>
              <span style={{color:'rgba(255,255,255,0.3)',cursor:'pointer'}}><IcEye/></span>
            </div>
            <div style={{fontSize:'clamp(24px,3.2vw,34px)',fontWeight:900,color:C.text,letterSpacing:'-1.5px',lineHeight:1,fontFamily:F,marginBottom:'10px'}}>
              R$ {(s?.saldo??4329).toLocaleString('pt-BR')}<span style={{fontSize:'0.45em',verticalAlign:'super',fontWeight:700,opacity:.7}}>,00</span>
            </div>
            <div style={{display:'inline-flex',alignItems:'center',gap:'6px',background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.15)',borderRadius:'100px',padding:'5px 11px',backdropFilter:'blur(4px)'}}>
              <IcTrend/>
              <span style={{fontSize:'12px',fontWeight:700,color:G,fontFamily:F}}>12,5% este mês</span>
            </div>
          </div>
          {/* Gráfico 3D na base */}
          <div style={{position:'relative',height:'110px',marginLeft:'-24px',marginRight:'-24px'}}>
            <Sparkline3D/>
          </div>
        </div>

        {/* Visão Geral — mesma altura via stretch */}
        <div style={{display:'flex',flexDirection:'column',gap:'0'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'10px'}}>
            <span style={{fontSize:'14px',fontWeight:700,color:C.text,fontFamily:F}}>Visão geral</span>
            <span style={{fontSize:'12px',color:C.muted,fontFamily:F,cursor:'pointer'}}>Este mês ▾</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',flex:1}}>
            {[
              {label:'Receitas',     value:brl(s?.entradas??5200),  pct:'+8,2%',  up:true,  color:G,        dim:'rgba(255,255,255,0.03)', bdr:'rgba(255,255,255,0.06)', icon:<IcTrend/>},
              {label:'Despesas',     value:brl(s?.despesas??870),   pct:'-3,7%',  up:false, color:C.red,    dim:'rgba(255,255,255,0.03)', bdr:'rgba(255,255,255,0.06)', icon:<IcTrendDown/>},
              {label:'Investimentos',value:'R$ 12.810',             pct:'+15,3%', up:true,  color:C.blue,   dim:'rgba(255,255,255,0.03)', bdr:'rgba(255,255,255,0.06)', icon:<IcRefresh/>},
              {label:'Metas',        value:'3 de 5',                pct:'',       up:true,  color:C.purple, dim:'rgba(255,255,255,0.03)', bdr:'rgba(255,255,255,0.06)', icon:null},
            ].map(m=>(
              <div key={m.label} style={{background:m.dim,border:`1px solid ${m.bdr}`,borderRadius:'16px',padding:'14px 16px',display:'flex',flexDirection:'column',justifyContent:'space-between',minHeight:'88px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'}}>
                  <span style={{fontSize:'11px',color:C.muted,fontFamily:F,fontWeight:600}}>{m.label}</span>
                  {m.icon&&<span style={{color:m.up?m.color:C.red,opacity:.8}}>{m.icon}</span>}
                </div>
                <div>
                  <div style={{fontSize:'16px',fontWeight:800,color:C.text,letterSpacing:'-.4px',fontFamily:F,marginBottom:m.pct?'5px':'0'}}>{m.value}</div>
                  {m.pct&&<div style={{display:'inline-flex',alignItems:'center',gap:'4px',background:'rgba(255,255,255,0.05)',borderRadius:'100px',padding:'2px 8px'}}>
                    <span style={{fontSize:'11px',fontWeight:700,color:m.up?G:C.red,fontFamily:F}}>{m.up?'▲':'▼'} {m.pct}</span>
                  </div>}
                  {m.label==='Metas'&&<div style={{marginTop:'6px',height:'3px',background:'rgba(255,255,255,0.06)',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',borderRadius:'2px',background:m.color,width:'60%'}}/></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Gastos por categoria + Últimas transações — mesma altura */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:'14px',alignItems:'stretch'}} className="row-main">

        {/* Gastos por categoria */}
        <Card>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
            <span style={{fontSize:'14px',fontWeight:700,color:C.text,fontFamily:F}}>Gastos por categoria</span>
            <span style={{fontSize:'12px',color:C.muted,fontFamily:F,cursor:'pointer'}}>Este mês ▾</span>
          </div>
          <DonutChart txs={finance.transactions}/>
        </Card>

        {/* Últimas transações */}
        <Card>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
            <span style={{fontSize:'14px',fontWeight:700,color:C.text,fontFamily:F}}>Últimas transações</span>
            <button onClick={()=>onGo('historico')} style={{fontSize:'12px',fontWeight:700,color:G,background:'none',border:'none',cursor:'pointer',fontFamily:F}}>Ver tudo →</button>
          </div>
          {finance.loading
            ?[1,2,3,4].map(k=><div key={k} style={{height:'48px',background:C.card2,borderRadius:'10px',marginBottom:'5px',animation:'pulse 1.5s ease-in-out infinite'}}/>)
            :finance.transactions.length===0
              ?<div style={{textAlign:'center',padding:'24px',color:C.muted,fontSize:'13px',fontFamily:F}}>Nenhuma transação.<br/><button onClick={onAdd} style={{marginTop:'10px',padding:'8px 18px',borderRadius:'10px',border:'none',background:G,color:'#000',fontWeight:800,cursor:'pointer',fontFamily:F,fontSize:'12px',display:'inline-flex',alignItems:'center',gap:'5px'}}><IcPlus/>Adicionar</button></div>
              :finance.transactions.slice(0,5).map(tx=><TxRow key={tx.id} tx={tx}/>)
          }
        </Card>
      </div>

      {/* Row 3: Próximos pagamentos + Banner — mesma altura */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px',alignItems:'stretch'}} className="row-main">

        {/* Próximos pagamentos */}
        <Card>
          <div style={{fontSize:'14px',fontWeight:700,color:C.text,marginBottom:'12px',fontFamily:F}}>Próximos pagamentos</div>
          {[
            {icon:<IcEnergy/>, name:'Conta de energia', sub:'Vence em 3 dias', value:'R$ 320,00', color:'#F59E0B'},
            {icon:<span style={{fontSize:'14px'}}>📱</span>, name:'Celular', sub:'Vence em 8 dias', value:'R$ 89,90', color:'#3B82F6'},
          ].map((p,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'11px 12px',background:'rgba(255,255,255,0.02)',borderRadius:'13px',marginBottom:'8px',border:'1px solid rgba(255,255,255,0.04)',cursor:'pointer',transition:'opacity .15s'}} onMouseEnter={e=>(e.currentTarget.style.opacity='.8')} onMouseLeave={e=>(e.currentTarget.style.opacity='1')}>
              <div style={{width:36,height:36,borderRadius:'10px',background:`${p.color}15`,border:`1px solid ${p.color}30`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:p.color}}>{p.icon}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:'13px',fontWeight:600,color:C.text,fontFamily:F}}>{p.name}</div>
                <div style={{fontSize:'11px',color:C.muted2,fontFamily:F}}>{p.sub}</div>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <span style={{fontSize:'14px',fontWeight:700,color:C.text,fontFamily:F}}>{p.value}</span>
                <IcChevRight/>
              </div>
            </div>
          ))}
        </Card>

        {/* Banner — mão segurando card, idêntico à referência */}
        <div style={{background:'linear-gradient(140deg,#0c1e0f 0%,#0f2412 60%,#081609 100%)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:'20px',padding:'22px 22px 18px',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',overflow:'hidden',minHeight:'160px',boxShadow:'inset 0 1px 0 rgba(34,197,94,0.08)'}}>
          {/* grade decorativa */}
          <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(34,197,94,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.035) 1px,transparent 1px)',backgroundSize:'26px 20px',borderRadius:'20px',pointerEvents:'none'}}/>
          {/* glow radial esverdeado */}
          <div style={{position:'absolute',top:'-30px',right:'10%',width:'220px',height:'180px',background:'radial-gradient(ellipse,rgba(34,197,94,0.14) 0%,transparent 68%)',pointerEvents:'none'}}/>
          {/* Ilustração SVG — mão sustentando card com moeda e faísca */}
          <div style={{position:'absolute',right:'0',bottom:'0',pointerEvents:'none'}}>
            <svg width="164" height="148" viewBox="0 0 164 148" fill="none">
              <defs>
                <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a5c30"/><stop offset="100%" stopColor="#163820"/>
                </linearGradient>
                <linearGradient id="crdg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e4726"/><stop offset="100%" stopColor="#0e2414"/>
                </linearGradient>
                <radialGradient id="crdsh" cx="28%" cy="24%" r="70%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.11)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                </radialGradient>
                <radialGradient id="coinbg" cx="40%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="rgba(34,197,94,0.5)"/><stop offset="100%" stopColor="rgba(34,197,94,0.15)"/>
                </radialGradient>
                <filter id="glow5" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="glow2" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              {/* halo de fundo */}
              <ellipse cx="90" cy="90" rx="58" ry="46" fill="rgba(34,197,94,0.07)" filter="url(#glow5)"/>
              {/* PALMA */}
              <path d="M36 122 Q46 102 62 96 L108 93 Q119 93 123 101 Q127 109 118 116 L83 125 Q57 132 36 122Z" fill="url(#hg)" stroke="rgba(34,197,94,0.18)" strokeWidth="0.8"/>
              {/* DEDOS */}
              {[
                "M63 96 Q61 81 66 76 Q71 71 76 76 L78 93",
                "M76 93 Q75 79 80 74 Q85 69 90 74 L91 92",
                "M89 93 Q89 79 94 75 Q99 71 103 76 L104 93",
                "M102 94 Q103 82 108 79 Q113 76 116 81 L115 94",
              ].map((d,i)=><path key={i} d={d} fill="url(#hg)" stroke="rgba(34,197,94,0.12)" strokeWidth="0.7"/>)}
              {/* POLEGAR */}
              <path d="M36 122 Q27 115 30 104 Q33 94 44 97 L62 102" fill="url(#hg)" stroke="rgba(34,197,94,0.12)" strokeWidth="0.7"/>
              {/* CARTÃO */}
              <rect x="42" y="56" width="80" height="52" rx="11" fill="url(#crdg)" stroke="rgba(34,197,94,0.38)" strokeWidth="1.2"/>
              <rect x="42" y="56" width="80" height="52" rx="11" fill="url(#crdsh)"/>
              {/* chip */}
              <rect x="53" y="65" width="19" height="14" rx="4" fill="rgba(34,197,94,0.42)" stroke="rgba(34,197,94,0.6)" strokeWidth="0.8"/>
              <line x1="58" y1="65" x2="58" y2="79" stroke="rgba(34,197,94,0.28)" strokeWidth="0.7"/>
              <line x1="63" y1="65" x2="63" y2="79" stroke="rgba(34,197,94,0.28)" strokeWidth="0.7"/>
              <line x1="68" y1="65" x2="68" y2="79" stroke="rgba(34,197,94,0.28)" strokeWidth="0.7"/>
              <line x1="53" y1="72" x2="72" y2="72" stroke="rgba(34,197,94,0.28)" strokeWidth="0.7"/>
              {/* dígitos */}
              {[54,67,80,93].map((x,i)=><rect key={i} x={x} y="88" width="9" height="4" rx="2" fill="rgba(255,255,255,0.2)"/>)}
              {/* logo círculos */}
              <circle cx="104" cy="67" r="7.5" fill="rgba(34,197,94,0.4)" stroke="rgba(34,197,94,0.55)" strokeWidth="0.8"/>
              <circle cx="113" cy="67" r="7.5" fill="rgba(34,197,94,0.18)" stroke="rgba(34,197,94,0.38)" strokeWidth="0.8"/>
              {/* MOEDA flutuante */}
              <circle cx="138" cy="35" r="19" fill="rgba(34,197,94,0.06)" filter="url(#glow5)"/>
              <circle cx="138" cy="35" r="15" fill="rgba(34,197,94,0.16)" stroke="rgba(34,197,94,0.42)" strokeWidth="1.2"/>
              <circle cx="138" cy="35" r="11" fill="url(#coinbg)" stroke="rgba(34,197,94,0.55)" strokeWidth="0.8"/>
              <text x="138" y="40" textAnchor="middle" fontSize="10" fontWeight="900" fill="#22c55e" fontFamily="Arial,sans-serif">R$</text>
              {/* ESTRELA */}
              <path d="M124 19 L125.5 23.5 L130.2 23.5 L126.6 26.2 L128.1 30.7 L124 27.8 L119.9 30.7 L121.4 26.2 L117.8 23.5 L122.5 23.5 Z" fill="#22c55e" opacity="0.85" filter="url(#glow2)"/>
              {/* partículas */}
              <circle cx="150" cy="58" r="2.5" fill="#22c55e" opacity="0.45"/>
              <circle cx="158" cy="26" r="1.8" fill="#22c55e" opacity="0.32"/>
              <circle cx="128" cy="14" r="1.4" fill="#22c55e" opacity="0.42"/>
              <circle cx="114" cy="46" r="1.2" fill="#22c55e" opacity="0.28"/>
            </svg>
          </div>
          {/* TEXTO */}
          <div style={{position:'relative',zIndex:1}}>
            <div style={{fontSize:'16px',fontWeight:800,color:C.text,fontFamily:F,marginBottom:'5px',lineHeight:1.25}}>Organização financeira</div>
            <div style={{fontSize:'14px',color:G,fontFamily:F,fontWeight:700}}>é liberdade</div>
          </div>
          {/* FOOTER */}
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative',zIndex:1,marginTop:'16px'}}>
            <div style={{display:'flex',gap:'6px'}}>
              {[G,'#f59e0b','#3b82f6','#8b5cf6','#94a3b8'].map((col,i)=>(
                <div key={i} style={{width:20,height:20,borderRadius:'50%',background:col,border:'2px solid rgba(0,0,0,0.55)',boxShadow:`0 0 10px ${col}80`}}/>
              ))}
            </div>
            <button onClick={onAdd} style={{display:'flex',alignItems:'center',gap:'6px',padding:'9px 18px',borderRadius:'100px',border:'none',background:G,color:'#000',fontSize:'13px',fontWeight:800,cursor:'pointer',fontFamily:F,boxShadow:'0 4px 18px rgba(34,197,94,0.4)'}}><IcPlus/>Novo</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── TAB HOME MOBILE (idêntico ao print do celular) ────────────────────────────
const TabHomeMobile = ({finance,onAdd,onGo,userName}:{finance:ReturnType<typeof useFinance>;onAdd:()=>void;onGo:(t:Tab)=>void;userName:string}) => {
  const s=finance.summary
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>

      {/* Saudação */}
      <div style={{paddingTop:'2px',paddingBottom:'2px'}}>
        <div style={{fontSize:'20px',fontWeight:800,color:'#fff',fontFamily:F,letterSpacing:'-.3px'}}>Olá, {userName} 👋</div>
        <div style={{fontSize:'12px',color:'rgba(255,255,255,0.38)',fontFamily:F,marginTop:'2px'}}>Bem-vindo de volta!</div>
      </div>

      {/* Card saldo hero — destaque máximo */}
      <div style={{background:'linear-gradient(145deg,#0f1d12 0%,#122016 60%,#0a1509 100%)',border:'1px solid rgba(34,197,94,0.2)',borderRadius:'22px',padding:'20px 20px 0',position:'relative',overflow:'hidden',display:'flex',flexDirection:'column',boxShadow:'0 8px 32px rgba(0,0,0,0.4),0 0 0 1px rgba(34,197,94,0.06)'}}>
        {/* grid interno */}
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(34,197,94,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.03) 1px,transparent 1px)',backgroundSize:'32px 26px',pointerEvents:'none'}}/>
        {/* glow */}
        <div style={{position:'absolute',top:'-30px',right:'-20px',width:'160px',height:'130px',background:'radial-gradient(ellipse,rgba(34,197,94,0.1) 0%,transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'6px'}}>
            <span style={{fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.45)',fontFamily:F}}>Saldo total</span>
            <span style={{color:'rgba(255,255,255,0.25)',cursor:'pointer'}}><IcEye/></span>
          </div>
          <div style={{fontSize:'30px',fontWeight:900,color:'#fff',letterSpacing:'-1.5px',fontFamily:F,lineHeight:1,marginBottom:'10px'}}>
            R$ {(s?.saldo??4329).toLocaleString('pt-BR')}<span style={{fontSize:'0.42em',verticalAlign:'super',fontWeight:700,opacity:.6}}>,00</span>
          </div>
          <div style={{display:'inline-flex',alignItems:'center',gap:'5px',background:'rgba(34,197,94,0.14)',border:'1px solid rgba(34,197,94,0.22)',borderRadius:'100px',padding:'4px 11px',marginBottom:'2px'}}>
            <IcTrend/><span style={{fontSize:'11px',fontWeight:700,color:G,fontFamily:F}}>12,5% este mês</span>
          </div>
        </div>
        {/* Sparkline na base */}
        <div style={{position:'relative',height:'90px',marginLeft:'-20px',marginRight:'-20px'}}>
          <Sparkline3D/>
        </div>
      </div>

      {/* Grid entradas/despesas — 2 cards lado a lado */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
        <div style={{background:'#181a1c',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px',padding:'14px',boxShadow:'0 4px 16px rgba(0,0,0,0.3)'}}>
          <div style={{fontSize:'10px',fontWeight:700,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'6px',fontFamily:F}}>Entradas</div>
          <div style={{fontSize:'17px',fontWeight:800,color:'#fff',letterSpacing:'-.5px',fontFamily:F,marginBottom:'4px'}}>{brl(s?.entradas??5200)}</div>
          <div style={{display:'inline-flex',alignItems:'center',gap:'3px',background:'rgba(34,197,94,0.1)',borderRadius:'100px',padding:'2px 8px'}}>
            <span style={{fontSize:'10px',fontWeight:700,color:G,fontFamily:F}}>▲ +8,2%</span>
          </div>
        </div>
        <div style={{background:'#181a1c',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px',padding:'14px',boxShadow:'0 4px 16px rgba(0,0,0,0.3)'}}>
          <div style={{fontSize:'10px',fontWeight:700,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'6px',fontFamily:F}}>Despesas</div>
          <div style={{fontSize:'17px',fontWeight:800,color:'#fff',letterSpacing:'-.5px',fontFamily:F,marginBottom:'4px'}}>{brl(s?.despesas??870)}</div>
          <div style={{display:'inline-flex',alignItems:'center',gap:'3px',background:'rgba(251,113,133,0.1)',borderRadius:'100px',padding:'2px 8px'}}>
            <span style={{fontSize:'10px',fontWeight:700,color:C.red,fontFamily:F}}>▼ −3,7%</span>
          </div>
        </div>
      </div>

      {/* Visão geral — grid 2x2 */}
      <div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
          <span style={{fontSize:'13px',fontWeight:700,color:'#fff',fontFamily:F}}>Visão geral</span>
          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',fontFamily:F}}>Este mês ▾</span>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
          {[
            {label:'Receitas',      value:brl(s?.entradas??5200),  pct:'+8,2%',  up:true,  color:G,        accentTop:'rgba(34,197,94,0.35)'},
            {label:'Despesas',      value:brl(s?.despesas??870),   pct:'−3,7%',  up:false, color:C.red,    accentTop:'rgba(251,113,133,0.35)'},
            {label:'Investimentos', value:'R$ 12.810',             pct:'+15,3%', up:true,  color:C.blue,   accentTop:'rgba(59,130,246,0.35)'},
            {label:'Metas',         value:'3 de 5',                pct:'',       up:true,  color:'#8b5cf6',accentTop:'rgba(139,92,246,0.35)'},
          ].map(m=>(
            <div key={m.label} style={{background:'#181a1c',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'16px',padding:'14px',position:'relative',overflow:'hidden',boxShadow:'0 4px 16px rgba(0,0,0,0.3)'}}>
              {/* linha de acento no topo */}
              <div style={{position:'absolute',top:0,left:'16px',right:'16px',height:'1.5px',background:m.accentTop,borderRadius:'0 0 2px 2px'}}/>
              <div style={{fontSize:'10px',fontWeight:600,color:'rgba(255,255,255,0.35)',marginBottom:'6px',fontFamily:F}}>{m.label}</div>
              <div style={{fontSize:'15px',fontWeight:800,color:'#fff',letterSpacing:'-.4px',fontFamily:F,marginBottom:m.pct?'5px':'0'}}>{m.value}</div>
              {m.pct&&<div style={{fontSize:'10px',fontWeight:700,color:m.up?m.color:C.red,fontFamily:F}}>{m.up?'▲':'▼'} {m.pct}</div>}
              {m.label==='Metas'&&<div style={{marginTop:'6px',height:'3px',background:'rgba(255,255,255,0.06)',borderRadius:'2px',overflow:'hidden'}}><div style={{height:'100%',borderRadius:'2px',background:m.color,width:'60%'}}/></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Gastos por categoria */}
      <div style={{background:'#181a1c',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'20px',padding:'18px',boxShadow:'0 4px 20px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px'}}>
          <span style={{fontSize:'13px',fontWeight:700,color:'#fff',fontFamily:F}}>Gastos por categoria</span>
          <span style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',fontFamily:F}}>Este mês ▾</span>
        </div>
        <DonutChart txs={finance.transactions}/>
      </div>

      {/* Últimas transações */}
      <div style={{background:'#181a1c',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'20px',padding:'16px 18px',boxShadow:'0 4px 20px rgba(0,0,0,0.3)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
          <span style={{fontSize:'13px',fontWeight:700,color:'#fff',fontFamily:F}}>Últimas transações</span>
          <button onClick={()=>onGo('historico')} style={{fontSize:'11px',fontWeight:700,color:G,background:'none',border:'none',cursor:'pointer',fontFamily:F}}>Ver tudo →</button>
        </div>
        {finance.loading
          ?[1,2,3].map(k=><div key={k} style={{height:'46px',background:'rgba(255,255,255,0.04)',borderRadius:'10px',marginBottom:'4px',animation:'pulse 1.5s ease-in-out infinite'}}/>)
          :finance.transactions.length===0
            ?<div style={{textAlign:'center',padding:'20px',color:'rgba(255,255,255,0.3)',fontSize:'12px',fontFamily:F}}>
              Nenhuma transação
              <br/>
              <button onClick={onAdd} style={{marginTop:'8px',padding:'7px 16px',borderRadius:'10px',border:'none',background:G,color:'#000',fontWeight:800,cursor:'pointer',fontFamily:F,fontSize:'12px',display:'inline-flex',alignItems:'center',gap:'5px'}}><IcPlus/>Adicionar</button>
            </div>
            :finance.transactions.slice(0,4).map(tx=><TxRow key={tx.id} tx={tx}/>)
        }
      </div>

      {/* Próximos pagamentos */}
      <div style={{background:'#181a1c',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'20px',padding:'16px 18px',boxShadow:'0 4px 20px rgba(0,0,0,0.3)'}}>
        <div style={{fontSize:'13px',fontWeight:700,color:'#fff',marginBottom:'12px',fontFamily:F}}>Próximos pagamentos</div>
        {[
          {icon:<IcEnergy/>, name:'Conta de energia', sub:'Vence em 3 dias', value:'R$ 320,00', color:'#F59E0B'},
          {icon:<span style={{fontSize:'12px'}}>📱</span>, name:'Celular', sub:'Vence em 8 dias', value:'R$ 89,90', color:'#3B82F6'},
        ].map((p,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:'12px',padding:'11px 12px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:'13px',marginBottom:i===0?'7px':'0'}}>
            <div style={{width:34,height:34,borderRadius:'10px',background:`${p.color}12`,border:`1px solid ${p.color}25`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,color:p.color}}>{p.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:'13px',fontWeight:600,color:'#fff',fontFamily:F}}>{p.name}</div>
              <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',fontFamily:F}}>{p.sub}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'4px'}}>
              <span style={{fontSize:'13px',fontWeight:700,color:'#fff',fontFamily:F}}>{p.value}</span>
              <span style={{color:'rgba(255,255,255,0.3)'}}><IcChevRight/></span>
            </div>
          </div>
        ))}
      </div>

      {/* Banner mobile */}
      <div style={{background:'linear-gradient(140deg,#0c1e0f 0%,#0f2412 60%,#081609 100%)',border:'1px solid rgba(34,197,94,0.18)',borderRadius:'20px',padding:'18px 18px 14px',display:'flex',flexDirection:'column',justifyContent:'space-between',position:'relative',overflow:'hidden',minHeight:'120px',boxShadow:'0 4px 20px rgba(0,0,0,0.3),0 0 0 1px rgba(34,197,94,0.05)'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(34,197,94,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.025) 1px,transparent 1px)',backgroundSize:'20px 16px',borderRadius:'20px',pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:'-20px',right:'5%',width:'140px',height:'120px',background:'radial-gradient(ellipse,rgba(34,197,94,0.1) 0%,transparent 68%)',pointerEvents:'none'}}/>
        <div style={{position:'absolute',right:'-2px',bottom:'-2px',pointerEvents:'none'}}>
          <svg width="110" height="100" viewBox="0 0 164 148" fill="none">
            <defs>
              <linearGradient id="hgm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a5c30"/><stop offset="100%" stopColor="#163820"/></linearGradient>
              <linearGradient id="crdgm" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1e4726"/><stop offset="100%" stopColor="#0e2414"/></linearGradient>
              <radialGradient id="crdshm" cx="28%" cy="24%" r="70%"><stop offset="0%" stopColor="rgba(255,255,255,0.1)"/><stop offset="100%" stopColor="rgba(255,255,255,0)"/></radialGradient>
              <filter id="gm5" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <ellipse cx="90" cy="90" rx="58" ry="46" fill="rgba(34,197,94,0.06)" filter="url(#gm5)"/>
            <path d="M36 122 Q46 102 62 96 L108 93 Q119 93 123 101 Q127 109 118 116 L83 125 Q57 132 36 122Z" fill="url(#hgm)" stroke="rgba(34,197,94,0.15)" strokeWidth="0.8"/>
            {["M63 96 Q61 81 66 76 Q71 71 76 76 L78 93","M76 93 Q75 79 80 74 Q85 69 90 74 L91 92","M89 93 Q89 79 94 75 Q99 71 103 76 L104 93","M102 94 Q103 82 108 79 Q113 76 116 81 L115 94"].map((d,i)=><path key={i} d={d} fill="url(#hgm)" stroke="rgba(34,197,94,0.1)" strokeWidth="0.7"/>)}
            <path d="M36 122 Q27 115 30 104 Q33 94 44 97 L62 102" fill="url(#hgm)" stroke="rgba(34,197,94,0.1)" strokeWidth="0.7"/>
            <rect x="42" y="56" width="80" height="52" rx="11" fill="url(#crdgm)" stroke="rgba(34,197,94,0.32)" strokeWidth="1.2"/>
            <rect x="42" y="56" width="80" height="52" rx="11" fill="url(#crdshm)"/>
            <rect x="53" y="65" width="19" height="14" rx="4" fill="rgba(34,197,94,0.38)" stroke="rgba(34,197,94,0.55)" strokeWidth="0.8"/>
            {[54,67,80,93].map((x,i)=><rect key={i} x={x} y="88" width="9" height="4" rx="2" fill="rgba(255,255,255,0.18)"/>)}
            <circle cx="138" cy="35" r="15" fill="rgba(34,197,94,0.14)" stroke="rgba(34,197,94,0.38)" strokeWidth="1.2"/>
            <circle cx="138" cy="35" r="10" fill="rgba(34,197,94,0.28)" stroke="rgba(34,197,94,0.5)" strokeWidth="0.8"/>
            <text x="138" y="39" textAnchor="middle" fontSize="9" fontWeight="900" fill="#22c55e" fontFamily="Arial,sans-serif">R$</text>
            <path d="M124 19 L125.5 23.5 L130.2 23.5 L126.6 26.2 L128.1 30.7 L124 27.8 L119.9 30.7 L121.4 26.2 L117.8 23.5 L122.5 23.5 Z" fill="#22c55e" opacity="0.7"/>
          </svg>
        </div>
        <div style={{position:'relative',zIndex:1}}>
          <div style={{fontSize:'14px',fontWeight:800,color:'#fff',fontFamily:F,marginBottom:'3px'}}>Organização financeira</div>
          <div style={{fontSize:'13px',color:G,fontFamily:F,fontWeight:700}}>é liberdade</div>
        </div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',position:'relative',zIndex:1,marginTop:'14px'}}>
          <div style={{display:'flex',gap:'5px'}}>
            {[G,'#f59e0b','#3b82f6','#8b5cf6','#94a3b8'].map((col,i)=>(
              <div key={i} style={{width:18,height:18,borderRadius:'50%',background:col,border:'2px solid rgba(0,0,0,0.5)',boxShadow:`0 0 8px ${col}60`}}/>
            ))}
          </div>
          <button onClick={onAdd} style={{display:'flex',alignItems:'center',gap:'5px',padding:'8px 14px',borderRadius:'100px',border:'none',background:G,color:'#000',fontSize:'12px',fontWeight:800,cursor:'pointer',fontFamily:F,boxShadow:'0 4px 14px rgba(34,197,94,0.35)'}}><IcPlus/>Novo</button>
        </div>
      </div>

    </div>
  )
}

// ── HISTÓRICO ─────────────────────────────────────────────────────────────────
const MONTHS=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const TabHistorico = ({finance,onAdd}:{finance:ReturnType<typeof useFinance>;onAdd:()=>void}) => {
  const now=new Date(),[sel,setSel]=useState(now.getMonth()),[filt,setFilt]=useState<'all'|'entrada'|'despesa'>('all'),[busca,setBusca]=useState('')
  const txs=finance.transactions.filter(t=>(filt==='all'||t.tipo===filt)&&(!busca||t.descricao.toLowerCase().includes(busca.toLowerCase())))
  const tE=txs.filter(t=>t.tipo==='entrada').reduce((a,t)=>a+t.valor,0)
  const tD=txs.filter(t=>t.tipo==='despesa').reduce((a,t)=>a+t.valor,0)
  return(<div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
    <Card><div style={{fontSize:'11px',color:C.muted,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'10px',fontFamily:F}}>Período</div><div style={{display:'flex',gap:'5px',flexWrap:'wrap'}}>{MONTHS.map((m,i)=>{const a=i===sel,f=i>now.getMonth();return<button key={m} onClick={()=>!f&&setSel(i)} disabled={f} style={{padding:'7px 13px',borderRadius:'9px',fontSize:'12px',fontWeight:600,cursor:f?'not-allowed':'pointer',fontFamily:F,background:a?G:'transparent',color:f?C.muted2:a?'#000':C.muted,border:`1px solid ${a?G:'rgba(255,255,255,0.09)'}`,opacity:f?.35:1}}>{m}</button>})}</div></Card>
    <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>{[['Entradas',tE,G,C.gDim,C.gBdr],['Despesas',tD,C.red,C.rDim,C.rBdr],['Saldo',tE-tD,C.text,'rgba(255,255,255,0.04)','rgba(255,255,255,0.09)']].map(([l,v,c,bg,bd])=><div key={l as string} style={{padding:'10px 14px',borderRadius:'11px',background:bg as string,border:`1px solid ${bd}`,display:'flex',gap:'10px',alignItems:'center'}}><span style={{fontSize:'11px',fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:'.06em',fontFamily:F}}>{l}</span><span style={{fontSize:'15px',fontWeight:900,color:c as string,fontFamily:F,letterSpacing:'-.4px'}}>{brl(Math.abs(v as number))}</span></div>)}</div>
    <Card>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px',flexWrap:'wrap',gap:'8px'}}>
        <span style={{fontSize:'13px',fontWeight:700,color:C.text,fontFamily:F}}>{MONTHS[sel]} · {txs.length} transações</span>
        <div style={{display:'flex',gap:'5px',alignItems:'center'}}>
          {(['all','entrada','despesa'] as const).map(f=>{const labels={all:'Todos',entrada:'Entradas',despesa:'Despesas'},a=filt===f,ac=f==='despesa'?C.red:f==='entrada'?G:C.text;return<button key={f} onClick={()=>setFilt(f)} style={{padding:'7px 11px',borderRadius:'8px',fontSize:'12px',fontWeight:600,cursor:'pointer',fontFamily:F,background:a?`${ac}15`:'none',color:a?ac:C.muted,border:`1px solid ${a?`${ac}30`:'rgba(255,255,255,0.09)'}`}}>{labels[f]}</button>})}
          <button onClick={onAdd} style={{display:'flex',alignItems:'center',gap:'5px',padding:'7px 13px',borderRadius:'8px',border:'1px solid rgba(34,197,94,0.25)',background:'rgba(34,197,94,0.12)',color:'#fff',fontSize:'12px',fontWeight:700,cursor:'pointer',fontFamily:F}}><IcPlus/>Nova</button>
        </div>
      </div>
      <div style={{position:'relative',marginBottom:'12px'}}><span style={{position:'absolute',left:'12px',top:'50%',transform:'translateY(-50%)',color:C.muted2}}><IcSearch/></span><input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar..." style={{...inp,paddingLeft:'36px'}} onFocus={e=>foc(e)} onBlur={blr}/></div>
      {txs.length===0?<div style={{textAlign:'center',padding:'32px',color:C.muted,fontSize:'13px',fontFamily:F}}>Nenhuma transação</div>:txs.map(tx=><TxRow key={tx.id} tx={tx} onDelete={finance.deleteTransaction}/>)}
    </Card>
  </div>)
}

// ── DÍVIDAS ───────────────────────────────────────────────────────────────────
const TabDividas = ({finance}:{finance:ReturnType<typeof useFinance>}) => {
  const [nome,setNome]=useState(''),[total,setTotal]=useState(''),[desc,setDesc]=useState(''),[saving,setSaving]=useState(false),[pags,setPags]=useState<Record<string,string>>({}),[showForm,setShowForm]=useState(false)
  const add=async()=>{if(!nome.trim()||Number(total)<=0)return;setSaving(true);try{await finance.addDebt({nome:nome.trim(),descricao:desc.trim(),total:Number(total)});setNome('');setTotal('');setDesc('');setShowForm(false)}finally{setSaving(false)}}
  const pay=async(id:string)=>{const v=Number(pags[id]||0);if(v<=0)return;await finance.payDebt(id,v);setPags(p=>({...p,[id]:''}))}

  const totalDivida = finance.debts.reduce((a,d)=>a+d.total,0)
  const totalPago   = finance.debts.reduce((a,d)=>a+d.pago,0)
  const totalResto  = totalDivida - totalPago

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>

      {/* Resumo topo */}
      {finance.debts.length>0 && (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'10px'}}>
          {[
            {label:'Total em dívidas', value:brl(totalDivida), color:'rgba(255,255,255,0.7)', dot:'rgba(255,255,255,0.3)'},
            {label:'Já pago',          value:brl(totalPago),   color:G,                        dot:G},
            {label:'Restante',         value:brl(totalResto),  color:'rgba(251,113,133,0.9)',   dot:'rgba(251,113,133,0.8)'},
          ].map(m=>(
            <div key={m.label} style={{background:'#1c1d20',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'14px',padding:'14px 16px',boxShadow:'0 2px 12px rgba(0,0,0,0.3)'}}>
              <div style={{display:'flex',alignItems:'center',gap:'6px',marginBottom:'7px'}}>
                <div style={{width:'6px',height:'6px',borderRadius:'50%',background:m.dot,flexShrink:0}}/>
                <span style={{fontSize:'10px',fontWeight:600,color:'rgba(255,255,255,0.35)',textTransform:'uppercase',letterSpacing:'.06em',fontFamily:F}}>{m.label}</span>
              </div>
              <div style={{fontSize:'15px',fontWeight:800,color:m.color,letterSpacing:'-.4px',fontFamily:F}}>{m.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Botão abrir form / Card de adição */}
      {!showForm ? (
        <button onClick={()=>setShowForm(true)} style={{display:'flex',alignItems:'center',gap:'8px',padding:'14px 20px',borderRadius:'14px',border:'1px dashed rgba(255,255,255,0.25)',background:'rgba(255,255,255,0.04)',color:'#fff',fontSize:'14px',fontWeight:600,cursor:'pointer',fontFamily:F,transition:'all .18s',width:'100%',justifyContent:'center'}}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(34,197,94,0.4)';(e.currentTarget as HTMLElement).style.color=G;(e.currentTarget as HTMLElement).style.background='rgba(34,197,94,0.05)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.12)';(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.45)';(e.currentTarget as HTMLElement).style.background='transparent'}}>
          <IcPlus/> Cadastrar nova dívida
        </button>
      ) : (
        <div style={{background:'#191a1d',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'22px',boxShadow:'0 4px 20px rgba(0,0,0,0.35)'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'18px'}}>
            <span style={{fontSize:'15px',fontWeight:700,color:'#fff',fontFamily:F}}>Nova dívida</span>
            <button onClick={()=>setShowForm(false)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.3)',cursor:'pointer',fontSize:'18px',lineHeight:1,padding:'2px 6px'}}>×</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}}>
            <div>
              <label style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'7px',display:'block',fontFamily:F}}>Nome da dívida</label>
              <input type="text" value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex: Cartão Nubank..." style={inp} autoFocus onFocus={e=>foc(e)} onBlur={blr}/>
            </div>
            <div>
              <label style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'7px',display:'block',fontFamily:F}}>Valor total (R$)</label>
              <input type="number" min="0" step="0.01" value={total} onChange={e=>setTotal(e.target.value)} placeholder="0,00" style={inp} onFocus={e=>foc(e)} onBlur={blr}/>
            </div>
          </div>
          <div style={{marginBottom:'16px'}}>
            <label style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'7px',display:'block',fontFamily:F}}>Observação (opcional)</label>
            <input type="text" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Ex: 12x de R$ 520, fatura em aberto..." style={inp} onFocus={e=>foc(e)} onBlur={blr}/>
          </div>
          <div style={{display:'flex',gap:'10px'}}>
            <button onClick={()=>setShowForm(false)} style={{padding:'12px 20px',borderRadius:'12px',border:'1px solid rgba(255,255,255,0.1)',background:'none',color:'rgba(255,255,255,0.4)',fontSize:'14px',fontWeight:600,cursor:'pointer',fontFamily:F}}>Cancelar</button>
            <button onClick={add} disabled={saving||!nome||Number(total)<=0} style={{flex:1,padding:'12px 20px',borderRadius:'12px',border:'none',background:!nome||Number(total)<=0?'rgba(34,197,94,0.2)':G,color:'#000',fontSize:'14px',fontWeight:800,cursor:!nome||Number(total)<=0?'not-allowed':'pointer',fontFamily:F}}>{saving?'Salvando...':'Adicionar dívida'}</button>
          </div>
        </div>
      )}

      {/* Lista de dívidas */}
      {finance.debts.length===0 ? (
        <div style={{textAlign:'center',padding:'60px 20px'}}>
          <div style={{fontSize:'44px',marginBottom:'12px'}}>🎉</div>
          <div style={{fontSize:'17px',fontWeight:700,color:'#fff',fontFamily:F,marginBottom:'6px'}}>Nenhuma dívida!</div>
          <div style={{fontSize:'13px',color:'rgba(255,255,255,0.35)',fontFamily:F}}>Clique acima para cadastrar suas dívidas e acompanhar o progresso.</div>
        </div>
      ) : finance.debts.map(d=>{
        const pct=Math.min((d.pago/d.total)*100,100)
        const rest=Math.max(d.total-d.pago,0)
        const quit=rest<=0
        // cores neutras — apenas barra colorida, texto branco
        const barColor = 'linear-gradient(90deg,rgba(34,197,94,0.25) 0%,rgba(34,197,94,0.55) 100%)'
        return (
          <div key={d.id} style={{background:'#191a1d',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'18px',padding:'22px',transition:'all .2s',boxShadow:'0 4px 20px rgba(0,0,0,0.35)'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.18)';(e.currentTarget as HTMLElement).style.transform='translateY(-1px)';(e.currentTarget as HTMLElement).style.boxShadow='0 8px 28px rgba(0,0,0,0.45)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.1)';(e.currentTarget as HTMLElement).style.transform='translateY(0)';(e.currentTarget as HTMLElement).style.boxShadow='0 4px 20px rgba(0,0,0,0.35)'}}>

            {/* Header da dívida */}
            <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'16px'}}>
              {getBrandLogo(d.nome, 44)}
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'2px',flexWrap:'wrap'}}>
                  <span style={{fontSize:'15px',fontWeight:700,color:'#fff',fontFamily:F}}>{d.nome}</span>
                  {quit && <span style={{fontSize:'10px',fontWeight:700,padding:'2px 9px',borderRadius:'100px',background:'rgba(34,197,94,0.12)',color:G,border:'1px solid rgba(34,197,94,0.2)',fontFamily:F}}>✓ Quitada</span>}
                </div>
                {d.descricao && <div style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',fontFamily:F,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{d.descricao}</div>}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:'10px',flexShrink:0}}>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'24px',fontWeight:900,color:'#fff',fontFamily:F,letterSpacing:'-1px',lineHeight:1}}>{pct.toFixed(0)}<span style={{fontSize:'14px',opacity:.45}}>%</span></div>
                  <div style={{fontSize:'10px',color:'rgba(255,255,255,0.3)',fontFamily:F}}>quitado</div>
                </div>
                <button onClick={()=>finance.deleteDebt(d.id)} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.2)',display:'flex',padding:'6px',borderRadius:'8px',transition:'all .15s'}}
                  onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='rgba(251,113,133,0.8)';(e.currentTarget as HTMLElement).style.background='rgba(251,113,133,0.08)'}}
                  onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.2)';(e.currentTarget as HTMLElement).style.background='none'}}>
                  <IcTrash/>
                </button>
              </div>
            </div>

            {/* Barra de progresso */}
            <div style={{height:'6px',background:'rgba(255,255,255,0.04)',borderRadius:'3px',overflow:'hidden',marginBottom:'16px',boxShadow:'inset 0 1px 2px rgba(0,0,0,0.4)'}}>
              <div style={{height:'100%',borderRadius:'3px',background:barColor,width:`${pct.toFixed(1)}%`,transition:'width .5s cubic-bezier(.4,0,.2,1)',boxShadow:'0 0 8px rgba(34,197,94,0.2),inset 0 1px 0 rgba(255,255,255,0.12)'}}/>
            </div>

            {/* Três métricas inline */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0',marginBottom:quit?0:'14px',borderRadius:'12px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.09)',background:'rgba(0,0,0,0.2)'}}>
              {[
                {l:'Pago',  v:brl(d.pago),  c:'rgba(34,197,94,0.95)',  w:600},
                {l:'Falta', v:brl(rest),    c:'rgba(251,113,133,0.9)',  w:600},
                {l:'Total', v:brl(d.total), c:'rgba(255,255,255,0.95)', w:800},
              ].map((item,i)=>(
                <div key={item.l} style={{padding:'13px 16px',background:i===1?'rgba(255,255,255,0.02)':'transparent',borderLeft:i>0?'1px solid rgba(255,255,255,0.07)':'none'}}>
                  <div style={{fontSize:'10px',fontWeight:600,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'5px',fontFamily:F}}>{item.l}</div>
                  <div style={{fontSize:'14px',fontWeight:item.w,color:item.c,fontFamily:F,letterSpacing:'-.3px'}}>{item.v}</div>
                </div>
              ))}
            </div>

            {/* Registrar pagamento */}
            {!quit && (
              <div style={{display:'flex',gap:'10px',alignItems:'flex-end'}}>
                <div style={{flex:1}}>
                  <label style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.3)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'6px',display:'block',fontFamily:F}}>Registrar pagamento</label>
                  <input type="number" min="0" step="0.01" placeholder={`Máx. ${brl(rest)}`} value={pags[d.id]||''} onChange={e=>setPags(p=>({...p,[d.id]:e.target.value}))} style={{...inp,background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.12)',fontSize:'15px'}} onFocus={e=>foc(e,G)} onBlur={blr}/>
                </div>
                <button onClick={()=>pay(d.id)} disabled={!pags[d.id]||Number(pags[d.id])<=0} style={{padding:'12px 20px',borderRadius:'12px',border:'none',background:!pags[d.id]||Number(pags[d.id])<=0?'rgba(34,197,94,0.12)':G,color:!pags[d.id]||Number(pags[d.id])<=0?'rgba(34,197,94,0.35)':'#000',fontSize:'13px',fontWeight:800,cursor:!pags[d.id]||Number(pags[d.id])<=0?'not-allowed':'pointer',fontFamily:F,whiteSpace:'nowrap',transition:'all .15s',flexShrink:0}}>
                  Registrar
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── METAS ─────────────────────────────────────────────────────────────────────
const GOALS = [
  {
    id:1, title:'Viagem para Paris', desc:'Férias dos sonhos',
    atual:8500, meta:15000, prazo:'31/12/2025',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="rgba(34,197,94,0.85)"/>
      </svg>
    ),
  },
  {
    id:2, title:'Notebook Novo', desc:'Trabalho e estudo',
    atual:2800, meta:5000, prazo:'15/08/2025',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="13" rx="2" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5"/>
        <rect x="4" y="6" width="16" height="9" rx="1" fill="rgba(34,197,94,0.08)"/>
        <path d="M1 19h22" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 17l-1 2M15 17l1 2" stroke="rgba(34,197,94,0.4)" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id:3, title:'Reserva de emergência', desc:'Fundo para imprevistos',
    atual:12000, meta:20000, prazo:'30/06/2026',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7l-9-5z" fill="rgba(34,197,94,0.15)" stroke="rgba(34,197,94,0.6)" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="rgba(34,197,94,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

// Ícone 3D para a meta — quadrado com gradiente e profundidade
const GoalIcon = ({ g }: { g: typeof GOALS[0] }) => (
  <div style={{ width:52, height:52, borderRadius:'15px', flexShrink:0, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
    <div style={{ position:'absolute', inset:0, borderRadius:'15px', background:'linear-gradient(145deg,rgba(34,197,94,0.14) 0%,rgba(34,197,94,0.04) 100%)', border:'1px solid rgba(34,197,94,0.2)', boxShadow:'0 8px 24px rgba(34,197,94,0.1),inset 0 1px 0 rgba(34,197,94,0.25)' }}/>
    <div style={{ position:'absolute', top:0, left:'10%', right:'10%', height:'45%', background:'linear-gradient(180deg,rgba(34,197,94,0.15) 0%,transparent 100%)', borderRadius:'15px 15px 0 0' }}/>
    <div style={{ position:'relative', zIndex:1 }}>{g.icon}</div>
  </div>
)

const TabMetas = () => {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:'14px', fontWeight:700, color:'#fff', fontFamily:F }}>{GOALS.length} metas ativas</div>
          <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', fontFamily:F, marginTop:'1px' }}>Acompanhe seu progresso</div>
        </div>
        <button style={{ display:'flex', alignItems:'center', gap:'6px', padding:'10px 18px', borderRadius:'12px', border:'1px solid rgba(34,197,94,0.3)', background:'rgba(34,197,94,0.12)', color:'#fff', fontSize:'13px', fontWeight:700, cursor:'pointer', fontFamily:F, boxShadow:'0 4px 14px rgba(0,0,0,0.3)' }}>
          <IcPlus/> Nova meta
        </button>
      </div>

      {/* Cards */}
      {GOALS.map(g => {
        const pct = Math.min((g.atual / g.meta) * 100, 100)
        const falta = g.meta - g.atual
        const mesesRestantes = Math.ceil(falta / 500)

        return (
          <div key={g.id} style={{ background:'#191a1d', border:`1px solid rgba(255,255,255,0.09)`, borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.35)', transition:'all .2s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.boxShadow='0 8px 32px rgba(0,0,0,0.45)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.09)'; (e.currentTarget as HTMLElement).style.boxShadow='0 4px 20px rgba(0,0,0,0.35)' }}>

            {/* Faixa colorida no topo */}
            <div style={{ height:'1px', background:'linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0.12) 40%,rgba(255,255,255,0.06) 100%)' }}/>

            <div style={{ padding:'20px 22px' }}>
              {/* Header do card */}
              <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'18px' }}>
                <GoalIcon g={g}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'16px', fontWeight:700, color:'#fff', fontFamily:F, marginBottom:'2px' }}>{g.title}</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.38)', fontFamily:F }}>{g.desc}</div>
                </div>
                {/* % com efeito visual */}
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontSize:'28px', fontWeight:900, color:'#fff', fontFamily:F, letterSpacing:'-1.5px', lineHeight:1, textShadow:'0 0 20px rgba(34,197,94,0.25)' }}>
                    {pct.toFixed(0)}<span style={{ fontSize:'16px', opacity:.6 }}>%</span>
                  </div>
                  <div style={{ fontSize:'10px', color:'rgba(255,255,255,0.3)', fontFamily:F, marginTop:'2px' }}>concluído</div>
                </div>
              </div>

              {/* Barra de progresso 3D */}
              <div style={{ height:'8px', background:'rgba(255,255,255,0.06)', borderRadius:'4px', overflow:'hidden', marginBottom:'16px', boxShadow:'inset 0 1px 3px rgba(0,0,0,0.4)' }}>
                <div style={{ height:'100%', borderRadius:'4px', width:`${pct.toFixed(1)}%`, transition:'width .6s cubic-bezier(.4,0,.2,1)', position:'relative', background:'linear-gradient(90deg,rgba(34,197,94,0.25) 0%,rgba(34,197,94,0.55) 100%)',boxShadow:'0 0 8px rgba(34,197,94,0.2),inset 0 1px 0 rgba(255,255,255,0.15)' }}>
                  {/* brilho interno na barra */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%', background:'rgba(255,255,255,0.2)', borderRadius:'4px 4px 0 0' }}/>
                </div>
              </div>

              {/* Métricas inline */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(255,255,255,0.07)', marginBottom:'14px', background:'rgba(0,0,0,0.18)' }}>
                {[
                  { l:'Guardado', v:brl(g.atual),  c:'rgba(34,197,94,0.95)',  w:600 },
                  { l:'Falta',    v:brl(falta),     c:'rgba(251,113,133,0.9)', w:600 },
                  { l:'Meta',     v:brl(g.meta),    c:'rgba(255,255,255,0.95)',w:800 },
                ].map((item, i) => (
                  <div key={item.l} style={{ padding:'12px 14px', borderLeft:i>0?'1px solid rgba(255,255,255,0.07)':'none' }}>
                    <div style={{ fontSize:'10px', fontWeight:600, color:'rgba(255,255,255,0.3)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'5px', fontFamily:F }}>{item.l}</div>
                    <div style={{ fontSize:'13px', fontWeight:item.w, color:item.c, fontFamily:F, letterSpacing:'-.3px' }}>{item.v}</div>
                  </div>
                ))}
              </div>

              {/* Footer — prazo + estimativa */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'5px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.35)', fontFamily:F }}>
                    Prazo: <strong style={{ color:'rgba(255,255,255,0.6)', fontWeight:600 }}>{g.prazo}</strong>
                  </span>
                </div>
                <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.3)', fontFamily:F }}>
                  ≈ <strong style={{ color:'rgba(255,255,255,0.5)' }}>{mesesRestantes}</strong> meses
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── CONFIG ────────────────────────────────────────────────────────────────────
const TabConfig = ({user,onLogout}:{user:{name?:string;email?:string}|null;onLogout:()=>void}) => {
  const [name,setName]=useState(user?.name||'')
  const [sal,setSal]=useState('5200')
  const [togs,setTogs]=useState([true,true,false])
  const initial = (user?.name||name).charAt(0).toUpperCase()

  const Toggle = ({on,i}:{on:boolean;i:number}) => (
    <div onClick={()=>setTogs(t=>t.map((v,j)=>j===i?!v:v))}
      style={{width:46,height:26,borderRadius:'100px',cursor:'pointer',transition:'background .2s',flexShrink:0,background:on?G:'rgba(255,255,255,0.1)',position:'relative',boxShadow:on?'0 0 12px rgba(34,197,94,0.3)':'none'}}>
      <div style={{position:'absolute',top:'3px',width:'20px',height:'20px',borderRadius:'50%',background:'#fff',transition:'left .2s',left:on?'23px':'3px',boxShadow:'0 1px 4px rgba(0,0,0,0.4)'}}/>
    </div>
  )

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>

      {/* ── Perfil hero ── */}
      <div style={{background:'#191a1d',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'20px',overflow:'hidden',boxShadow:'0 4px 24px rgba(0,0,0,0.4)'}}>
        {/* Banner topo com gradiente e grid */}
        <div style={{height:'80px',background:'linear-gradient(135deg,#0f1f12 0%,#112414 60%,#081509 100%)',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(34,197,94,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.06) 1px,transparent 1px)',backgroundSize:'24px 20px'}}/>
          <div style={{position:'absolute',bottom:'-30px',left:'28px',right:0,top:0,background:'radial-gradient(ellipse 50% 100% at 20% 50%,rgba(34,197,94,0.12) 0%,transparent 70%)'}}/>
          {/* Partículas decorativas */}
          {[[72,20,'rgba(34,197,94,0.5)'],[120,45,'rgba(34,197,94,0.3)'],[200,15,'rgba(34,197,94,0.2)'],[340,35,'rgba(34,197,94,0.15)'],[450,25,'rgba(34,197,94,0.25)']].map(([x,y,col],i)=>(
            <div key={i} style={{position:'absolute',left:x,top:y,width:'4px',height:'4px',borderRadius:'50%',background:col as string}}/>
          ))}
        </div>

        <div style={{padding:'0 28px 24px',marginTop:'-28px',position:'relative'}}>
          {/* Avatar */}
          <div style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',marginBottom:'16px'}}>
            <div style={{width:60,height:60,borderRadius:'50%',background:G,display:'flex',alignItems:'center',justifyContent:'center',color:'#000',fontSize:'24px',fontWeight:900,fontFamily:F,border:'3px solid #191a1d',boxShadow:'0 0 0 1px rgba(34,197,94,0.3),0 8px 24px rgba(0,0,0,0.5)',flexShrink:0}}>
              {initial}
            </div>
            <span style={{display:'inline-flex',alignItems:'center',gap:'5px',fontSize:'11px',background:'rgba(34,197,94,0.1)',color:G,border:'1px solid rgba(34,197,94,0.22)',padding:'4px 12px',borderRadius:'100px',fontWeight:700,fontFamily:F,marginBottom:'4px'}}>
              <span style={{width:'5px',height:'5px',borderRadius:'50%',background:G,boxShadow:'0 0 6px rgba(34,197,94,0.8)',display:'inline-block'}}/>
              Plano Pro ativo
            </span>
          </div>

          <div style={{marginBottom:'16px'}}>
            <div style={{fontSize:'18px',fontWeight:800,color:'#fff',fontFamily:F,letterSpacing:'-.3px'}}>{user?.name||name}</div>
            <div style={{fontSize:'13px',color:'rgba(255,255,255,0.38)',fontFamily:F,marginTop:'2px'}}>{user?.email}</div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'16px'}}>
            {[
              {label:'Nome completo', value:name, onChange:(v:string)=>setName(v), disabled:false, placeholder:'Seu nome'},
              {label:'E-mail', value:user?.email||'', onChange:()=>{}, disabled:true, placeholder:''},
            ].map(f=>(
              <div key={f.label}>
                <label style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.38)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'7px',display:'block',fontFamily:F}}>{f.label}</label>
                <input value={f.value} onChange={e=>f.onChange(e.target.value)} disabled={f.disabled} placeholder={f.placeholder} style={{...inp,background:f.disabled?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.06)',opacity:f.disabled?.5:1,cursor:f.disabled?'not-allowed':'text',borderColor:'rgba(255,255,255,0.1)'}} onFocus={e=>!f.disabled&&foc(e)} onBlur={blr}/>
              </div>
            ))}
          </div>
          <button style={{padding:'11px 22px',borderRadius:'12px',border:'1px solid rgba(34,197,94,0.3)',background:'rgba(34,197,94,0.12)',color:'#fff',fontWeight:700,cursor:'pointer',fontFamily:F,fontSize:'13px',transition:'all .15s'}}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(34,197,94,0.18)';(e.currentTarget as HTMLElement).style.borderColor='rgba(34,197,94,0.4)'}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(34,197,94,0.1)';(e.currentTarget as HTMLElement).style.borderColor='rgba(34,197,94,0.25)'}}>
            Salvar alterações
          </button>
        </div>
      </div>

      {/* ── Financeiro + Plano ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>

        {/* Salário */}
        <div style={{background:'#191a1d',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'20px',padding:'22px',boxShadow:'0 4px 20px rgba(0,0,0,0.35)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'18px'}}>
            <div style={{width:38,height:38,borderRadius:'11px',background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.85)" strokeWidth="1.75" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <div>
              <div style={{fontSize:'14px',fontWeight:700,color:'#fff',fontFamily:F}}>Salário mensal</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',fontFamily:F}}>Base para o limite diário</div>
            </div>
          </div>
          <label style={{fontSize:'11px',fontWeight:600,color:'rgba(255,255,255,0.38)',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:'7px',display:'block',fontFamily:F}}>Valor (R$)</label>
          <input type="number" value={sal} onChange={e=>setSal(e.target.value)} style={{...inp,background:'rgba(255,255,255,0.06)',borderColor:'rgba(255,255,255,0.1)',marginBottom:'14px'}} onFocus={e=>foc(e)} onBlur={blr}/>
          <div style={{padding:'10px 14px',background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.12)',borderRadius:'10px',marginBottom:'14px',display:'flex',alignItems:'center',gap:'8px'}}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.7)" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{fontSize:'12px',color:'rgba(255,255,255,0.38)',fontFamily:F}}>Limite diário: <strong style={{color:'rgba(34,197,94,0.8)'}}>{brl(Number(sal)/30)}</strong></span>
          </div>
          <button style={{width:'100%',padding:'12px',borderRadius:'12px',border:'1px solid rgba(34,197,94,0.25)',background:'rgba(34,197,94,0.1)',color:'#fff',fontWeight:700,cursor:'pointer',fontFamily:F,fontSize:'13px'}}>Salvar</button>
        </div>

        {/* Plano Pro */}
        <div style={{background:'#191a1d',border:'1px solid rgba(34,197,94,0.15)',borderRadius:'20px',padding:'22px',boxShadow:'0 4px 20px rgba(0,0,0,0.35)',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',top:'-20px',right:'-20px',width:'120px',height:'120px',background:'radial-gradient(circle,rgba(34,197,94,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'18px'}}>
            <div style={{width:38,height:38,borderRadius:'11px',background:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="rgba(34,197,94,0.85)"/></svg>
            </div>
            <div>
              <div style={{fontSize:'14px',fontWeight:700,color:'#fff',fontFamily:F}}>Plano Pro</div>
              <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',fontFamily:F}}>R$ 19,90/mês · ativo</div>
            </div>
            <span style={{marginLeft:'auto',display:'inline-flex',alignItems:'center',gap:'5px',fontSize:'10px',background:'rgba(34,197,94,0.1)',color:G,border:'1px solid rgba(34,197,94,0.2)',padding:'3px 10px',borderRadius:'100px',fontWeight:700,fontFamily:F}}>
              <span style={{width:'4px',height:'4px',borderRadius:'50%',background:G,display:'inline-block'}}/>Ativo
            </span>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'0',borderRadius:'12px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.07)'}}>
            {[
              {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.8)" strokeWidth="1.75" strokeLinecap="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>,label:'Metas financeiras',desc:'Acompanhe objetivos'},
              {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.8)" strokeWidth="1.75" strokeLinecap="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,label:'Score financeiro',desc:'Avalie sua saúde financeira'},
              {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.8)" strokeWidth="1.75" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,label:'Relatórios PDF',desc:'Exporte seus dados'},
              {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.8)" strokeWidth="1.75" strokeLinecap="round"><polyline points="21 15 21 21 3 21 3 15"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,label:'Exportação CSV',desc:'Integre com planilhas'},
              {icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.8)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,label:'Alertas inteligentes',desc:'Notificações personalizadas'},
            ].map((f,i)=>(
              <div key={f.label} style={{display:'flex',alignItems:'center',gap:'10px',padding:'10px 14px',background:i%2===0?'rgba(255,255,255,0.015)':'transparent',borderBottom:i<4?'1px solid rgba(255,255,255,0.05)':'none'}}>
                <span style={{fontSize:'14px'}}>{f.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.75)',fontFamily:F}}>{f.label}</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.7)" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notificações ── */}
      <div style={{background:'#191a1d',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'20px',padding:'22px',boxShadow:'0 4px 20px rgba(0,0,0,0.35)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'18px'}}>
          <div style={{width:38,height:38,borderRadius:'11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          </div>
          <div>
            <div style={{fontSize:'14px',fontWeight:700,color:'#fff',fontFamily:F}}>Notificações</div>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.35)',fontFamily:F}}>Gerencie seus alertas</div>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:'0',borderRadius:'14px',overflow:'hidden',border:'1px solid rgba(255,255,255,0.07)'}}>
          {[
            {label:'Alertas de limite diário',desc:'Avisar quando estiver próximo do limite de gastos',i:0},
            {label:'Resumo semanal',desc:'Receba um resumo toda segunda-feira por e-mail',i:1},
            {label:'Metas atingidas',desc:'Celebrar ao atingir uma meta financeira',i:2},
          ].map(({label,desc,i})=>(
            <div key={label} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 18px',background:i%2===0?'rgba(255,255,255,0.015)':'transparent',borderBottom:i<2?'1px solid rgba(255,255,255,0.06)':'none'}}>
              <div style={{flex:1,minWidth:0,paddingRight:'16px'}}>
                <div style={{fontSize:'13px',fontWeight:600,color:'rgba(255,255,255,0.85)',fontFamily:F,marginBottom:'2px'}}>{label}</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.32)',fontFamily:F}}>{desc}</div>
              </div>
              <Toggle on={togs[i]} i={i}/>
            </div>
          ))}
        </div>
      </div>

      {/* ── Segurança + Sobre ── */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>

        <div style={{background:'#191a1d',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'20px',padding:'22px',boxShadow:'0 4px 20px rgba(0,0,0,0.35)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'18px'}}>
            <div style={{width:38,height:38,borderRadius:'11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            </div>
            <div style={{fontSize:'14px',fontWeight:700,color:'#fff',fontFamily:F}}>Segurança</div>
          </div>
          {[['Alterar senha','••••••••'],['Autenticação 2FA','Não configurado']].map(([l,v],i)=>(
            <div key={l} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 14px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'11px',marginBottom:i===0?'8px':'0',cursor:'pointer',transition:'all .15s'}}
              onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.13)'}}
              onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.07)'}}>
              <div>
                <div style={{fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.7)',fontFamily:F}}>{l}</div>
                <div style={{fontSize:'11px',color:'rgba(255,255,255,0.3)',fontFamily:F,marginTop:'1px'}}>{v}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))}
        </div>

        <div style={{background:'#191a1d',border:'1px solid rgba(255,255,255,0.09)',borderRadius:'20px',padding:'22px',boxShadow:'0 4px 20px rgba(0,0,0,0.35)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'18px'}}>
            <div style={{width:38,height:38,borderRadius:'11px',background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div style={{fontSize:'14px',fontWeight:700,color:'#fff',fontFamily:F}}>Sobre o ZetaFin</div>
          </div>
          {[['Versão','1.0.0'],['Desenvolvido por','Lucas Gabriel Likes'],['Stack','React + Firebase'],['Lançamento','2025']].map(([l,v],i)=>(
            <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:i<3?'1px solid rgba(255,255,255,0.05)':'none'}}>
              <span style={{fontSize:'12px',color:'rgba(255,255,255,0.35)',fontFamily:F}}>{l}</span>
              <span style={{fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.65)',fontFamily:F}}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Botão sair ── */}
      <button onClick={onLogout} style={{width:'100%',padding:'14px',borderRadius:'14px',border:'1px solid rgba(251,113,133,0.2)',background:'rgba(251,113,133,0.06)',color:'rgba(251,113,133,0.8)',fontSize:'14px',fontWeight:700,cursor:'pointer',fontFamily:F,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',transition:'all .15s'}}
        onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(251,113,133,0.12)';(e.currentTarget as HTMLElement).style.borderColor='rgba(251,113,133,0.35)';(e.currentTarget as HTMLElement).style.color='rgba(251,113,133,1)'}}
        onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(251,113,133,0.06)';(e.currentTarget as HTMLElement).style.borderColor='rgba(251,113,133,0.2)';(e.currentTarget as HTMLElement).style.color='rgba(251,113,133,0.8)'}}>
        <IcLogout/> Sair da conta
      </button>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────
export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()
  const finance = useFinance()
  const [tab, setTab] = useState<Tab>('home')
  const [modal, setModal] = useState(false)
  const mainRef = useRef<HTMLDivElement>(null)
  const goTab = (t: Tab) => { setTab(t); setTimeout(()=>{ if(mainRef.current) mainRef.current.scrollTop=0 },0) }
  const handleLogout = () => { logout(); navigate('/') }
  const saveTx = useCallback(async(tx:Omit<Transaction,'id'>)=>{ await finance.addTransaction(tx) },[finance])
  const LABELS: Record<Tab,string> = { home:'Dashboard', historico:'Histórico', dividas:'Dívidas', metas:'Metas', config:'Config' }
  const userName = user?.name?.split(' ')[0] || 'Usuário'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;overflow:hidden;background:#111113;color:#fff}
        body{font-family:'Plus Jakarta Sans',system-ui,sans-serif}
        @keyframes pulse{0%,100%{opacity:.4}50%{opacity:.7}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:translateY(0)}}
        .ta{animation:fadeUp .2s ease both}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px}
        select option{background:#111;color:#fff}

        /* ── Sidebar ── */
        .sidebar-desk{display:flex!important}
        .show-desk{display:block!important}
        .show-mob{display:none!important}
        .topbar-pill{display:flex!important}
        .mobile-topbar-pill{display:none!important}
        .mobile-botnav{display:none!important}
        .row-main{grid-template-columns:1fr 1fr}

        /* ── LED navbar — idêntico ao landing ── */
        @keyframes navLed{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .navbar-led{
          position:relative;
          background:rgba(8,8,8,0.88) !important;
          backdrop-filter:blur(24px);
          border:1px solid rgba(255,255,255,0.08) !important;
          box-shadow:none !important;
          animation:none !important;
        }
        .navbar-led::after{
          content:'';
          position:absolute;
          inset:-1px;
          border-radius:100px;
          background:linear-gradient(90deg,transparent 0%,rgba(34,197,94,0) 20%,rgba(34,197,94,.8) 50%,rgba(34,197,94,0) 80%,transparent 100%);
          background-size:200% 100%;
          animation:navLed 3s linear infinite;
          pointer-events:none;
          z-index:-1;
          padding:1px;
          -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
          -webkit-mask-composite:xor;
          mask-composite:exclude;
        }



        @media(max-width:768px){
          .sidebar-desk{display:none!important}
          .topbar-pill{display:none!important}
          .mobile-topbar-pill{display:flex!important}
          .mobile-botnav{display:flex!important}
          .show-desk{display:none!important}
          .show-mob{display:block!important}
          .mob-pad{padding-bottom:88px!important}
          .mob-content-pad{padding:12px 14px!important}
        }
      `}</style>

      <div style={{position:'fixed',inset:0,display:'flex',background:'#111113',backgroundImage:'radial-gradient(ellipse 55% 40% at 20% 8%, rgba(34,197,94,0.045) 0%, transparent 65%), radial-gradient(ellipse 45% 35% at 80% 85%, rgba(59,130,246,0.03) 0%, transparent 60%), linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',backgroundSize:'100% 100%, 100% 100%, 48px 48px, 48px 48px'}}>

        {/* Sidebar desktop */}
        <Sidebar tab={tab} goTab={goTab} user={user} onLogout={handleLogout}/>

        {/* Coluna direita */}
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0,background:'transparent'}}>

          {/* Topbar desktop — pill arredondada */}
          <div className="topbar-pill" style={{flexShrink:0,padding:'14px 20px 10px',alignItems:'center',justifyContent:'center',background:'transparent'}}>
            <div className="navbar-led" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px',borderRadius:'100px'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:15,fontWeight:800,color:C.text,letterSpacing:'-.4px',fontFamily:F}}>{LABELS[tab]}</span>
                <span style={{fontSize:13,color:'rgba(255,255,255,0.15)'}}>·</span>
                <span style={{fontSize:12,color:C.muted,fontFamily:F}}>{new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <button style={{width:32,height:32,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:`1px solid ${C.border}`,color:C.muted,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><IcBell/></button>
                {(tab==='home'||tab==='historico')&&<button onClick={()=>setModal(true)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 16px',borderRadius:'100px',border:'1px solid rgba(34,197,94,0.35)',background:'rgba(34,197,94,0.12)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',fontFamily:F}}><IcPlus/>Nova transação</button>}
                <div style={{width:32,height:32,borderRadius:'50%',background:G,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#000',fontFamily:F,flexShrink:0}}>{user?.name?.charAt(0).toUpperCase()??'?'}</div>
              </div>
            </div>
          </div>

          {/* Topbar mobile pill */}
          <div className="mobile-topbar-pill" style={{flexShrink:0,padding:'12px 14px 8px',alignItems:'center',justifyContent:'center',background:'transparent'}}>
            <div className="navbar-led" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 16px',borderRadius:'100px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <div style={{width:28,height:28,borderRadius:'8px',background:G,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:900,color:'#000',fontFamily:F}}>Z</div>
                <span style={{fontSize:13,fontWeight:800,color:C.text,fontFamily:F}}>ZetaFin</span>
                <span style={{fontSize:11,color:'rgba(255,255,255,0.2)'}}>·</span>
                <span style={{fontSize:12,fontWeight:600,color:C.muted,fontFamily:F}}>{LABELS[tab]}</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <button style={{width:28,height:28,borderRadius:'50%',background:'rgba(255,255,255,0.06)',border:`1px solid ${C.border}`,color:C.muted,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer'}}><IcBell/></button>
                {(tab==='home'||tab==='historico')&&<button onClick={()=>setModal(true)} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 12px',borderRadius:'100px',border:'1px solid rgba(34,197,94,0.35)',background:'rgba(34,197,94,0.12)',color:'#fff',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:F}}><IcPlus/>Nova</button>}
                <div style={{width:28,height:28,borderRadius:'50%',background:G,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:900,color:'#000',fontFamily:F,flexShrink:0}}>{user?.name?.charAt(0).toUpperCase()??'?'}</div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div ref={mainRef} className="mob-pad mob-content-pad" style={{flex:1,overflowY:'auto',overflowX:'hidden',padding:'16px 22px'}}>
            <div key={tab} className="ta">
              <div className="show-desk">
                {tab==='home'      && <TabHome      finance={finance} onAdd={()=>setModal(true)} onGo={goTab} userName={userName}/>}
                {tab==='historico' && <TabHistorico finance={finance} onAdd={()=>setModal(true)}/>}
                {tab==='dividas'   && <TabDividas   finance={finance}/>}
                {tab==='metas'     && <TabMetas/>}
                {tab==='config'    && <TabConfig    user={user} onLogout={handleLogout}/>}
              </div>
              <div className="show-mob">
                {tab==='home'      && <TabHomeMobile finance={finance} onAdd={()=>setModal(true)} onGo={goTab} userName={userName}/>}
                {tab==='historico' && <TabHistorico  finance={finance} onAdd={()=>setModal(true)}/>}
                {tab==='dividas'   && <TabDividas    finance={finance}/>}
                {tab==='metas'     && <TabMetas/>}
                {tab==='config'    && <TabConfig     user={user} onLogout={handleLogout}/>}
              </div>
            </div>
          </div>

          {/* Bottom nav mobile pill */}
          <div className="mobile-botnav" style={{flexShrink:0,padding:'0 14px 14px',alignItems:'center',justifyContent:'center'}}>
            <div className="navbar-led" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-around',padding:'8px 12px',borderRadius:'100px'}}>
              {TABS.map(({id,label,Icon})=>{
                const active=tab===id
                return(<button key={id} onClick={()=>goTab(id)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,background:active?'rgba(34,197,94,0.1)':'none',border:'none',borderRadius:'100px',padding:'8px 4px',color:active?G:C.muted2,fontSize:10,fontWeight:active?700:500,cursor:'pointer',fontFamily:F,transition:'all .2s',minWidth:0}}>
                  <Icon/><span style={{fontSize:10,whiteSpace:'nowrap'}}>{label}</span>
                </button>)
              })}
            </div>
          </div>
        </div>
      </div>

      {modal&&<TxModal onClose={()=>setModal(false)} onSave={saveTx}/>}
    </>
  )
}

export default DashboardPage