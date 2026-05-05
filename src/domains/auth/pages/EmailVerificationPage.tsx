import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AuthLayout } from '../components/AuthLayout'
import { EmailVerificationForm } from '../components/EmailVerificationForm'

export const EmailVerificationPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [displayError, setDisplayError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)

  const email = (location.state?.email as string) || 'seu@email.com'

  const handleVerify = async (code: string) => {
    setDisplayError(null)
    setIsLoading(true)
    try {
      // Simular validação de código
      await new Promise(resolve => setTimeout(resolve, 1500))
      // Se código for válido, redirecionar para dashboard
      setTimeout(() => navigate('/dashboard'), 700)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Código inválido ou expirado'
      setDisplayError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setDisplayError(null)
    setIsResending(true)
    try {
      // Simular reenvio de código
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reenviar código'
      setDisplayError(errorMessage)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthLayout showBrandingArea={true}>
      <EmailVerificationForm
        onSubmit={handleVerify}
        onResend={handleResend}
        isLoading={isLoading}
        isResending={isResending}
        serverError={displayError}
        email={email}
      />
    </AuthLayout>
  )
}

//     const ctx = canvas.getContext('2d')
//     if (!ctx) return

//     function resize() {
//       canvas.width = canvas.offsetWidth
//       canvas.height = canvas.offsetHeight
//     }
//     resize()

//     const lines: any[] = []
//     const NUM_LINES = 4
//     const POINTS = 14

//     function makeChart(startX: number, startY: number, amplitude: number, trend: number, speed: number, opacity: number, lineW: number) {
//       const pts: any[] = []
//       let y = startY
//       for (let i = 0; i < POINTS; i++) {
//         pts.push({ x: startX + i * (canvas.width / (POINTS - 1)) * 0.9, y })
//         y += (Math.random() - 0.45) * amplitude + trend
//       }
//       return { pts, speed, opacity, lineW, offset: Math.random() * 1000, phase: Math.random() * Math.PI * 2 }
//     }

//     function initLines() {
//       lines.length = 0
//       lines.push(makeChart(canvas.width * 0.05, canvas.height * 0.35, 28, -1.5, 0.4, 0.55, 1.5))
//       lines.push(makeChart(canvas.width * 0.1, canvas.height * 0.6, 22, 1.2, 0.3, 0.3, 1))
//       lines.push(makeChart(canvas.width * 0.0, canvas.height * 0.2, 18, 0.8, 0.5, 0.2, 0.8))
//       lines.push(makeChart(canvas.width * 0.15, canvas.height * 0.75, 15, -0.5, 0.25, 0.18, 0.7))
//     }
//     initLines()

//     const particles: any[] = []
//     for (let i = 0; i < 28; i++) {
//       particles.push({
//         x: Math.random() * 800,
//         y: Math.random() * 600,
//         r: Math.random() * 1.5 + 0.3,
//         vx: (Math.random() - 0.5) * 0.3,
//         vy: (Math.random() - 0.5) * 0.3,
//         a: Math.random() * 0.4 + 0.1
//       })
//     }

//     const glows = [
//       { cx: 0.2, cy: 0.3, r: 180, a: 0.07 },
//       { cx: 0.8, cy: 0.7, r: 220, a: 0.05 },
//       { cx: 0.6, cy: 0.15, r: 130, a: 0.04 }
//     ]

//     let t = 0
//     let animationId: number

//     function draw() {
//       const w = canvas.width
//       const h = canvas.height
//       ctx.clearRect(0, 0, w, h)

//       ctx.fillStyle = '#0a1410'
//       ctx.fillRect(0, 0, w, h)

//       for (const g of glows) {
//         const grad = ctx.createRadialGradient(g.cx * w, g.cy * h, 0, g.cx * w, g.cy * h, g.r)
//         grad.addColorStop(0, `rgba(52,211,153,${g.a})`)
//         grad.addColorStop(1, 'transparent')
//         ctx.fillStyle = grad
//         ctx.fillRect(0, 0, w, h)
//       }

//       for (const line of lines) {
//         const pts = line.pts
//         const animPts = pts.map((p: any, i: number) => ({
//           x: p.x + Math.sin(t * line.speed * 0.5 + i * 0.6 + line.phase) * 4,
//           y: p.y + Math.sin(t * line.speed + i * 0.4 + line.phase) * 10
//         }))

//         ctx.beginPath()
//         ctx.moveTo(animPts[0].x, animPts[0].y)
//         for (let i = 1; i < animPts.length - 2; i++) {
//           const mx = (animPts[i].x + animPts[i + 1].x) / 2
//           const my = (animPts[i].y + animPts[i + 1].y) / 2
//           ctx.quadraticCurveTo(animPts[i].x, animPts[i].y, mx, my)
//         }
//         const last = animPts.length - 1
//         ctx.quadraticCurveTo(animPts[last - 1].x, animPts[last - 1].y, animPts[last].x, animPts[last].y)

//         ctx.strokeStyle = `rgba(52,211,153,${line.opacity})`
//         ctx.lineWidth = line.lineW
//         ctx.stroke()

//         const fillEnd = animPts[last]
//         const fillStart = animPts[0]
//         const grad = ctx.createLinearGradient(0, fillStart.y - 40, 0, fillStart.y + 60)
//         grad.addColorStop(0, `rgba(52,211,153,${line.opacity * 0.18})`)
//         grad.addColorStop(1, 'transparent')

//         ctx.lineTo(fillEnd.x, h)
//         ctx.lineTo(fillStart.x, h)
//         ctx.closePath()
//         ctx.fillStyle = grad
//         ctx.fill()

//         for (let i = 0; i < animPts.length; i += 4) {
//           const p = animPts[i]
//           ctx.beginPath()
//           ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
//           ctx.fillStyle = `rgba(52,211,153,${line.opacity * 0.9})`
//           ctx.fill()
//         }
//       }

//       for (const p of particles) {
//         p.x += p.vx
//         p.y += p.vy
//         if (p.x < 0) p.x = w
//         if (p.x > w) p.x = 0
//         if (p.y < 0) p.y = h
//         if (p.y > h) p.y = 0
//         ctx.beginPath()
//         ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
//         ctx.fillStyle = `rgba(52,211,153,${p.a})`
//         ctx.fill()
//       }

//       const gridAlpha = 0.04
//       ctx.strokeStyle = `rgba(52,211,153,${gridAlpha})`
//       ctx.lineWidth = 0.5
//       const cols = 8
//       const rows = 6
//       for (let i = 0; i <= cols; i++) {
//         ctx.beginPath()
//         ctx.moveTo(i * w / cols, 0)
//         ctx.lineTo(i * w / cols, h)
//         ctx.stroke()
//       }
//       for (let i = 0; i <= rows; i++) {
//         ctx.beginPath()
//         ctx.moveTo(0, i * h / rows)
//         ctx.lineTo(w, i * h / rows)
//         ctx.stroke()
//       }

//       t += 0.012
//       animationId = requestAnimationFrame(draw)
//     }

//     draw()

//     return () => {
//       cancelAnimationFrame(animationId)
//     }
//   }, [])

//   const handleCodeChange = (index: number, value: string) => {
//     // Apenas números
//     if (value && !/^\d$/.test(value)) return

//     const newCode = [...code]
//     newCode[index] = value

//     setCode(newCode)
//     setError('')

//     // Auto-focus próximo campo
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus()
//     }
//   }

//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     // Backspace no campo vazio volta para o anterior
//     if (e.key === 'Backspace' && !code[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus()
//     }
//   }

//   const handlePaste = (e: React.ClipboardEvent) => {
//     e.preventDefault()
//     const pastedData = e.clipboardData.getData('text').slice(0, 6)
//     if (/^\d+$/.test(pastedData)) {
//       const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''))
//       setCode(newCode as any)
//     }
//   }

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const fullCode = code.join('')

//     if (fullCode.length !== 6) {
//       setError('Digite os 6 dígitos do código')
//       return
//     }

//     setIsLoading(true)
//     try {
//       // Simulação de API call - substituir com chamada real
//       await new Promise(resolve => setTimeout(resolve, 1500))
//       // Redirecionar para dashboard ou login
//       navigate('/dashboard')
//     } catch (err) {
//       setError('Código inválido ou expirado. Tente novamente.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleResend = async () => {
//     setResendLoading(true)
//     try {
//       // Simulação de API call
//       await new Promise(resolve => setTimeout(resolve, 1000))
//       setResendCountdown(60)
//       setError('')
//     } catch (err) {
//       setError('Erro ao reenviar código. Tente novamente.')
//     } finally {
//       setResendLoading(false)
//     }
//   }

//   return (
//     <div style={{
//       position: 'relative',
//       width: '100%',
//       minHeight: '100vh',
//       borderRadius: '20px',
//       overflow: 'hidden',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
//     }}>
//       <div style={{
//         position: 'absolute',
//         inset: 0,
//         background: '#0a1410',
//         overflow: 'hidden'
//       }}>
//         <canvas
//           ref={canvasRef}
//           style={{
//             position: 'absolute',
//             inset: 0,
//             width: '100%',
//             height: '100%'
//           }}
//         />
//       </div>

//       <div style={{
//         position: 'relative',
//         zIndex: 10,
//         width: '340px',
//         background: 'rgba(10, 22, 16, 0.55)',
//         border: '1px solid rgba(52, 211, 153, 0.18)',
//         borderRadius: '28px',
//         padding: '36px 32px 32px',
//         backdropFilter: 'blur(18px)',
//         WebkitBackdropFilter: 'blur(18px)',
//         boxShadow: `0 0 0 0.5px rgba(52,211,153,0.08) inset,
//                     0 24px 64px rgba(0,0,0,0.5),
//                     0 0 80px rgba(52,211,153,0.04) inset`
//       }}>
//         {/* Logo */}
//         <div style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           gap: '10px',
//           marginBottom: '28px'
//         }}>
//           <div style={{
//             width: '36px',
//             height: '36px',
//             borderRadius: '12px',
//             background: '#34d399',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontWeight: '700',
//             fontSize: '18px',
//             color: '#051a0f',
//             letterSpacing: '-0.5px',
//             flexShrink: 0
//           }}>
//             Z
//           </div>
//           <span style={{
//             fontSize: '20px',
//             fontWeight: '600',
//             color: '#ffffff',
//             letterSpacing: '-0.4px'
//           }}>
//             ZetaFin
//           </span>
//         </div>

//         {/* Title */}
//         <div style={{
//           textAlign: 'center',
//           marginBottom: '24px'
//         }}>
//           <h2 style={{
//             fontSize: '18px',
//             fontWeight: '600',
//             color: '#e8f5ef',
//             margin: '0 0 8px 0',
//             letterSpacing: '-0.2px'
//           }}>
//             Confirme seu email
//           </h2>
//           <p style={{
//             fontSize: '12px',
//             color: 'rgba(255,255,255,0.4)',
//             margin: 0
//           }}>
//             Enviamos um código para<br /><span style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{email}</span>
//           </p>
//         </div>

//         {/* Error Alert */}
//         {error && (
//           <div style={{
//             marginBottom: '16px',
//             padding: '10px 12px',
//             borderRadius: '8px',
//             background: 'rgba(248,113,113,0.1)',
//             border: '1px solid rgba(248,113,113,0.2)',
//             fontSize: '12px',
//             color: '#f87171'
//           }}>
//             {error}
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
//           {/* Code Inputs */}
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(6, 1fr)',
//             gap: '10px',
//             marginBottom: '20px'
//           }}>
//             {code.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => { inputRefs.current[index] = el }}
//                 type="text"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleCodeChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 onPaste={handlePaste}
//                 disabled={isLoading}
//                 style={{
//                   width: '100%',
//                   aspectRatio: '1',
//                   padding: '0',
//                   borderRadius: '14px',
//                   border: '1px solid rgba(52,211,153,0.2)',
//                   background: 'rgba(10, 22, 16, 0.35)',
//                   backdropFilter: 'blur(8px)',
//                   WebkitBackdropFilter: 'blur(8px)',
//                   color: '#e8f5ef',
//                   fontSize: '20px',
//                   fontWeight: '600',
//                   textAlign: 'center',
//                   fontFamily: "'DM Sans', sans-serif",
//                   outline: 'none',
//                   transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
//                   boxSizing: 'border-box',
//                   cursor: isLoading ? 'not-allowed' : 'text'
//                 } as React.CSSProperties}
//                 onFocus={(e) => {
//                   (e.target as HTMLInputElement).style.borderColor = 'rgba(52,211,153,0.4)'
//                   ;(e.target as HTMLInputElement).style.background = 'rgba(10, 22, 16, 0.5)'
//                   ;(e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(52,211,153,0.1)'
//                 }}
//                 onBlur={(e) => {
//                   (e.target as HTMLInputElement).style.borderColor = 'rgba(52,211,153,0.2)'
//                   ;(e.target as HTMLInputElement).style.background = 'rgba(10, 22, 16, 0.35)'
//                   ;(e.target as HTMLInputElement).style.boxShadow = 'none'
//                 }}
//               />
//             ))}
//           </div>

//           {/* Verify Button */}
//           <button
//             type="submit"
//             disabled={isLoading || code.join('').length !== 6}
//             style={{
//               width: '100%',
//               height: '44px',
//               borderRadius: '14px',
//               border: 'none',
//               background: '#34d399',
//               color: '#051a0f',
//               fontSize: '14px',
//               fontWeight: '600',
//               fontFamily: "'DM Sans', sans-serif",
//               cursor: isLoading || code.join('').length !== 6 ? 'not-allowed' : 'pointer',
//               letterSpacing: '-0.1px',
//               transition: 'opacity 0.15s, transform 0.12s',
//               marginBottom: '14px',
//               opacity: isLoading || code.join('').length !== 6 ? 0.5 : 1,
//               transform: code.join('').length === 6 ? 'scale(1)' : 'scale(0.99)'
//             }}
//             onMouseEnter={(e) => {
//               if (!isLoading && code.join('').length === 6) {
//                 (e.currentTarget as HTMLButtonElement).style.opacity = '0.88'
//                 ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (!isLoading && code.join('').length === 6) {
//                 (e.currentTarget as HTMLButtonElement).style.opacity = '1'
//                 ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
//               }
//             }}
//           >
//             {isLoading ? 'Verificando...' : 'Verificar código'}
//           </button>
//         </form>

//         {/* Resend Code */}
//         <div style={{
//           textAlign: 'center',
//           marginBottom: '14px'
//         }}>
//           <p style={{
//             fontSize: '12px',
//             color: 'rgba(255,255,255,0.4)',
//             margin: '0 0 8px 0'
//           }}>
//             Não recebeu o código?
//           </p>
//           <button
//             onClick={handleResend}
//             disabled={resendLoading || resendCountdown > 0}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: resendCountdown > 0 ? 'rgba(52,211,153,0.3)' : '#34d399',
//               fontSize: '12px',
//               fontWeight: '500',
//               cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer',
//               padding: '0',
//               fontFamily: "'DM Sans', sans-serif",
//               transition: 'color 0.2s'
//             }}
//             onMouseEnter={(e) => {
//               if (resendCountdown === 0) {
//                 (e.currentTarget as HTMLButtonElement).style.color = 'rgba(52,211,153,0.7)'
//               }
//             }}
//             onMouseLeave={(e) => {
//               if (resendCountdown === 0) {
//                 (e.currentTarget as HTMLButtonElement).style.color = '#34d399'
//               }
//             }}
//           >
//             {resendCountdown > 0 ? `Reenviar em ${resendCountdown}s` : 'Reenviar código'}
//           </button>
//         </div>

//         {/* Back to Login */}
//         <p style={{
//           fontSize: '12px',
//           color: 'rgba(255,255,255,0.3)',
//           textAlign: 'center',
//           margin: 0
//         }}>
//           <button
//             onClick={() => navigate('/login')}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: '#34d399',
//               textDecoration: 'none',
//               fontWeight: '500',
//               fontSize: '12px',
//               padding: 0,
//               cursor: 'pointer',
//               fontFamily: "'DM Sans', sans-serif",
//               transition: 'opacity 0.2s'
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
//             onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
//           >
//             Voltar para login
//           </button>
//         </p>
//       </div>
//     </div>
//   )
// }
