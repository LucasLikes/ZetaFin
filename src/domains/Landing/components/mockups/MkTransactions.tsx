import React from 'react'
import MkBar from './MkBar'
import MkTabs from './MkTabs'
import { LOGO_IFOOD, LOGO_UBER, LOGO_SPOTIFY, LOGO_NETFLIX, LOGO_VR } from '../../../../assets/logos'

export default function MkTransactions() {
  return (
    <>
      <MkBar page="Lançamentos" pill="Junho 2025" />
      <MkTabs active="Lançamentos" />
      <div className="mk-toolbar">
        <div className="mk-srch">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Buscar...
        </div>
        <div className="mk-fbtn">Filtrar</div>
        <div className="mk-addbtn">Novo</div>
      </div>
      <div className="mk-list">
        {[
          {
            date: 'Hoje — 14 Jun',
            items: [
              { logo: LOGO_IFOOD, bg: '#EA1D2C', n: 'iFood — Delivery', cat: 'Alimentação · 12:34', v: '−R$ 42,00', neg: true },
              { logo: LOGO_UBER,  bg: '#000',    n: 'Uber — Corrida',   cat: 'Transporte · 09:15', v: '−R$ 18,90', neg: true },
            ],
          },
          {
            date: 'Ontem — 13 Jun',
            items: [
              { logo: LOGO_SPOTIFY, bg: '#1DB954', n: 'Spotify', cat: 'Assinatura · 08:00', v: '−R$ 22,00', neg: true },
              { logo: LOGO_NETFLIX, bg: '#E50914', n: 'Netflix', cat: 'Assinatura · 08:00', v: '−R$ 44,90', neg: true },
            ],
          },
          {
            date: '01 Jun',
            items: [
              { logo: LOGO_VR, bg: '#00873f', n: 'VR — Vale Refeição', cat: 'Receita · 08:00', v: '+R$ 600,00', neg: false },
            ],
          },
        ].map(grp => (
          <div key={grp.date} className="mk-list-grp">
            <div className="mk-list-date">{grp.date}</div>
            {grp.items.map((row, i) => (
              <div key={i} className="mk-list-row">
                <div className="mk-list-ico" style={{ background: row.bg, borderRadius: '8px' }}>
                  <img src={row.logo} width={28} height={28} style={{ display: 'block', borderRadius: '7px', objectFit: 'cover' }} alt="" />
                </div>
                <div className="mk-list-info">
                  <div className="mk-list-name">{row.n}</div>
                  <div className="mk-list-cat">{row.cat}</div>
                </div>
                <div className={`mk-list-val ${row.neg ? 'neg' : 'pos'}`}>{row.v}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
