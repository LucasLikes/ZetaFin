import React, { useState, useEffect } from 'react'
import { LOGO_IFOOD, LOGO_BOOKING, LOGO_UBER, LOGO_SPOTIFY, LOGO_NETFLIX, LOGO_VR } from '../../../../assets/logos'
import MkBar from '../mockups/MkBar'
import MkTabs from '../mockups/MkTabs'
import MkDashboard from '../mockups/MkDashboard'
import MkTransactions from '../mockups/MkTransactions'
import MkGoals from '../mockups/MkGoals'
import MkScore from '../mockups/MkScore'

const SLIDES_DATA = [
  {
    tag: 'Painel principal',
    tagIcon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
    title: 'Tudo em um só lugar,',
    titleGreen: 'simples assim',
    desc: 'Quando você abre o ZetaFin, vê tudo que importa de cara — sem precisar procurar. Quanto você tem, quanto já gastou e quanto ainda pode gastar hoje.',
    bullets: [
      { bt: 'Limite diário inteligente', bs: 'O sistema calcula quanto você pode gastar hoje sem comprometer as metas do mês.' },
      { bt: 'Gastos por categoria', bs: 'Alimentação, transporte, lazer — tudo organizado automaticamente sem você fazer nada.' },
      { bt: 'Últimas transações sempre visíveis', bs: 'Veja cada gasto recente com data, horário e valor sem precisar entrar em outra tela.' },
    ],
  },
  {
    tag: 'Registrar gastos',
    tagIcon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    title: 'Anote um gasto em',
    titleGreen: 'menos de 10 segundos',
    desc: 'Sem complicação. Você escolhe o valor, a categoria, e pronto. O ZetaFin cuida do resto — classifica, soma e atualiza seu saldo na hora.',
    bullets: [
      { bt: 'Interface com botões claros e letras grandes', bs: 'Projetado para ser fácil mesmo sem óculos ou em situações de pressa.' },
      { bt: 'Filtre e encontre qualquer lançamento', bs: 'Busca por nome, categoria ou data. Histórico completo sempre ao alcance.' },
      { bt: 'Edite ou exclua quando quiser', bs: 'Errou o valor? Clica, corrige. Sem travamento nem burocracia.' },
    ],
  },
  {
    tag: 'Objetivos financeiros',
    tagIcon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    title: 'Defina uma meta e veja o',
    titleGreen: 'progresso crescer',
    desc: 'Seja uma viagem, um fundo de emergência ou trocar de carro — você cria a meta, coloca o valor e o ZetaFin mostra exatamente o quanto falta.',
    bullets: [
      { bt: 'Barra de progresso visual', bs: 'Você vê o quanto já guardou e o quanto falta — motivação na tela toda vez que abre.' },
      { bt: 'Previsão de conclusão', bs: 'Com base no ritmo atual, o ZetaFin estima quando você vai atingir cada objetivo.' },
      { bt: 'Múltiplas metas simultâneas', bs: 'Crie quantas metas precisar e priorize como quiser.' },
    ],
  },
  {
    tag: 'Score financeiro',
    tagIcon: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'Sua saúde financeira em um',
    titleGreen: 'número claro',
    desc: 'Chega de adivinhar se você está indo bem. O ZetaFin calcula seu score e te diz exatamente o que melhorar — em linguagem simples, sem jargão.',
    bullets: [
      { bt: 'Score de A a F, igual a uma nota escolar', bs: 'Fácil de entender: A+ é excelente, F precisa melhorar. Sem jargão financeiro complicado.' },
      { bt: 'Insights personalizados todo mês', bs: 'O sistema aponta onde você pode economizar com base nos seus próprios hábitos.' },
      { bt: 'Histórico de evolução', bs: 'Veja mês a mês como sua vida financeira melhorou desde que começou a usar o ZetaFin.' },
    ],
  },
]

const SLIDE_LABELS = ['Visão geral', 'Lançamentos', 'Metas', 'Score & Relatórios']

export default function FeaturesSection() {
  const [slide, setSlide] = useState(0)
  const [textVis, setTextVis] = useState(true)
  const [mkVis, setMkVis] = useState(true)

  const goSlide = (i: number) => {
    if (i === slide) return
    setTextVis(false)
    setMkVis(false)
    setTimeout(() => {
      setSlide(i)
      setTextVis(true)
      setMkVis(true)
    }, 160)
  }

  const s = SLIDES_DATA[slide]
  const ckIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>

  return (
    <section className="feat-section" id="funcionalidades">
      <div className="feat-wrap">
        <div className="feat-left">
          <div className="feat-steps-row">
            {SLIDES_DATA.map((_, i) => (
              <button key={i} onClick={() => goSlide(i)} className={`feat-step-dot${i === slide ? ' on' : ''}`} data-i={i} />
            ))}
            <span className="feat-step-label">{SLIDE_LABELS[slide]}</span>
          </div>

          <div style={{ opacity: textVis ? 1 : 0, transition: 'opacity 0.15s ease' }}>
            <div className="feat-tag">{s.tagIcon}{s.tag}</div>
            <h3 className="feat-slide-h">{s.title}<br /><span className="g">{s.titleGreen}</span></h3>
            <p className="feat-slide-p">{s.desc}</p>
            <div className="feat-bullets">
              {s.bullets.map((b, i) => (
                <div className="feat-bullet" key={i}>
                  <div className="feat-bullet-ico">{ckIcon}</div>
                  <div className="feat-bullet-text">
                    <div className="bt">{b.bt}</div>
                    <div className="bs">{b.bs}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="feat-controls">
              <button className="feat-arr" onClick={() => goSlide((slide + 3) % 4)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="feat-arr nxt" onClick={() => goSlide((slide + 1) % 4)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
              <div className="feat-dots">
                {SLIDES_DATA.map((_, i) => (
                  <button key={i} onClick={() => goSlide(i)} className={`feat-dot${i === slide ? ' on' : ''}`} data-i={i} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="feat-right">
          <div className="feat-mockup-wrap" style={{ opacity: mkVis ? 1 : 0, transition: 'opacity 0.35s ease' }}>
            <div className={`feat-mockup${slide === 0 ? ' active' : ''}`} data-mockup="0">
              <MkDashboard />
            </div>
            <div className={`feat-mockup${slide === 1 ? ' active' : ''}`} data-mockup="1">
              <MkTransactions />
            </div>
            <div className={`feat-mockup${slide === 2 ? ' active' : ''}`} data-mockup="2">
              <MkGoals />
            </div>
            <div className={`feat-mockup${slide === 3 ? ' active' : ''}`} data-mockup="3">
              <MkScore />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
