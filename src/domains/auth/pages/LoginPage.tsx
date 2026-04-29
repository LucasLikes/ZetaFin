import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'

/* ── ícones inline ─────────────────────────────────────────── */

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const EyeOpenIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

const Spinner = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" style={{ animation: 'spin .7s linear infinite', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity=".25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
)

/* ── estilos base compartilhados ───────────────────────────── */

const S = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse 80% 60% at 50% -5%, rgba(139,92,246,.22) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 85% 95%, rgba(6,182,212,.12) 0%, transparent 60%), #080713',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    position: 'relative' as const,
    overflow: 'hidden',
    fontFamily: "system-ui, 'Segoe UI', Roboto, sans-serif",
  } as React.CSSProperties,

  card: {
    background: 'rgba(12,12,22,.9)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(139,92,246,.2)',
    borderRadius: '22px',
    padding: '36px 32px',
    boxShadow: '0 32px 64px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.03)',
    width: '100%',
    maxWidth: '420px',
  } as React.CSSProperties,

  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '11px',
    background: 'rgba(255,255,255,.04)',
    border: '1px solid rgba(255,255,255,.09)',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color .2s',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    color: 'rgba(209,213,219,.85)',
    marginBottom: '7px',
  } as React.CSSProperties,

  btnPrimary: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
    border: 'none',
    borderRadius: '11px',
    color: 'white',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 8px 24px rgba(139,92,246,.35)',
    transition: 'all .2s',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  btnGoogle: {
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,.05)',
    border: '1px solid rgba(255,255,255,.1)',
    borderRadius: '11px',
    color: 'white',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all .2s',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  } as React.CSSProperties,
}

/* ── componente ────────────────────────────────────────────── */

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loginWithGoogle, isLoading, error } = useAuthContext()

  const [email, setEmail]           = useState('user@example.com')
  const [password, setPassword]     = useState('123456')
  const [showPwd, setShowPwd]       = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [success, setSuccess]       = useState(false)

  const displayError = localError || error

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    try {
      await login(email, password)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 700)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  const handleGoogle = async () => {
    setLocalError(null)
    try {
      await loginWithGoogle()
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 700)
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erro com Google')
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .zetafin-input:focus { border-color: rgba(139,92,246,.65) !important; }
        .zetafin-input::placeholder { color: rgba(107,114,128,.5); }
        .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(139,92,246,.45) !important; }
        .btn-primary:active:not(:disabled) { transform: scale(.98); }
        .btn-google:hover:not(:disabled) { background: rgba(255,255,255,.08) !important; border-color: rgba(255,255,255,.18) !important; }
        .fade-in { animation: fadeIn .35s ease-out both; }
      `}</style>

      <div style={S.page}>
        {/* grid bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: .025, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,1) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        {/* orbs */}
        <div style={{ position:'absolute', top:'-120px', right:'-80px', width:'500px', height:'500px', borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,.15) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-80px', left:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'radial-gradient(circle,rgba(6,182,212,.1) 0%,transparent 70%)', pointerEvents:'none' }} />

        <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>

          {/* logo */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '14px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 24px rgba(139,92,246,.45)',
                fontSize: '22px', fontWeight: 800, color: 'white',
              }}>Ζ</div>
              <span style={{
                fontSize: '26px', fontWeight: 800, letterSpacing: '-.5px',
                background: 'linear-gradient(90deg, #c4b5fd 0%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>ZetaFin</span>
            </div>
            <p style={{ color: 'rgba(156,163,175,.6)', fontSize: '13px', marginTop: '7px' }}>
              Inteligência financeira no seu bolso
            </p>
          </div>

          {/* card */}
          <div style={S.card}>
            <h1 style={{ fontSize: '21px', fontWeight: 700, color: 'white', margin: '0 0 4px', letterSpacing: '-.3px' }}>
              Bem-vindo de volta
            </h1>
            <p style={{ color: 'rgba(156,163,175,.65)', fontSize: '14px', margin: '0 0 26px' }}>
              Entre na sua conta para continuar
            </p>

            {/* erro */}
            {displayError && (
              <div className="fade-in" style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.25)', borderRadius:'11px', padding:'11px 14px', marginBottom:'18px', fontSize:'13px', color:'#f87171' }}>
                ⚠ {displayError}
              </div>
            )}

            {/* sucesso */}
            {success && (
              <div className="fade-in" style={{ background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.25)', borderRadius:'11px', padding:'11px 14px', marginBottom:'18px', fontSize:'13px', color:'#4ade80' }}>
                ✓ Login realizado! Redirecionando...
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>

              {/* email */}
              <div>
                <label style={S.label}>Email</label>
                <input
                  className="zetafin-input"
                  type="email" required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={S.input}
                />
              </div>

              {/* senha */}
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'7px' }}>
                  <label style={{ ...S.label, marginBottom: 0 }}>Senha</label>
                  <span style={{ color:'rgba(139,92,246,.85)', fontSize:'12px', fontWeight:500, cursor:'pointer' }}>
                    Esqueceu a senha?
                  </span>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className="zetafin-input"
                    type={showPwd ? 'text' : 'password'} required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...S.input, paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'rgba(156,163,175,.55)', display:'flex', padding:'4px' }}
                  >
                    {showPwd ? <EyeOpenIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>

              {/* lembrar */}
              <label style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }}>
                <div
                  onClick={() => setRememberMe(v => !v)}
                  style={{
                    width:'18px', height:'18px', borderRadius:'5px', flexShrink:0,
                    background: rememberMe ? 'linear-gradient(135deg,#8b5cf6,#06b6d4)' : 'rgba(255,255,255,.05)',
                    border: rememberMe ? 'none' : '1px solid rgba(255,255,255,.14)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor:'pointer', transition:'all .2s',
                    color:'white', fontSize:'11px', fontWeight:700,
                  }}
                >
                  {rememberMe && '✓'}
                </div>
                <span style={{ fontSize:'13px', color:'rgba(156,163,175,.65)', userSelect:'none' }}>
                  Lembrar por 30 dias
                </span>
              </label>

              {/* botão entrar */}
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading || success}
                style={{ ...S.btnPrimary, opacity: (isLoading || success) ? .7 : 1, marginTop: '4px' }}
              >
                {isLoading ? <><Spinner /> Entrando...</> : success ? '✓ Entrando...' : 'Entrar na conta'}
              </button>
            </form>

            {/* divider */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', margin:'22px 0' }}>
              <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,.07)' }} />
              <span style={{ color:'rgba(107,114,128,.75)', fontSize:'12px', whiteSpace:'nowrap' }}>ou continue com</span>
              <div style={{ flex:1, height:'1px', background:'rgba(255,255,255,.07)' }} />
            </div>

            {/* Google */}
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogle}
              disabled={isLoading || success}
              style={{ ...S.btnGoogle, opacity:(isLoading || success) ? .6 : 1 }}
            >
              {isLoading ? <Spinner /> : <GoogleIcon />}
              Entrar com Google
            </button>

            {/* demo */}
            <div style={{ marginTop:'22px', padding:'14px 16px', background:'rgba(139,92,246,.07)', border:'1px solid rgba(139,92,246,.17)', borderRadius:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
                <span style={{ fontSize:'11px', fontWeight:600, color:'rgba(167,139,250,.85)', letterSpacing:'.08em', textTransform:'uppercase' }}>
                  Conta demo
                </span>
                <button
                  type="button"
                  onClick={() => { setEmail('user@example.com'); setPassword('123456') }}
                  style={{ background:'rgba(139,92,246,.15)', border:'1px solid rgba(139,92,246,.25)', borderRadius:'6px', padding:'3px 10px', color:'rgba(196,181,253,.9)', fontSize:'11px', fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}
                >
                  Preencher
                </button>
              </div>
              <p style={{ fontSize:'12px', color:'rgba(156,163,175,.55)', margin:'2px 0' }}>
                Email: <span style={{ color:'rgba(209,213,219,.75)' }}>user@example.com</span>
              </p>
              <p style={{ fontSize:'12px', color:'rgba(156,163,175,.55)', margin:'2px 0' }}>
                Senha: <span style={{ color:'rgba(209,213,219,.75)' }}>123456</span>
              </p>
            </div>
          </div>

          {/* rodapé */}
          <p style={{ textAlign:'center', marginTop:'20px', fontSize:'12px', color:'rgba(75,85,99,.75)' }}>
            Não tem conta?{' '}
            <span style={{ color:'rgba(167,139,250,.7)', cursor:'pointer', fontWeight:500 }}>
              Criar conta grátis
            </span>
          </p>
        </div>
      </div>
    </>
  )
}