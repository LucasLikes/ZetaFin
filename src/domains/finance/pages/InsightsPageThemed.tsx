import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../../../contexts/ThemeContext'
import { getColorPalette } from '../../../config/colors'
import { brl } from '../../../utils/detectBrand'

const FONT = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif'

// ─── COMPONENTE CARD COM GLASSMORPHISM ────────────────────────────────────
interface GlassCardProps {
  children: React.ReactNode
  onClick?: () => void
  delay?: number
  hover?: boolean
}

const GlassCard = ({ children, onClick, delay = 0, hover = true }: GlassCardProps) => {
  const { theme } = useTheme()
  const colors = getColorPalette(theme)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      style={{
        backdropFilter: 'blur(18px)',
        background: colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderRadius: '28px',
        boxShadow:
          theme === 'dark'
            ? '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)'
            : '0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        padding: '24px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
      }}
      whileHover={
        hover
          ? {
              transform: 'translateY(-2px)',
              borderColor: colors.greenPrimary,
              transition: { duration: 0.3 },
            }
          : {}
      }
    >
      {children}
    </motion.div>
  )
}

// ─── BOTÃO DE TEMA ────────────────────────────────────────────────────────
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme()
  const colors = getColorPalette(theme)

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        background: colors.bgCard,
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        color: colors.textPrimary,
        boxShadow:
          theme === 'dark'
            ? '0 4px 12px rgba(0,0,0,0.3)'
            : '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}
      title={`Mudar para ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </motion.button>
  )
}

// ─── ÍCONES ──────────────────────────────────────────────────────────────
const IcCard = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
)

const IcTarget = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

const IcRepeat = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="17 2 21 6 17 10" />
    <path d="M3 11v-1a4 4 0 0 1 4-4h14" />
    <polyline points="7 22 3 18 7 14" />
    <path d="M21 13v1a4 4 0 0 1-4 4H3" />
  </svg>
)

// ─── TIPOS ───────────────────────────────────────────────────────────────
interface CreditCard {
  id: string
  name: string
  bank: 'nubank' | 'inter' | 'banco-do-brasil' | 'other'
  lastDigits: string
  limit: number
  used: number
  closeDate: number
  nextDueDate: string
}

// ─── SEÇÃO DE CARTÕES DE CRÉDITO ──────────────────────────────────────────
const CreditCardSection = () => {
  const { theme } = useTheme()
  const colors = getColorPalette(theme)

  const [cards] = useState<CreditCard[]>([
    {
      id: '1',
      name: 'Cartão Nubank',
      bank: 'nubank',
      lastDigits: '4290',
      limit: 5000,
      used: 2850,
      closeDate: 15,
      nextDueDate: '05/06/2026',
    },
    {
      id: '2',
      name: 'Cartão Inter',
      bank: 'inter',
      lastDigits: '5678',
      limit: 3000,
      used: 1200,
      closeDate: 20,
      nextDueDate: '10/06/2026',
    },
  ])

  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id ?? null)
  const selectedCard = cards.find(c => c.id === selectedCardId)

  if (!selectedCard) return null

  const percentUsed = (selectedCard.used / selectedCard.limit) * 100
  const available = selectedCard.limit - selectedCard.used

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 700,
            color: colors.textPrimary,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: FONT,
          }}
        >
          <IcCard style={{ color: colors.greenPrimary }} />
          Seus Cartões
        </h2>

        {/* Mini cartões visuais */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          {cards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              onClick={() => setSelectedCardId(card.id)}
              style={{
                backdropFilter: 'blur(18px)',
                background: `linear-gradient(135deg, 
                  ${card.bank === 'nubank' ? '#8E44AD' : '#FF6B35'}, 
                  ${card.bank === 'nubank' ? '#5B2C6F' : '#E85A2D'})`,
                border: selectedCard.id === card.id ? `2px solid ${colors.greenPrimary}` : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                padding: '18px',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: selectedCard.id === card.id ? `0 0 20px ${colors.greenGlow}` : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '12px',
                    textTransform: 'uppercase',
                    fontFamily: FONT,
                  }}
                >
                  {card.bank === 'nubank' ? '💜 Nubank' : '🟠 Inter'}
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    marginBottom: '12px',
                    fontFamily: FONT,
                    letterSpacing: '1px',
                  }}
                >
                  •••• {card.lastDigits}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.6)',
                    marginBottom: '8px',
                    fontFamily: FONT,
                  }}
                >
                  {card.name}
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    height: '3px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      background: 'rgba(255,255,255,0.9)',
                      width: `${percentUsed}%`,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cartão detalhado */}
        <GlassCard delay={0.2}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '20px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '12px',
                  color: colors.textSecondary,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  letterSpacing: '0.05em',
                  fontFamily: FONT,
                }}
              >
                Saldo Disponível
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: colors.greenPrimary,
                  fontFamily: FONT,
                }}
              >
                {brl(available)}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: colors.textSecondary,
                  marginTop: '8px',
                  fontFamily: FONT,
                }}
              >
                De {brl(selectedCard.limit)}
              </div>
            </div>

            <div>
              <div
                style={{
                  fontSize: '12px',
                  color: colors.textSecondary,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                  letterSpacing: '0.05em',
                  fontFamily: FONT,
                }}
              >
                Utilizado
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: colors.warning,
                  fontFamily: FONT,
                }}
              >
                {percentUsed.toFixed(0)}%
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: colors.textSecondary,
                  marginTop: '8px',
                  fontFamily: FONT,
                }}
              >
                {brl(selectedCard.used)} de {brl(selectedCard.limit)}
              </div>
            </div>
          </div>

          {/* Barra de progresso com glow */}
          <div style={{ marginTop: '20px' }}>
            <div
              style={{
                background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                borderRadius: '12px',
                height: '8px',
                overflow: 'hidden',
                boxShadow: theme === 'dark' ? 'inset 0 2px 4px rgba(0,0,0,0.3)' : 'inset 0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentUsed}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${colors.greenPrimary}, ${colors.greenSoft})`,
                  borderRadius: '12px',
                  boxShadow: `0 0 12px ${colors.greenGlow}`,
                }}
              />
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  )
}

// ─── SEÇÃO DE ASSINATURAS ────────────────────────────────────────────────
const SubscriptionsSection = () => {
  const { theme } = useTheme()
  const colors = getColorPalette(theme)

  const subscriptions = [
    { icon: '🎬', name: 'Netflix', amount: 39.9 },
    { icon: '🎵', name: 'Spotify', amount: 19.9 },
    { icon: '📦', name: 'Amazon Prime', amount: 14.9 },
    { icon: '🏋️', name: 'Academia', amount: 89.9 },
  ]

  const total = subscriptions.reduce((sum, s) => sum + s.amount, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{ marginBottom: '32px' }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: colors.textPrimary,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: FONT,
        }}
      >
        <span style={{ fontSize: '24px' }}>🔄</span>
        Assinaturas Ativas
      </h2>

      <GlassCard delay={0.2}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                color: colors.textSecondary,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontFamily: FONT,
              }}
            >
              Gasto Mensal
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: colors.greenPrimary,
                fontFamily: FONT,
              }}
            >
              {brl(total)}
            </div>
          </div>
          <div
            style={{
              fontSize: '40px',
              opacity: 0.6,
            }}
          >
            🔁
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px',
          }}
        >
          {subscriptions.map((sub, idx) => (
            <motion.div
              key={sub.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              style={{
                background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: `1px solid ${colors.border}`,
                borderRadius: '16px',
                padding: '12px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
              }}
              whileHover={{ background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{sub.icon}</div>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: colors.textPrimary,
                  marginBottom: '4px',
                  fontFamily: FONT,
                }}
              >
                {sub.name}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: colors.greenPrimary,
                  fontFamily: FONT,
                }}
              >
                {brl(sub.amount)}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ─── SEÇÃO DE INSIGHTS ────────────────────────────────────────────────────
const InsightsSection = () => {
  const { theme } = useTheme()
  const colors = getColorPalette(theme)

  const insights = [
    {
      icon: '⚠️',
      title: 'Renda Comprometida',
      value: '65%',
      description: 'Despesas obrigatórias representam 65% da renda',
      severity: 'warning',
    },
    {
      icon: '📈',
      title: 'Crescimento Gasto',
      value: '12%',
      description: 'Você gastou 12% acima da semana anterior',
      severity: 'danger',
    },
    {
      icon: '🎯',
      title: 'Meta Emergência',
      value: '72%',
      description: 'Progresso na reserva de emergência',
      severity: 'success',
    },
    {
      icon: '💡',
      title: 'Economia Potencial',
      value: '35%',
      description: 'Lazer cresceu significativamente este mês',
      severity: 'info',
    },
  ]

  const severityColor = {
    warning: colors.warning,
    danger: colors.danger,
    success: colors.greenPrimary,
    info: colors.info,
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ marginBottom: '32px' }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: colors.textPrimary,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: FONT,
        }}
      >
        <span style={{ fontSize: '24px' }}>💡</span>
        Insights Automáticos
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        {insights.map((insight, idx) => (
          <GlassCard key={insight.title} delay={0.3 + idx * 0.05} hover={false}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ fontSize: '28px', minWidth: '32px' }}>{insight.icon}</div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: colors.textPrimary,
                    marginBottom: '4px',
                    fontFamily: FONT,
                  }}
                >
                  {insight.title}
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: severityColor[insight.severity as keyof typeof severityColor],
                    marginBottom: '4px',
                    fontFamily: FONT,
                  }}
                >
                  {insight.value}
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: colors.textSecondary,
                    fontFamily: FONT,
                  }}
                >
                  {insight.description}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  )
}

// ─── SEÇÃO DE METAS ──────────────────────────────────────────────────────
const GoalsSection = () => {
  const { theme } = useTheme()
  const colors = getColorPalette(theme)

  const goals = [
    {
      icon: '🛡️',
      name: 'Reserva de Emergência',
      current: 3600,
      target: 5000,
      color: colors.greenPrimary,
    },
    {
      icon: '✈️',
      name: 'Fundo de Férias',
      current: 1200,
      target: 3000,
      color: colors.info,
    },
    {
      icon: '🪙',
      name: 'Investimento',
      current: 800,
      target: 2000,
      color: colors.warning,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      style={{ marginBottom: '32px' }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: colors.textPrimary,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: FONT,
        }}
      >
        <IcTarget style={{ color: colors.greenPrimary }} />
        Minhas Metas
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '12px',
        }}
      >
        {goals.map((goal, idx) => {
          const progress = (goal.current / goal.target) * 100

          return (
            <GlassCard key={goal.name} delay={0.4 + idx * 0.05}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    fontSize: '32px',
                    minWidth: '40px',
                  }}
                >
                  {goal.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: colors.textPrimary,
                      marginBottom: '6px',
                      fontFamily: FONT,
                    }}
                  >
                    {goal.name}
                  </div>
                  <div
                    style={{
                      background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      borderRadius: '8px',
                      height: '6px',
                      overflow: 'hidden',
                      marginBottom: '6px',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6 }}
                      style={{
                        height: '100%',
                        background: goal.color,
                        borderRadius: '8px',
                        boxShadow: `0 0 8px ${goal.color}33`,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '10px',
                      color: colors.textSecondary,
                      fontFamily: FONT,
                    }}
                  >
                    <span>{brl(goal.current)}</span>
                    <span style={{ color: goal.color, fontWeight: 700 }}>
                      {progress.toFixed(0)}%
                    </span>
                    <span>{brl(goal.target)}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </motion.div>
  )
}

// ─── SEÇÃO DE RECORRÊNCIAS ───────────────────────────────────────────────
const RecurringSection = () => {
  const { theme } = useTheme()
  const colors = getColorPalette(theme)

  const recurring = [
    { icon: '🏠', name: 'Aluguel', amount: 1500, nextDate: '01 Jun' },
    { icon: '🎬', name: 'Netflix', amount: 39.9, nextDate: '25 Mai' },
    { icon: '🏋️', name: 'Academia', amount: 89.9, nextDate: '10 Jun' },
    { icon: '📱', name: 'Spotify', amount: 19.9, nextDate: '28 Mai' },
  ]

  const total = recurring.reduce((sum, r) => sum + r.amount, 0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      style={{ marginBottom: '32px' }}
    >
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 700,
          color: colors.textPrimary,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: FONT,
        }}
      >
        <IcRepeat style={{ color: colors.greenPrimary }} />
        Recorrências
      </h2>

      <GlassCard delay={0.5}>
        <div
          style={{
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              fontSize: '12px',
              color: colors.textSecondary,
              fontWeight: 600,
              textTransform: 'uppercase',
              fontFamily: FONT,
            }}
          >
            Gasto Mensal
          </div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: colors.greenPrimary,
              fontFamily: FONT,
            }}
          >
            {brl(total)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recurring.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                borderRadius: '12px',
                border: `1px solid ${colors.border}`,
                transition: 'all 0.3s ease',
              }}
              whileHover={{ background: theme === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{ fontSize: '20px' }}>{item.icon}</div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: colors.textPrimary,
                      fontFamily: FONT,
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: colors.textSecondary,
                      fontFamily: FONT,
                    }}
                  >
                    Próximo: {item.nextDate}
                  </div>
                </div>
              </div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: colors.greenPrimary,
                  fontFamily: FONT,
                }}
              >
                {brl(item.amount)}
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </motion.div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────
export const InsightsPage = () => {
  const { theme } = useTheme()
  const colors = getColorPalette(theme)

  return (
    <div
      style={{
        padding: '32px',
        background:
          theme === 'dark'
            ? `radial-gradient(
          circle at top left,
          rgba(182, 255, 59, 0.08),
          transparent 30%
        ),
        radial-gradient(
          circle at bottom right,
          rgba(99, 102, 241, 0.08),
          transparent 30%
        ),
        ${colors.bgPrimary}`
            : `radial-gradient(
          circle at top left,
          rgba(16, 185, 129, 0.08),
          transparent 30%
        ),
        radial-gradient(
          circle at bottom right,
          rgba(59, 130, 246, 0.08),
          transparent 30%
        ),
        ${colors.bgPrimary}`,
        minHeight: '100vh',
        fontFamily: FONT,
        transition: 'background 0.3s ease',
      }}
    >
      <ThemeToggleButton />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          marginBottom: '40px',
        }}
      >
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 700,
            color: colors.textPrimary,
            marginBottom: '8px',
            fontFamily: FONT,
          }}
        >
          💳 Gestão de Cartões
        </h1>
        <p
          style={{
            fontSize: '14px',
            color: colors.textSecondary,
            fontFamily: FONT,
          }}
        >
          Acompanhe seus cartões, assinaturas e metas financeiras em {theme === 'dark' ? 'Dark' : 'Light'} Mode
        </p>
      </motion.div>

      {/* Grid de conteúdo */}
      <CreditCardSection />
      <SubscriptionsSection />
      <InsightsSection />
      <GoalsSection />
      <RecurringSection />

      {/* Spacing bottom */}
      <div style={{ height: '32px' }} />
    </div>
  )
}
