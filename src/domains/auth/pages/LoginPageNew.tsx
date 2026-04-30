import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const LoginPageNew = () => {
  const navigate = useNavigate()
  const { login, loginWithGoogle, isLoading, error } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [buttonHovered, setButtonHovered] = useState(false)
  const [googleHovered, setGoogleHovered] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('123456')

  // Inicializar Canvas de fundo
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    function resize() {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const lines: any[] = []
    const NUM_LINES = 4
    const POINTS = 14

    function makeChart(startX: number, startY: number, amplitude: number, trend: number, speed: number, opacity: number, lineW: number) {
      const pts: any[] = []
      let y = startY
      for (let i = 0; i < POINTS; i++) {
        pts.push({ x: startX + i * (canvas.width / (POINTS - 1)) * 0.9, y })
        y += (Math.random() - 0.45) * amplitude + trend
      }
      return { pts, speed, opacity, lineW, offset: Math.random() * 1000, phase: Math.random() * Math.PI * 2 }
    }

    function initLines() {
      lines.length = 0
      lines.push(makeChart(canvas.width * 0.05, canvas.height * 0.35, 28, -1.5, 0.4, 0.55, 1.5))
      lines.push(makeChart(canvas.width * 0.1, canvas.height * 0.6, 22, 1.2, 0.3, 0.3, 1))
      lines.push(makeChart(canvas.width * 0.0, canvas.height * 0.2, 18, 0.8, 0.5, 0.2, 0.8))
      lines.push(makeChart(canvas.width * 0.15, canvas.height * 0.75, 15, -0.5, 0.25, 0.18, 0.7))
    }
    initLines()

    const particles: any[] = []
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.4 + 0.1
      })
    }

    const glows = [
      { cx: 0.2, cy: 0.3, r: 180, a: 0.07 },
      { cx: 0.8, cy: 0.7, r: 220, a: 0.05 },
      { cx: 0.6, cy: 0.15, r: 130, a: 0.04 }
    ]

    let t = 0
    let animationId: number

    function draw() {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      ctx.fillStyle = '#0a1410'
      ctx.fillRect(0, 0, w, h)

      for (const g of glows) {
        const grad = ctx.createRadialGradient(g.cx * w, g.cy * h, 0, g.cx * w, g.cy * h, g.r)
        grad.addColorStop(0, `rgba(52,211,153,${g.a})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      for (const line of lines) {
        const pts = line.pts
        const animPts = pts.map((p: any, i: number) => ({
          x: p.x + Math.sin(t * line.speed * 0.5 + i * 0.6 + line.phase) * 4,
          y: p.y + Math.sin(t * line.speed + i * 0.4 + line.phase) * 10
        }))

        ctx.beginPath()
        ctx.moveTo(animPts[0].x, animPts[0].y)
        for (let i = 1; i < animPts.length - 2; i++) {
          const mx = (animPts[i].x + animPts[i + 1].x) / 2
          const my = (animPts[i].y + animPts[i + 1].y) / 2
          ctx.quadraticCurveTo(animPts[i].x, animPts[i].y, mx, my)
        }
        const last = animPts.length - 1
        ctx.quadraticCurveTo(animPts[last - 1].x, animPts[last - 1].y, animPts[last].x, animPts[last].y)

        ctx.strokeStyle = `rgba(52,211,153,${line.opacity})`
        ctx.lineWidth = line.lineW
        ctx.stroke()

        const fillEnd = animPts[last]
        const fillStart = animPts[0]
        const grad = ctx.createLinearGradient(0, fillStart.y - 40, 0, fillStart.y + 60)
        grad.addColorStop(0, `rgba(52,211,153,${line.opacity * 0.18})`)
        grad.addColorStop(1, 'transparent')

        ctx.lineTo(fillEnd.x, h)
        ctx.lineTo(fillStart.x, h)
        ctx.closePath()
        ctx.fillStyle = grad
        ctx.fill()

        for (let i = 0; i < animPts.length; i += 4) {
          const p = animPts[i]
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(52,211,153,${line.opacity * 0.9})`
          ctx.fill()
        }
      }

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(52,211,153,${p.a})`
        ctx.fill()
      }

      const gridAlpha = 0.04
      ctx.strokeStyle = `rgba(52,211,153,${gridAlpha})`
      ctx.lineWidth = 0.5
      const cols = 8
      const rows = 6
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath()
        ctx.moveTo(i * w / cols, 0)
        ctx.lineTo(i * w / cols, h)
        ctx.stroke()
      }
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * h / rows)
        ctx.lineTo(w, i * h / rows)
        ctx.stroke()
      }

      t += 0.012
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      // Error is handled by useAuth hook
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      // Error is handled by useAuth hook
    }
  }

  const inputStyle = {
    width: '100%',
    height: '42px',
    padding: '0 14px',
    borderRadius: '16px',
    border: '1px solid rgba(52,211,153,0.2)',
    background: 'rgba(10, 22, 16, 0.35)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    color: '#e8f5ef',
    fontSize: '13px',
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s'
  }

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      borderRadius: '20px',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: '#0a1410',
        overflow: 'hidden'
      }}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%'
          }}
        />
      </div>

      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '340px',
        background: 'rgba(10, 22, 16, 0.55)',
        border: '1px solid rgba(52, 211, 153, 0.18)',
        borderRadius: '28px',
        padding: '36px 32px 32px',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        boxShadow: `0 0 0 0.5px rgba(52,211,153,0.08) inset,
                    0 24px 64px rgba(0,0,0,0.5),
                    0 0 80px rgba(52,211,153,0.04) inset`
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '28px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '12px',
            background: '#34d399',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '18px',
            color: '#051a0f',
            letterSpacing: '-0.5px',
            flexShrink: 0
          }}>
            Z
          </div>
          <span style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff',
            letterSpacing: '-0.4px'
          }}>
            ZetaFin
          </span>
        </div>

        {/* Welcome */}
        <div style={{
          textAlign: 'center',
          marginBottom: '28px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#e8f5ef',
            margin: 0,
            letterSpacing: '-0.2px'
          }}>
            Bem-vindo de volta
          </h2>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.2)',
            fontSize: '12px',
            color: '#f87171'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                ...inputStyle,
                borderColor: emailFocused ? 'rgba(52,211,153,0.4)' : 'rgba(52,211,153,0.2)',
                background: emailFocused ? 'rgba(10, 22, 16, 0.5)' : 'rgba(10, 22, 16, 0.35)'
              } as any}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </div>

          {/* Password Field */}
          <div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...inputStyle,
                  paddingRight: '40px',
                  borderColor: passwordFocused ? 'rgba(52,211,153,0.4)' : 'rgba(52,211,153,0.2)',
                  background: passwordFocused ? 'rgba(10, 22, 16, 0.5)' : 'rgba(10, 22, 16, 0.35)'
                } as any}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#34d399',
                  cursor: 'pointer',
                  fontSize: '14px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '2px',
            marginBottom: '4px'
          }}>
            <button
              type="button"
              style={{
                fontSize: '11px',
                color: 'rgba(52,211,153,0.55)',
                cursor: 'pointer',
                textDecoration: 'none',
                border: 'none',
                background: 'none',
                transition: 'color 0.2s',
                fontWeight: '400',
                padding: 0
              }}
              onMouseEnter={(e) => {
                (e.target as any).style.color = '#34d399'
              }}
              onMouseLeave={(e) => {
                (e.target as any).style.color = 'rgba(52,211,153,0.55)'
              }}
            >
              Esqueci a senha
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '44px',
              borderRadius: '14px',
              border: 'none',
              background: '#34d399',
              color: '#051a0f',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: "'DM Sans', sans-serif",
              cursor: isLoading ? 'not-allowed' : 'pointer',
              letterSpacing: '-0.1px',
              transition: 'opacity 0.15s, transform 0.12s',
              marginTop: '8px',
              marginBottom: '14px',
              opacity: isLoading ? 0.7 : buttonHovered ? 0.88 : 1,
              transform: buttonHovered ? 'translateY(-1px)' : 'translateY(0)'
            }}
            onMouseEnter={() => !isLoading && setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Google Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            height: '40px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: googleHovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.04)',
            color: 'rgba(255,255,255,0.65)',
            fontSize: '13px',
            fontWeight: '400',
            fontFamily: "'DM Sans', sans-serif",
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '14px',
            transition: 'background 0.2s',
            opacity: isLoading ? 0.7 : 1
          }}
          onMouseEnter={() => !isLoading && setGoogleHovered(true)}
          onMouseLeave={() => setGoogleHovered(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Entrar com Google
        </button>

        {/* Footer */}
        <p style={{
          fontSize: '12px',
          color: 'rgba(255,255,255,0.3)',
          textAlign: 'center',
          margin: 0
        }}>
          Não tem conta? <a href="#" style={{
            color: '#34d399',
            textDecoration: 'none',
            fontWeight: '500'
          }}>Criar conta</a>
        </p>
      </div>
    </div>
  )
}
