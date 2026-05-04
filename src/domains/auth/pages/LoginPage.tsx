import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" style={{ flexShrink: 0 }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const EyeOpenIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
)

export const LoginPage = () => {
  const navigate = useNavigate()
  const { login, loginWithGoogle, isLoading, error } = useAuthContext()
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('123456')
  const [showPwd, setShowPwd] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

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
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 20px rgba(74,222,128,.2), 0 0 60px rgba(74,222,128,.05); } 50% { box-shadow: 0 0 30px rgba(74,222,128,.35), 0 0 80px rgba(74,222,128,.1); } }
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
        @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-8px) rotate(1deg); } 66% { transform: translateY(4px) rotate(-1deg); } }
        @keyframes grid-move { 0% { background-position: 0 0; } 100% { background-position: 48px 48px; } }
        @keyframes dot-blink { 0%,100% { opacity:1; } 50% { opacity:.3; } }

        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

        .zf-page {
          min-height: 100vh;
          background: #050c0a;
          display: flex;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .zf-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px;
          position: relative;
          z-index: 2;
        }

        .zf-right {
          width: 480px;
          flex-shrink: 0;
          background: rgba(8,20,16,.95);
          border-left: 1px solid rgba(74,222,128,.12);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 52px;
          position: relative;
          z-index: 2;
        }

        .zf-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(74,222,128,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,222,128,.04) 1px, transparent 1px);
          background-size: 48px 48px;
          animation: grid-move 8s linear infinite;
          pointer-events: none;
        }

        .zf-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(74,222,128,.15), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        .zf-orb1 {
          position: absolute;
          top: -200px; left: -150px;
          width: 600px; height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(74,222,128,.08) 0%, transparent 65%);
          pointer-events: none;
        }

        .zf-orb2 {
          position: absolute;
          bottom: -150px; right: 480px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(52,211,153,.06) 0%, transparent 65%);
          pointer-events: none;
        }

        .zf-logo-mark {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 52px;
          animation: fadeUp .6s ease-out both;
        }

        .zf-logo-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #4ade80 0%, #059669 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; font-weight: 800; color: #050c0a;
          animation: pulse-glow 3s ease-in-out infinite;
          flex-shrink: 0;
        }

        .zf-logo-text {
          font-size: 28px; font-weight: 800; letter-spacing: -1px;
          color: #f0fdf4;
        }

        .zf-logo-text span {
          color: #4ade80;
        }

        .zf-tagline {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: rgba(74,222,128,.5);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 48px;
          animation: fadeUp .6s .1s ease-out both;
        }

        .zf-hero-title {
          font-size: 52px; font-weight: 800; line-height: 1.05;
          letter-spacing: -2px;
          color: #f0fdf4;
          margin-bottom: 20px;
          animation: fadeUp .6s .15s ease-out both;
        }

        .zf-hero-title .accent { color: #4ade80; }

        .zf-hero-sub {
          font-size: 17px; font-weight: 400;
          color: rgba(240,253,244,.45);
          line-height: 1.7;
          max-width: 420px;
          animation: fadeUp .6s .2s ease-out both;
          font-family: 'Space Mono', monospace;
        }

        .zf-stats {
          display: flex; gap: 40px;
          margin-top: 56px;
          animation: fadeUp .6s .3s ease-out both;
        }

        .zf-stat-val {
          font-size: 28px; font-weight: 800;
          color: #4ade80;
          letter-spacing: -1px;
        }

        .zf-stat-lbl {
          font-size: 12px;
          color: rgba(240,253,244,.35);
          font-family: 'Space Mono', monospace;
          letter-spacing: 1px;
          margin-top: 2px;
        }

        .zf-corner-tl, .zf-corner-br {
          position: absolute;
          width: 20px; height: 20px;
          border-color: rgba(74,222,128,.4);
          border-style: solid;
          pointer-events: none;
        }
        .zf-corner-tl { top: 24px; left: 24px; border-width: 2px 0 0 2px; }
        .zf-corner-br { bottom: 24px; right: 24px; border-width: 0 2px 2px 0; }

        .zf-form-title {
          font-size: 26px; font-weight: 800;
          letter-spacing: -1px; color: #f0fdf4;
          margin-bottom: 6px;
        }

        .zf-form-sub {
          font-size: 13px;
          color: rgba(240,253,244,.4);
          font-family: 'Space Mono', monospace;
          margin-bottom: 36px;
        }

        .zf-field { margin-bottom: 20px; }

        .zf-label {
          display: block; font-size: 11px; font-weight: 600;
          letter-spacing: 2px; text-transform: uppercase;
          color: rgba(74,222,128,.7);
          margin-bottom: 8px;
          font-family: 'Space Mono', monospace;
        }

        .zf-input-wrap { position: relative; }

        .zf-input {
          width: 100%;
          background: rgba(74,222,128,.04);
          border: 1px solid rgba(74,222,128,.15);
          border-radius: 10px;
          padding: 13px 16px;
          color: #f0fdf4;
          font-size: 14px;
          font-family: 'Syne', sans-serif;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }

        .zf-input:focus {
          border-color: rgba(74,222,128,.5);
          background: rgba(74,222,128,.07);
          box-shadow: 0 0 0 3px rgba(74,222,128,.08), 0 0 20px rgba(74,222,128,.08);
        }

        .zf-input::placeholder { color: rgba(240,253,244,.2); }

        .zf-eye-btn {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: rgba(240,253,244,.3); display: flex; padding: 4px;
          transition: color .2s;
        }
        .zf-eye-btn:hover { color: rgba(74,222,128,.7); }

        .zf-forgot {
          font-size: 11px; font-family: 'Space Mono', monospace;
          color: rgba(74,222,128,.5); cursor: pointer;
          letter-spacing: 1px;
          transition: color .2s;
          float: right; margin-top: -4px;
        }
        .zf-forgot:hover { color: #4ade80; }

        .zf-btn-primary {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #4ade80 0%, #059669 100%);
          border: none; border-radius: 10px;
          color: #050c0a; font-size: 15px; font-weight: 800;
          font-family: 'Syne', sans-serif;
          cursor: pointer; letter-spacing: .5px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all .25s;
          position: relative; overflow: hidden;
          margin-top: 8px;
        }
        .zf-btn-primary::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .zf-btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(74,222,128,.3), 0 0 60px rgba(74,222,128,.1);
        }
        .zf-btn-primary:active:not(:disabled) { transform: scale(.98); }
        .zf-btn-primary:disabled { opacity: .6; cursor: not-allowed; }

        .zf-divider {
          display: flex; align-items: center; gap: 14px;
          margin: 24px 0;
        }
        .zf-divider-line {
          flex: 1; height: 1px;
          background: rgba(74,222,128,.1);
        }
        .zf-divider-text {
          font-size: 11px; font-family: 'Space Mono', monospace;
          color: rgba(240,253,244,.25); letter-spacing: 2px; text-transform: uppercase;
        }

        .zf-btn-google {
          width: 100%; padding: 13px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 10px;
          color: rgba(240,253,244,.8); font-size: 14px; font-weight: 600;
          font-family: 'Syne', sans-serif;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all .2s;
        }
        .zf-btn-google:hover:not(:disabled) {
          background: rgba(255,255,255,.08);
          border-color: rgba(255,255,255,.2);
        }
        .zf-btn-google:disabled { opacity: .5; cursor: not-allowed; }

        .zf-demo-box {
          margin-top: 24px;
          padding: 16px;
          background: rgba(74,222,128,.04);
          border: 1px solid rgba(74,222,128,.12);
          border-radius: 10px;
        }
        .zf-demo-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 10px;
        }
        .zf-demo-tag {
          font-size: 9px; font-family: 'Space Mono', monospace;
          letter-spacing: 2.5px; text-transform: uppercase;
          color: rgba(74,222,128,.6);
          display: flex; align-items: center; gap: 6px;
        }
        .zf-demo-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
          animation: dot-blink 1.5s ease-in-out infinite;
        }
        .zf-demo-fill {
          font-size: 11px; font-family: 'Space Mono', monospace;
          background: rgba(74,222,128,.1);
          border: 1px solid rgba(74,222,128,.2);
          border-radius: 6px; padding: 4px 10px;
          color: rgba(74,222,128,.8); cursor: pointer;
          transition: background .2s;
        }
        .zf-demo-fill:hover { background: rgba(74,222,128,.18); }
        .zf-demo-row {
          font-size: 12px; font-family: 'Space Mono', monospace;
          color: rgba(240,253,244,.4); line-height: 1.8;
        }
        .zf-demo-val { color: rgba(240,253,244,.7); }

        .zf-alert {
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 20px;
          font-family: 'Space Mono', monospace;
          animation: fadeUp .3s ease-out;
        }
        .zf-alert-error {
          background: rgba(239,68,68,.07);
          border: 1px solid rgba(239,68,68,.2);
          color: rgba(248,113,113,.9);
        }
        .zf-alert-success {
          background: rgba(74,222,128,.07);
          border: 1px solid rgba(74,222,128,.2);
          color: rgba(74,222,128,.9);
        }

        .zf-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(5,12,10,.3);
          border-top-color: #050c0a;
          border-radius: 50%;
          animation: spin .6s linear infinite;
          flex-shrink: 0;
        }

        .zf-status-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #4ade80, #059669, transparent);
          opacity: .6;
        }

        @media (max-width: 900px) {
          .zf-left { display: none; }
          .zf-right { width: 100%; border-left: none; }
        }
      `}</style>

      <div className="zf-page">
        <div className="zf-grid-bg" />
        <div className="zf-scanline" />
        <div className="zf-orb1" />
        <div className="zf-orb2" />

        {/* LEFT SIDE */}
        <div className="zf-left">
          <div className="zf-logo-mark">
            <div className="zf-logo-icon">Ζ</div>
            <div className="zf-logo-text">Zeta<span>Fin</span></div>
          </div>

          <div className="zf-tagline">// inteligência financeira v1.0</div>

          <h1 className="zf-hero-title">
            Controle<br />
            seu dinheiro<br />
            <span className="accent">de verdade.</span>
          </h1>

          <p className="zf-hero-sub">
            Receitas, despesas, metas e histórico —<br />
            tudo num painel feito pra quem leva<br />
            as finanças a sério.
          </p>

          <div className="zf-stats">
            <div>
              <div className="zf-stat-val">+2.4k</div>
              <div className="zf-stat-lbl">Usuários ativos</div>
            </div>
            <div style={{ width: 1, background: 'rgba(74,222,128,.12)' }} />
            <div>
              <div className="zf-stat-val">R$12M</div>
              <div className="zf-stat-lbl">Transações/mês</div>
            </div>
            <div style={{ width: 1, background: 'rgba(74,222,128,.12)' }} />
            <div>
              <div className="zf-stat-val">98%</div>
              <div className="zf-stat-lbl">Satisfação</div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="zf-right">
          <div className="zf-status-bar" />
          <div className="zf-corner-tl" />
          <div className="zf-corner-br" />

          <div className="zf-form-title">Acessar sistema</div>
          <div className="zf-form-sub">_ insira suas credenciais</div>

          {displayError && (
            <div className="zf-alert zf-alert-error">⚠ {displayError}</div>
          )}
          {success && (
            <div className="zf-alert zf-alert-success">✓ Autenticado. Redirecionando...</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="zf-field">
              <label className="zf-label">Endereço de email</label>
              <input
                className="zf-input"
                type="email" required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </div>

            <div className="zf-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="zf-label" style={{ marginBottom: 8 }}>Senha</label>
                <span className="zf-forgot">Esqueceu?</span>
              </div>
              <div className="zf-input-wrap">
                <input
                  className="zf-input"
                  type={showPwd ? 'text' : 'password'} required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingRight: 44 }}
                />
                <button type="button" className="zf-eye-btn" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOpenIcon /> : <EyeOffIcon />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="zf-btn-primary"
              disabled={isLoading || success}
            >
              {isLoading ? <><div className="zf-spinner" /> Autenticando...</> : success ? '✓ Entrando...' : 'Entrar no sistema'}
            </button>
          </form>

          <div className="zf-divider">
            <div className="zf-divider-line" />
            <span className="zf-divider-text">ou</span>
            <div className="zf-divider-line" />
          </div>

          <button
            type="button"
            className="zf-btn-google"
            onClick={handleGoogle}
            disabled={isLoading || success}
          >
            {isLoading ? <div className="zf-spinner" style={{ borderColor: 'rgba(0,0,0,.2)', borderTopColor: '#333' }} /> : <GoogleIcon />}
            Continuar com Google
          </button>

          <div className="zf-demo-box">
            <div className="zf-demo-header">
              <div className="zf-demo-tag">
                <div className="zf-demo-dot" />
                conta demo
              </div>
              <button className="zf-demo-fill" onClick={() => { setEmail('user@example.com'); setPassword('123456') }}>
                preencher
              </button>
            </div>
            <div className="zf-demo-row">
              user <span className="zf-demo-val">user@example.com</span> / pass <span className="zf-demo-val">123456</span>
            </div>
          </div>

          <div style={{ marginTop: 28, textAlign: 'center', fontFamily: 'Space Mono, monospace', fontSize: 11, color: 'rgba(240,253,244,.2)', letterSpacing: 1 }}>
            ZetaFin · Finanças Pessoais · v1.0.0
          </div>
        </div>
      </div>
    </>
  )
}