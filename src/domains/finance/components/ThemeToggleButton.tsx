import { useTheme } from '../../../app/providers/ThemeProvider'

const FONT = `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif`

interface ThemeToggleButtonProps {
  /** 'button' = botão com ícone+texto | 'icon' = só ícone compacto */
  variant?: 'button' | 'icon'
  className?: string
}

export const ThemeToggleButton = ({ variant = 'button' }: ThemeToggleButtonProps) => {
  const { isDark, toggleTheme } = useTheme()

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        title={isDark ? 'Modo claro' : 'Modo escuro'}
        style={{
          width: '32px', height: '32px', borderRadius: '8px',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.12)'}`,
          background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)',
          color: isDark ? 'rgba(255,255,255,0.6)' : '#64748B',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', transition: 'all .2s', fontFamily: FONT,
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.08)'
          el.style.color = isDark ? '#fff' : '#0F172A'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLButtonElement
          el.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.04)'
          el.style.color = isDark ? 'rgba(255,255,255,0.6)' : '#64748B'
        }}
      >
        {isDark ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex', alignItems: 'center', gap: '7px',
        padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : '#E2E8F0'}`,
        background: isDark ? 'rgba(255,255,255,0.05)' : 'transparent',
        color: isDark ? 'rgba(255,255,255,0.7)' : '#64748B',
        fontSize: '12px', fontWeight: 600, transition: 'all .2s', fontFamily: FONT,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.05)'
        el.style.color = isDark ? '#fff' : '#0F172A'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = isDark ? 'rgba(255,255,255,0.05)' : 'transparent'
        el.style.color = isDark ? 'rgba(255,255,255,0.7)' : '#64748B'
      }}
    >
      {isDark ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          Modo claro
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          Modo escuro
        </>
      )}
    </button>
  )
}

export default ThemeToggleButton