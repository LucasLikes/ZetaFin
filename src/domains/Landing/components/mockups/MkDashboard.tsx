import React from 'react'
import MkBar from './MkBar'
import MkTabs from './MkTabs'
import { LOGO_IFOOD, LOGO_UBER, LOGO_SPOTIFY, LOGO_VR, LOGO_BOOKING } from '../../../../assets/logos'

export default function MkDashboard() {
  return (
    <>
      <MkBar page="Dashboard" pill="Limite hoje" pillVal="R$ 85" bell="2" />
      <MkTabs active="Dashboard" />
      <div className="mk-body">
        <div className="mk-kpis">
          {[
            { l: 'Saldo',    v: 'R$ 4.820', c: '▲ +12%',   hi: true,  up: true  },
            { l: 'Gastos',   v: 'R$ 2.340', c: '▼ −8%',    hi: false, up: false },
            { l: 'Receitas', v: 'R$ 7.160', c: '▲ +3%',    hi: false, up: true  },
            { l: 'Score',    v: 'B+',        c: '+1 nível', hi: true,  up: true  },
          ].map(k => (
            <div key={k.l} className={`mk-kpi${k.hi ? ' hi' : ''}`}>
              <div className="mk-kl">{k.l}</div>
              <div className={`mk-kv${k.hi ? ' g' : ''}`}>{k.v}</div>
              <div className={`mk-kg ${k.up ? 'up' : 'dn'}`}>{k.c}</div>
            </div>
          ))}
        </div>
        <div className="mk-panels">
          <div className="mk-panel">
            <div className="mk-ptitle">Gastos por semana</div>
            <div className="mk-spark">
              <svg viewBox="0 0 220 52" width="100%" height="52" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity=".28" />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 42 L55 28 L110 36 L165 16 L220 22" stroke="#22c55e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                <path d="M0 42 L55 28 L110 36 L165 16 L220 22 V52 H0 Z" fill="url(#sg)" />
              </svg>
              <div className="mk-slabels"><span>S1</span><span>S2</span><span>S3</span><span>S4</span></div>
            </div>
            <div className="mk-cats">
              {[['#EA1D2C','Alimentação','R$ 655'],['#3b82f6','Transporte','R$ 480'],['#8b5cf6','Lazer','R$ 320'],['#f59e0b','Outros','R$ 885']].map(([c,n,v]) => (
                <div key={n} className="mk-cat">
                  <span className="mk-cdot" style={{ background: c }} />{n}<span className="mk-cval">{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mk-panel" style={{ flex: '1.4' }}>
            <div className="mk-ptitle">Últimas transações <a>Ver →</a></div>
            <div className="mk-txlist">
              {[
                { logo: LOGO_IFOOD,   bg: '#EA1D2C', n: 'iFood — Delivery',   d: 'Hoje · 12:34',  v: '−R$ 42,00',  neg: true  },
                { logo: LOGO_UBER,    bg: '#000',    n: 'Uber — Corrida',     d: 'Hoje · 09:15',  v: '−R$ 18,90',  neg: true  },
                { logo: LOGO_SPOTIFY, bg: '#1DB954', n: 'Spotify',            d: 'Ontem · 08:00', v: '−R$ 22,00',  neg: true  },
                { logo: LOGO_VR,      bg: '#00873f', n: 'VR — Vale Refeição', d: '01 Jun',        v: '+R$ 600,00', neg: false },
                { logo: LOGO_BOOKING, bg: '#003B95', n: 'Booking — Hotel',    d: '28 Mai',        v: '−R$ 120,00', neg: true  },
              ].map((tx, i) => (
                <div key={i} className="mk-txrow">
                  <div className="mk-txico" style={{ background: tx.bg, borderRadius: '7px' }}>
                    <img src={tx.logo} width={24} height={24} style={{ display: 'block', borderRadius: '6px', objectFit: 'cover' }} alt="" />
                  </div>
                  <div className="mk-txinfo">
                    <div className="mk-txname">{tx.n}</div>
                    <div className="mk-txdate">{tx.d}</div>
                  </div>
                  <div className={`mk-txval ${tx.neg ? 'neg' : 'pos'}`}>{tx.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
