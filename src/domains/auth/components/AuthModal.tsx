import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'

const MODAL_CSS = `
.auth-overlay{position:fixed;inset:0;z-index:900;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;pointer-events:none;transition:opacity .32s ease}
.auth-overlay.open{opacity:1;pointer-events:all}
.auth-backdrop{position:absolute;inset:0;background:rgba(4,4,4,.75);backdrop-filter:blur(18px) saturate(1.2);-webkit-backdrop-filter:blur(18px) saturate(1.2)}
.auth-card{position:relative;z-index:1;width:100%;max-width:420px;background:#0f0f0f;border:1px solid rgba(255,255,255,.1);border-radius:22px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.8),0 0 0 1px rgba(34,197,94,.07);transform:translateY(28px) scale(.97);transition:transform .38s cubic-bezier(.34,1.28,.64,1),opacity .32s ease;opacity:0;max-height:calc(100vh - 32px);display:flex;flex-direction:column;font-family:'Plus Jakarta Sans',sans-serif;-webkit-font-smoothing:antialiased}
.auth-overlay.open .auth-card{transform:translateY(0) scale(1);opacity:1}
.auth-card-glow{position:absolute;top:-60px;left:50%;transform:translateX(-50%);width:280px;height:160px;background:radial-gradient(ellipse,rgba(34,197,94,.12) 0%,transparent 70%);pointer-events:none;z-index:0}
.auth-slider{display:flex;transition:transform .42s cubic-bezier(.77,0,.18,1);width:200%;flex:1;min-height:0}
.auth-slider.on-register{transform:translateX(-50%)}
.auth-panel{width:50%;padding:32px 32px 28px;flex-shrink:0;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}
.auth-panel::-webkit-scrollbar{display:none}
.auth-logo{display:flex;align-items:center;gap:9px;margin-bottom:24px}
.auth-logo-box{width:34px;height:34px;background:#22c55e;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:1rem;color:#000;flex-shrink:0}
.auth-logo-name{font-size:1.05rem;font-weight:800;color:#fff}
.auth-h{font-size:1.5rem;font-weight:800;letter-spacing:-.7px;color:#fff;margin-bottom:6px;line-height:1.15}
.auth-sub{font-size:.86rem;color:rgba(255,255,255,.42);line-height:1.5;margin-bottom:24px}
.auth-field{margin-bottom:13px}
.auth-label{display:block;font-size:.74rem;font-weight:700;color:rgba(255,255,255,.45);margin-bottom:6px;letter-spacing:.3px}
.auth-input-wrap{position:relative;display:flex;align-items:stretch}
.auth-input-wrap>svg:first-child{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,.22);pointer-events:none;z-index:1}
.auth-input{width:100%;padding:13px 13px 13px 38px;background:rgba(255,255,255,.05) !important;border:1px solid rgba(255,255,255,.09) !important;border-radius:11px;color:#fff !important;font-family:inherit;font-size:.9rem;outline:none !important;box-shadow:none !important;transition:border-color .2s,background .2s;-webkit-appearance:none}
.auth-input.has-eye{padding-right:44px}
.auth-input::placeholder{color:rgba(255,255,255,.22) !important}
.auth-input:focus{border-color:rgba(34,197,94,.5) !important;background:rgba(34,197,94,.04) !important;outline:none !important;box-shadow:none !important}
.auth-input.err{border-color:rgba(251,113,133,.5) !important;background:rgba(251,113,133,.04) !important}
.auth-eye{position:absolute;right:0;top:0;bottom:0;width:42px;background:none;border:none;border-radius:0 11px 11px 0;color:rgba(255,255,255,.28);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .2s;z-index:2}
.auth-eye:hover{color:rgba(255,255,255,.65)}
.auth-forgot{text-align:right;margin-top:-6px;margin-bottom:14px}
.auth-forgot a{font-size:.76rem;color:rgba(255,255,255,.3);text-decoration:none;transition:color .2s}
.auth-forgot a:hover{color:#22c55e}
.auth-check-row{display:flex;align-items:flex-start;gap:10px;margin-bottom:20px}
.auth-check-box{width:18px;height:18px;border-radius:5px;border:1.5px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);flex-shrink:0;margin-top:1px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.auth-check-box.checked{background:#22c55e;border-color:#22c55e}
.auth-check-label{font-size:.78rem;color:rgba(255,255,255,.38);line-height:1.5;cursor:pointer}
.auth-check-label a{color:#22c55e;text-decoration:none}
.auth-btn{width:100%;padding:14px;background:#22c55e;color:#000;border:none;border-radius:12px;font-family:inherit;font-size:.95rem;font-weight:800;cursor:pointer;letter-spacing:-.1px;transition:background .2s,transform .15s}
.auth-btn:hover{background:#16a34a;transform:translateY(-1px)}
.auth-btn:active{transform:translateY(0)}
.auth-btn:disabled{opacity:.6;cursor:wait}
.auth-divider{display:flex;align-items:center;gap:10px;margin:18px 0}
.auth-divider::before,.auth-divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,.07)}
.auth-divider span{font-size:.72rem;color:rgba(255,255,255,.22)}
.auth-social{width:100%;padding:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#fff;font-family:inherit;font-size:.88rem;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:9px;transition:all .2s}
.auth-social:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.2)}
.auth-close{position:absolute;top:18px;right:18px;z-index:10;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}
.auth-close:hover{background:rgba(255,255,255,.12);color:#fff}
.auth-signup-hint{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.07);font-size:.83rem;color:rgba(255,255,255,.35)}
.auth-signup-link{display:inline-flex;align-items:center;gap:4px;color:#22c55e;font-weight:700;cursor:pointer;text-decoration:none;background:none;border:none;padding:0;font-size:.83rem;font-family:inherit;transition:gap .2s,color .2s}
.auth-signup-link:hover{color:#4ade80;gap:7px}
.auth-success{display:none;flex-direction:column;align-items:center;justify-content:center;padding:48px 32px;text-align:center}
.auth-success.show{display:flex}
.auth-success-icon{width:68px;height:68px;border-radius:50%;background:rgba(34,197,94,.12);border:2px solid rgba(34,197,94,.3);display:flex;align-items:center;justify-content:center;margin-bottom:18px;animation:popIn .5s cubic-bezier(.34,1.56,.64,1) forwards}
@keyframes popIn{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:1}}
.auth-success h3{font-size:1.35rem;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:8px;font-family:inherit}
.auth-success p{font-size:.86rem;color:rgba(255,255,255,.45);line-height:1.65;max-width:250px;font-family:inherit}
.auth-server-err{margin-bottom:14px;padding:11px 14px;border-radius:10px;background:rgba(251,113,133,.08);border:1px solid rgba(251,113,133,.25);color:#fb7185;font-size:.82rem}
.auth-pass-bars{display:flex;gap:4px;margin-top:7px}
.auth-pass-bar{flex:1;height:3px;border-radius:100px;background:rgba(255,255,255,.08);transition:background .3s}
.auth-pass-label{font-size:.65rem;margin-top:4px;min-height:14px}
@media(max-width:480px){.auth-overlay{padding:0}.auth-card{max-width:100%;border-radius:0;min-height:100svh;max-height:100svh;border:none}.auth-panel{padding:28px 20px 24px}.auth-h{font-size:1.3rem}}
`

interface AuthModalProps {
  initialPanel: 'login' | 'register'
  onClose: () => void
}

export default function AuthModal({ initialPanel, onClose }: AuthModalProps) {
  const navigate = useNavigate()
  const { login, loginWithGoogle, isLoading } = useAuthContext()
  const [panel, setPanel] = useState<'login' | 'register'>(initialPanel)
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState(false)
  const [successName, setSuccessName] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginEmailErr, setLoginEmailErr] = useState(false)
  const [loginPassErr, setLoginPassErr] = useState(false)
  const [loginServerErr, setLoginServerErr] = useState('')
  const [showPassLogin, setShowPassLogin] = useState(false)

  const [regName, setRegName] = useState('')
  const [regCpf, setRegCpf] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass] = useState('')
  const [regNameErr, setRegNameErr] = useState(false)
  const [regCpfErr, setRegCpfErr] = useState(false)
  const [regEmailErr, setRegEmailErr] = useState(false)
  const [regPassErr, setRegPassErr] = useState(false)
  const [regTermsErr, setRegTermsErr] = useState(false)
  const [regServerErr, setRegServerErr] = useState('')
  const [showPassReg, setShowPassReg] = useState(false)
  const [passStrength, setPassStrength] = useState(0)
  const [termsChecked, setTermsChecked] = useState(false)
  const [regLoading, setRegLoading] = useState(false)

  useEffect(() => {
    const id = 'auth-modal-css'
    if (!document.getElementById(id)) {
      const s = document.createElement('style'); s.id = id; s.textContent = MODAL_CSS
      document.head.appendChild(s)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => setOpen(true))
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  const handleClose = () => { setOpen(false); setTimeout(onClose, 350) }

  const maskCpf = (v: string) => {
    const d = v.replace(/\D/g, '').substring(0, 11)
    if (d.length > 9) return d.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
    if (d.length > 6) return d.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3')
    if (d.length > 3) return d.replace(/(\d{3})(\d{1,3})/, '$1.$2')
    return d
  }

  const calcStrength = (v: string) => {
    let s = 0
    if (v.length >= 8) s++
    if (/[A-Z]/.test(v)) s++
    if (/[0-9]/.test(v)) s++
    if (/[^A-Za-z0-9]/.test(v)) s++
    return s
  }

  const sc = ['', '#fb7185', '#f59e0b', '#22c55e', '#22c55e']
  const sl = ['', 'Fraca', 'Razoável', 'Boa', 'Forte']

  const showSuccess = (name: string) => {
    setSuccessName(name); setSuccess(true)
    setTimeout(() => { handleClose(); navigate('/dashboard') }, 2200)
  }

  const handleLogin = async () => {
    let ok = true
    if (!loginEmail || !loginEmail.includes('@')) { setLoginEmailErr(true); ok = false } else setLoginEmailErr(false)
    if (!loginPass) { setLoginPassErr(true); ok = false } else setLoginPassErr(false)
    setLoginServerErr('')
    if (!ok) return
    try { await login(loginEmail, loginPass); showSuccess(loginEmail.split('@')[0]) }
    catch (err) { setLoginServerErr(err instanceof Error ? err.message : 'Email ou senha incorretos') }
  }

  const handleGoogleLogin = async () => {
    setLoginServerErr('')
    try { await loginWithGoogle(); showSuccess('você') }
    catch (err) { setLoginServerErr(err instanceof Error ? err.message : 'Erro ao entrar com Google') }
  }

  const handleRegister = async () => {
    let ok = true
    if (!regName.trim()) { setRegNameErr(true); ok = false } else setRegNameErr(false)
    if (regCpf.replace(/\D/g, '').length !== 11) { setRegCpfErr(true); ok = false } else setRegCpfErr(false)
    if (!regEmail || !regEmail.includes('@')) { setRegEmailErr(true); ok = false } else setRegEmailErr(false)
    if (regPass.length < 8) { setRegPassErr(true); ok = false } else setRegPassErr(false)
    if (!termsChecked) { setRegTermsErr(true); ok = false } else setRegTermsErr(false)
    setRegServerErr('')
    if (!ok) return
    setRegLoading(true)
    try { await new Promise(r => setTimeout(r, 900)); showSuccess(regName.split(' ')[0]) }
    catch (err) { setRegServerErr(err instanceof Error ? err.message : 'Erro ao criar conta') }
    finally { setRegLoading(false) }
  }

  const handleGoogleRegister = async () => {
    setRegServerErr('')
    try { await loginWithGoogle(); showSuccess('você') }
    catch (err) { setRegServerErr(err instanceof Error ? err.message : 'Erro ao cadastrar com Google') }
  }

  return (
    <div ref={overlayRef} className={`auth-overlay${open ? ' open' : ''}`}
      onClick={e => { if (e.target === overlayRef.current) handleClose() }}>
      <div className="auth-backdrop" />
      <div className="auth-card">
        <div className="auth-card-glow" />

        <button className="auth-close" onClick={handleClose}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className={`auth-success${success ? ' show' : ''}`}>
          <div className="auth-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3>{panel === 'register' ? 'Conta criada!' : 'Bem-vindo de volta!'}</h3>
          <p>Olá, <strong style={{color:'#fff'}}>{successName}</strong>! Redirecionando...</p>
        </div>

        {!success && (
          <div className={`auth-slider${panel === 'register' ? ' on-register' : ''}`}>

            {/* LOGIN */}
            <div className="auth-panel">
              <div className="auth-logo">
                <div className="auth-logo-box">Z</div>
                <span className="auth-logo-name">ZetaFin</span>
              </div>
              <div className="auth-h">Bem-vindo de volta</div>
              <div className="auth-sub">Acesse sua conta e retome o controle das suas finanças.</div>
              {loginServerErr && <div className="auth-server-err">{loginServerErr}</div>}

              <div className="auth-field">
                <label className="auth-label">E-mail</label>
                <div className="auth-input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input className={`auth-input${loginEmailErr?' err':''}`} type="email" placeholder="seu@email.com" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} autoComplete="email"/>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Senha</label>
                <div className="auth-input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input className={`auth-input has-eye${loginPassErr?' err':''}`} type={showPassLogin?'text':'password'} placeholder="Sua senha" value={loginPass} onChange={e=>setLoginPass(e.target.value)} autoComplete="current-password"/>
                  <button className="auth-eye" type="button" onClick={()=>setShowPassLogin(p=>!p)}>
                    {showPassLogin
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>

              <div className="auth-forgot"><a href="#">Esqueceu a senha?</a></div>
              <button className="auth-btn" onClick={handleLogin} disabled={isLoading}>{isLoading?'Aguarde...':'Entrar na minha conta'}</button>
              <div className="auth-divider"><span>ou continue com</span></div>
              <button className="auth-social" onClick={handleGoogleLogin}><GoogleIcon/>Entrar com Google</button>
              <div className="auth-signup-hint">
                <span>Não tem conta?</span>
                <button className="auth-signup-link" onClick={()=>setPanel('register')}>Criar conta grátis <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            </div>

            {/* REGISTER */}
            <div className="auth-panel">
              <div className="auth-logo">
                <div className="auth-logo-box">Z</div>
                <span className="auth-logo-name">ZetaFin</span>
              </div>
              <div className="auth-h">Criar conta</div>
              <div className="auth-sub" style={{marginBottom:'22px'}}>Grátis para sempre. Leva menos de 2 minutos.</div>
              {regServerErr && <div className="auth-server-err">{regServerErr}</div>}

              <div className="auth-field">
                <label className="auth-label">Nome completo</label>
                <div className="auth-input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input className={`auth-input${regNameErr?' err':''}`} type="text" placeholder="João da Silva" value={regName} onChange={e=>setRegName(e.target.value)} autoComplete="name"/>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">CPF</label>
                <div className="auth-input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3,10 21,10"/></svg>
                  <input className={`auth-input${regCpfErr?' err':''}`} type="text" placeholder="000.000.000-00" value={regCpf} onChange={e=>setRegCpf(maskCpf(e.target.value))} maxLength={14} autoComplete="off"/>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">E-mail</label>
                <div className="auth-input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input className={`auth-input${regEmailErr?' err':''}`} type="email" placeholder="seu@email.com" value={regEmail} onChange={e=>setRegEmail(e.target.value)} autoComplete="email"/>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Senha</label>
                <div className="auth-input-wrap">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <input className={`auth-input has-eye${regPassErr?' err':''}`} type={showPassReg?'text':'password'} placeholder="Mínimo 8 caracteres" value={regPass} onChange={e=>{setRegPass(e.target.value);setPassStrength(calcStrength(e.target.value))}} autoComplete="new-password"/>
                  <button className="auth-eye" type="button" onClick={()=>setShowPassReg(p=>!p)}>
                    {showPassReg
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
                {regPass.length > 0 && (
                  <>
                    <div className="auth-pass-bars">{[0,1,2,3].map(i=><div key={i} className="auth-pass-bar" style={{background:i<passStrength?sc[passStrength]:'rgba(255,255,255,.08)'}}/>)}</div>
                    {passStrength>0 && <div className="auth-pass-label" style={{color:sc[passStrength]}}>Senha {sl[passStrength]}</div>}
                  </>
                )}
              </div>

              <div className={`auth-check-row`}>
                <div className={`auth-check-box${termsChecked?' checked':''}`} onClick={()=>setTermsChecked(p=>!p)}/>
                <div className="auth-check-label" onClick={()=>setTermsChecked(p=>!p)}>
                  Li e aceito os <a href="#" onClick={e=>e.stopPropagation()}>Termos de Uso</a> e a <a href="#" onClick={e=>e.stopPropagation()}>Política de Privacidade</a> do ZetaFin.
                </div>
              </div>

              <button className="auth-btn" onClick={handleRegister} disabled={regLoading}>{regLoading?'Aguarde...':'Criar minha conta'}</button>
              <div className="auth-divider"><span>ou cadastre com</span></div>
              <button className="auth-social" onClick={handleGoogleRegister}><GoogleIcon/>Cadastrar com Google</button>
              <div className="auth-signup-hint">
                <span>Já tem conta?</span>
                <button className="auth-signup-link" onClick={()=>setPanel('login')}>Fazer login <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg></button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}