import React from 'react'
import MkBar from './MkBar'
import MkTabs from './MkTabs'

export default function MkScore() {
  return (
    <>
      <MkBar page="Score & Relatórios" />
      <MkTabs active="Score & Relatórios" />
      <div className="mk-score-area">
        <div className="mk-score-hero">
          <div className="mk-score-circle">
            <span className="mk-score-val">72</span>
          </div>
          <div>
            <div className="mk-score-grade">B+</div>
            <div className="mk-score-change">↑ subiu 1 nível este mês</div>
            <div className="mk-score-desc">Você está no caminho certo. Reduza assinaturas para subir para A.</div>
          </div>
        </div>
        <div className="mk-insight-title">Insights do mês</div>
        <div className="mk-insights">
          {[
            { ico: '⚠️', bg: 'rgba(251,113,133,.1)', text: <><strong>Alimentação subiu 18%</strong> em relação ao mês passado.</> },
            { ico: '✅', bg: 'rgba(34,197,94,.1)',    text: <><strong>Transporte caiu 12%</strong> — você economizou R$ 66.</> },
            { ico: '💡', bg: 'rgba(251,191,36,.1)',   text: <>Você tem <strong>4 assinaturas ativas</strong> — R$ 128,90/mês.</> },
          ].map((ins, i) => (
            <div key={i} className="mk-insight">
              <div className="mk-insight-ico" style={{ background: ins.bg }}>{ins.ico}</div>
              <div className="mk-insight-text">{ins.text}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
