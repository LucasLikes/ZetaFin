import React from 'react'
import {
  LOGO_IFOOD, LOGO_BOOKING, LOGO_UBER, LOGO_VR
} from '../../../assets/logos'

interface HeroProps {
  onGetStartedClick: () => void
}

export default function Hero({ onGetStartedClick }: HeroProps) {
  return (
    <section className="hero" style={{ background: '#0a0a0a' }}>
      <div className="hero-glow" />
      <div className="hero-left">
        <h1 className="hero-h1">Não gerencie<br />mais seu dinheiro<br /><span className="g">sozinho</span></h1>
        <p className="hero-p">ZetaFin monitora, organiza e te ajuda a tomar decisões financeiras mais inteligentes — sem burocracia, sem complicação.</p>
        <div className="hero-btns">
          <button className="bw" onClick={onGetStartedClick}>Começar agora</button>
          <a href="#funcionalidades" className="bo">Como funciona →</a>
        </div>
        <div className="hero-stats">
          {[['98', '%', 'Satisfação'], ['R$', '0', 'Para começar'], ['5', 'min', 'Para configurar'], ['100', '%', 'Seguro']].map(([a, b, lbl], i) => (
            <div key={i}>
              <div className="hs-num">{i === 1 ? <><span className="g">{a}</span>{b}</> : <>{a}<span className="g">{b}</span></>}</div>
              <div className="hs-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-photo">
          <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=85&fit=crop&crop=top" alt="Pessoa usando ZetaFin" />
          <div className="hero-bal">
            <div>
              <div className="hb-lbl">Saldo disponível</div>
              <div className="hb-amount">R$ 4.820</div>
              <div className="hb-chg">▲ +12% este mês</div>
            </div>
            <div className="hb-right">
              <div className="hb-slbl">Score</div>
              <div className="hb-score">B+</div>
              <div className="hb-ssub">↑ subindo</div>
            </div>
          </div>
        </div>
        <div className="tx-stack">
          {[
            { logo: LOGO_IFOOD, bg: '#EA1D2C', name: 'Delivery de comida', sub: 'Alimentação · 28 Jun', val: 'R$ 42,00', pos: false },
            { logo: LOGO_BOOKING, bg: '#003B95', name: 'Hospedagem', sub: 'Viagens · 24 Jun', val: 'R$ 120,00', pos: false },
            { logo: LOGO_UBER, bg: '#000', name: 'Corrida', sub: 'parcela 1/4 · 28 Jun', val: 'R$ 120,00', pos: false },
            { logo: LOGO_VR, bg: '#2d7a3a', name: 'Vale Refeição VR', sub: 'Receita · 01 Jun', val: 'R$ 600,00', pos: true },
          ].map((tx, i) => (
            <div className="txc" key={i}>
              <div className="aico" style={{ background: tx.bg, borderRadius: '9px' }}>
                <img src={tx.logo} width={32} height={32} alt="" style={{ borderRadius: '8px', objectFit: 'cover' }} />
              </div>
              <div className="tx-d">
                <div className="tx-n">{tx.name}</div>
                <div className="tx-s">{tx.sub}</div>
              </div>
              <div className={`tx-v ${tx.pos ? 'pos' : 'neg'}`}>{tx.val}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
