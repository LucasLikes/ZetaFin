import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight:'100vh', background:'#080713', fontFamily:"system-ui,sans-serif", color:'white' }}>
      <header style={{ background:'rgba(12,12,22,.9)', backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(139,92,246,.2)', padding:'16px 24px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:700, margin:0 }}>ZetaFin</h1>
          <p style={{ color:'rgba(156,163,175,.65)', fontSize:'13px', margin:0 }}>Bem-vindo, {user?.name}!</p>
        </div>
        <button
          onClick={handleLogout}
          style={{ padding:'8px 16px', borderRadius:'9px', background:'rgba(239,68,68,.1)', color:'#f87171', border:'1px solid rgba(239,68,68,.25)', cursor:'pointer', fontSize:'13px', fontFamily:'inherit' }}
        >
          Sair
        </button>
      </header>

      <main style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 24px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px' }}>
          {[
            { label:'Saldo atual', value:'R$ 2.300,00', color:'rgba(139,92,246,.2)' },
            { label:'Gastos do mês', value:'R$ 450,00', color:'rgba(239,68,68,.15)' },
            { label:'Economias', value:'R$ 1.850,00', color:'rgba(34,197,94,.15)' },
          ].map((card, i) => (
            <div key={i} style={{ background:card.color, border:'1px solid rgba(255,255,255,.08)', borderRadius:'16px', padding:'20px' }}>
              <p style={{ color:'rgba(156,163,175,.7)', fontSize:'13px', margin:'0 0 8px' }}>{card.label}</p>
              <p style={{ fontSize:'22px', fontWeight:700, margin:0 }}>{card.value}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop:'32px', background:'rgba(12,12,22,.8)', border:'1px solid rgba(139,92,246,.15)', borderRadius:'16px', padding:'32px', textAlign:'center' }}>
          <p style={{ color:'rgba(156,163,175,.6)', fontSize:'15px' }}>
            🚀 Dashboard completo em construção...
          </p>
        </div>
      </main>
    </div>
  )
}