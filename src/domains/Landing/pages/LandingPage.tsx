import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../app/providers/AuthProvider'
import AuthModal from '../../auth/components/AuthModal'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturesSection from '../components/Features/FeaturesSection'
import '../styles/landing.css'
import {
  LOGO_IFOOD, LOGO_BOOKING, LOGO_UBER,
  LOGO_SPOTIFY, LOGO_NETFLIX, LOGO_AMAZON,
  LOGO_DECOLAR, LOGO_VR,
} from '../../../assets/logos'

const PRICES = {
  m: [
    { val: '9',  cent: ',99', per: '/mês · cobrado mensalmente' },
    { val: '19', cent: ',90', per: '/mês · cobrado mensalmente' },
    { val: '34', cent: ',90', per: '/mês · cobrado mensalmente' },
  ],
  a: [
    { val: '8',  cent: ',09', per: '/mês · cobrado anualmente' },
    { val: '16', cent: ',11', per: '/mês · cobrado anualmente' },
    { val: '28', cent: ',26', per: '/mês · cobrado anualmente' },
  ],
}

const PLANS = [
  { name: 'Starter', feat: false, tag: 'Para quem quer começar a ter controle real das finanças pessoais.', features: ['Lançamentos ilimitados', 'Dashboard com saldo em tempo real', 'Categorias automáticas', 'Histórico de 6 meses', 'Autenticação com Google', 'Alertas de limite diário'], btn: 'Começar agora' },
  { name: 'Pro',     feat: true,  tag: 'Controle avançado com metas, dívidas, alertas e relatórios completos.', features: ['Tudo do Starter', 'Metas financeiras com prazo', 'Controle de dívidas e parcelas', 'Score financeiro personalizado', 'Relatórios mensais em PDF', 'Exportação CSV', 'Suporte prioritário'], btn: 'Assinar Pro' },
  { name: 'Família', feat: false, tag: 'Até 4 contas independentes com dashboard familiar compartilhado.', features: ['Tudo do Pro', '4 contas independentes', 'Dashboard familiar unificado', 'Metas compartilhadas', 'Relatórios consolidados'], btn: 'Assinar Família' },
]

const TESTIMONIALS = [
  { stars: '★★★★★', text: '"Nunca consegui manter um controle financeiro de verdade antes do ZetaFin. O dashboard é tão visual que até minha família começou a usar!"', name: 'M. Ribeiro', role: 'Analista · Sul do Brasil', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80&fit=crop&crop=face' },
  { stars: '★★★★★', text: '"O alerta de limite diário mudou meu jeito de gastar. Em 3 meses já economizei o suficiente para a viagem que planejava há anos."',      name: 'J. Lima',    role: 'Professora · Sudeste',    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&fit=crop&crop=face' },
  { stars: '★★★★☆', text: '"Interface limpa e rápida. Finalmente um app de finanças que não me deixa perdido com dezenas de menus. Simples e direto."',              name: 'F. Costa',   role: 'Desenvolvedor · Brasil',  img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80&fit=crop&crop=face' },
]

const FAQS = [
  { q: 'O ZetaFin é seguro?',                              a: 'Sim. Todos os dados são armazenados no Firebase com criptografia AES-256 — o mesmo padrão dos maiores bancos digitais do Brasil.' },
  { q: 'Como funciona o limite diário inteligente?',        a: 'Ao cadastrar seu salário, o ZetaFin calcula automaticamente quanto você pode gastar por dia sem comprometer suas metas.' },
  { q: 'Posso cancelar minha assinatura a qualquer momento?', a: 'Sim, sem burocracia. Cancele quando quiser pelas configurações da conta.' },
  { q: 'O ZetaFin consegue movimentar meu dinheiro?',      a: 'Não. O ZetaFin não tem acesso às suas contas bancárias. Tudo é registrado manualmente por você.' },
  { q: 'Qual a diferença entre os planos?',                 a: 'O Starter cobre o essencial. O Pro adiciona metas, dívidas, score e relatórios. O Família permite até 4 contas independentes.' },
  { q: 'O ZetaFin funciona no celular?',                    a: 'Sim. É uma PWA e funciona em qualquer browser moderno no celular ou desktop.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthContext()
  const [modal, setModal] = useState<false | 'login' | 'register'>(false)
  const [billing, setBilling] = useState<'m' | 'a'>('m')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  if (isAuthenticated) { navigate('/dashboard'); return null }

  const pr = PRICES[billing]

  return (
    <>
      <Navbar onLoginClick={() => setModal('login')} onRegisterClick={() => setModal('register')} />
      <Hero onGetStartedClick={() => setModal('register')} />
      <FeaturesSection />

      {/* ── SHOWCASE 1 ── */}
      <section className="pr" style={{ background: '#0a0a0a' }}>
        <div className="pr-text">
          <h2 className="pr-h">Surpresas na<br />fatura? Comigo, não</h2>
          <p className="pr-p">Eu sei como é abrir a fatura e não entender nada. Por isso eu organizo tudo pra você não ter surpresa.</p>
          <a href="#" className="pr-btn">Categorizar gastos</a>
        </div>
        <div className="pr-vis">
          <div className="pr-photo"><img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80&fit=crop&crop=top" alt="" /></div>
          <div className="pr-ui left">
            <div className="ui-cat">
              <div className="ui-head">Gastos por categoria · Janeiro</div>
              <div className="ui-total">R$ 2.340,00</div>
              <div className="ui-bar-row"><div className="ui-seg" style={{ background: '#EA1D2C', flex: 2.8 }} /><div className="ui-seg" style={{ background: '#003B95', flex: 2.5 }} /><div className="ui-seg" style={{ background: '#000', flex: 4.7 }} /></div>
              {[{ logo: LOGO_IFOOD, bg: '#EA1D2C', n: 'Alimentação', p: '28%', v: 'R$ 655' }, { logo: LOGO_DECOLAR, bg: '#003B95', n: 'Viagens', p: '25%', v: 'R$ 585' }, { logo: LOGO_UBER, bg: '#000', n: 'Transporte', p: '47%', v: 'R$ 1.100' }].map((r, i) => (
                <div key={i} className="ui-row"><div className="ui-ico" style={{ background: r.bg }}><img src={r.logo} width={28} height={28} style={{ objectFit: 'cover', borderRadius: '7px' }} alt="" /></div><div className="ui-name">{r.n}</div><div className="ui-pct">{r.p}</div><div className="ui-val">{r.v}</div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE 2 ── */}
      <section className="pr rev" style={{ background: '#0d0d0d' }}>
        <div className="pr-text">
          <h2 className="pr-h">Entenda o que pesa<br />no próximo mês</h2>
          <p className="pr-p">Saiba exatamente o que vai sair da sua conta: assinaturas, boletos e parcelas.</p>
          <a href="#" className="pr-btn">Planejar finanças</a>
        </div>
        <div className="pr-vis">
          <div className="pr-photo"><img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80&fit=crop&crop=top" alt="" /></div>
          <div className="pr-ui right">
            <div className="ui-subs">
              <div className="ui-head">Assinaturas · próximo mês</div>
              <div className="sub-grid">
                {[{ logo: LOGO_SPOTIFY, bg: '#1DB954', n: 'Spotify', v: 'R$ 22', d: 'Em 12 dias' }, { logo: LOGO_NETFLIX, bg: '#E50914', n: 'Netflix', v: 'R$ 32', d: 'Em 22 dias' }, { logo: LOGO_AMAZON, bg: '#FF9900', n: 'Amazon', v: 'R$ 17', d: 'Em 20 dias' }].map((sub, i) => (
                  <div key={i} className="sub-c"><div className="sub-ico" style={{ background: sub.bg }}><img src={sub.logo} width={42} height={42} style={{ objectFit: 'cover', borderRadius: '12px' }} alt="" /></div><div className="sub-name">{sub.n}</div><div className="sub-val">{sub.v}</div><div className="sub-days">{sub.d}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOWCASE 3 ── */}
      <section className="pr" style={{ background: '#0a0a0a' }}>
        <div className="pr-text">
          <h2 className="pr-h">Defina objetivos,<br /><span className="g">conquiste metas</span></h2>
          <p className="pr-p">Viagem, reserva de emergência, quitação de dívida — crie metas com prazo real e acompanhe o progresso visualmente.</p>
          <a href="#" className="pr-btn">Criar minha meta</a>
        </div>
        <div className="pr-vis">
          <div className="pr-photo"><img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&q=80&fit=crop&crop=top" alt="" /></div>
          <div className="pr-ui left">
            <div className="ui-metas">
              <div className="ui-head">Minhas metas</div>
              {[{ name: '✈ Viagem para Europa', pct: 62, color: 'var(--g)', cur: 'R$ 930', tot: 'R$ 1.500', prazo: 'Jul 2025' }, { name: '🛡 Reserva emergência', pct: 35, color: 'var(--g)', cur: 'R$ 4.200', tot: 'R$ 12.000', prazo: 'Dez 2025' }, { name: '💳 Quitar dívida', pct: 18, color: '#fb7185', cur: 'R$ 900', tot: 'R$ 5.000', prazo: 'Mar 2026' }].map((m, i) => (
                <div key={i} className="meta-row"><div className="meta-top"><span className="meta-name">{m.name}</span><span className="meta-pct" style={{ color: m.color }}>{m.pct}%</span></div><div className="meta-bar"><div className="meta-fill" style={{ width: `${m.pct}%`, background: m.color }} /></div><div className="meta-bot"><span>{m.cur} / {m.tot}</span><span>{m.prazo}</span></div></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section className="pricing" id="planos" style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div className="sc">
          <div className="sec-tag">Planos e preços</div>
          <h2 className="sec-h2">Simples e <span className="g">sem surpresas</span></h2>
          <p className="sec-p" style={{ margin: '12px auto 0' }}>Comece por R$&nbsp;9,99 e escale conforme suas necessidades.</p>
        </div>
        <div className="bill-tog">
          <button className={`tb${billing === 'm' ? ' on' : ''}`} onClick={() => setBilling('m')}>Mensal</button>
          <button className={`tb${billing === 'a' ? ' on' : ''}`} onClick={() => setBilling('a')}>Anual <span className="db">−19%</span></button>
        </div>
        <div className="plans">
          {PLANS.map((plan, i) => (
            <div key={plan.name} className={`pc${plan.feat ? ' feat' : ''}`}>
              {plan.feat ? <div className="ppop">Mais popular</div> : <div className="pt-spacer" />}
              <div className="pt">{plan.name}</div>
              <div className="pp"><span className="pp-cur">R$</span><span className="pp-val">{pr[i].val}</span><span className="pp-cent">{pr[i].cent}</span></div>
              <div className="pper">{pr[i].per}</div>
              <div className="ptag">{plan.tag}</div>
              <div className="psep" />
              <ul className="pfl">{plan.features.map(f => <li key={f}><span className="pck">✓</span>{f}</li>)}</ul>
              <button className="pbtn" onClick={() => setModal('register')}>{plan.btn}</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="sec" id="dep" style={{ padding: '88px 6%' }}>
        <div className="sc">
          <div className="sec-tag">Depoimentos</div>
          <h2 className="sec-h2">O que as pessoas <span className="g">estão dizendo</span></h2>
        </div>
        <div className="tg">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="tc">
              <div className="tc-stars">{t.stars}</div>
              <div className="tc-text">{t.text}</div>
              <div className="tc-author">
                <div className="tc-av"><img src={t.img} alt="" /></div>
                <div><div className="tc-name">{t.name}</div><div className="tc-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sec" id="faq" style={{ padding: '88px 6% 80px' }}>
        <div className="sc">
          <h2 className="sec-h2" style={{ fontSize: 'clamp(2.2rem,4.5vw,3.6rem)', letterSpacing: '-2px', fontWeight: 900 }}>Perguntas Frequentes</h2>
          <p className="sec-p" style={{ margin: '12px auto 0' }}>Tire suas dúvidas sobre o ZetaFin e como ele pode ajudar suas finanças.</p>
        </div>
        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
              <button className={`faq-q${openFaq === i ? ' open' : ''}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <span>{faq.q}</span>
                <span className="faq-ico-wrap">
                  <svg className="faq-ico" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="6" y1="1" x2="6" y2="11" /><line x1="1" y1="6" x2="11" y2="6" />
                  </svg>
                </span>
              </button>
              {openFaq === i && <div className="faq-a open">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <h2 className="cta-h">Comece hoje a <span className="g">controlar</span><br />seu dinheiro</h2>
        <p className="cta-p">Sem burocracia, sem complicação.<br />Configure em menos de 5 minutos.</p>
        <div className="cta-form">
          <input type="email" className="ci" placeholder="Seu melhor e-mail" />
          <button className="bw" style={{ whiteSpace: 'nowrap', padding: '14px 28px' }} onClick={() => setModal('register')}>Criar conta →</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="fg">
          <div>
            <a href="#" className="nl" style={{ textDecoration: 'none' }}><div className="lb">Z</div>ZetaFin</a>
            <p className="fbd">Controle financeiro pessoal inteligente — desenvolvido com no Brasil.</p>
          </div>
          {[{ title: 'Produto', links: ['Funcionalidades', 'Planos', 'Roadmap', 'Changelog'] }, { title: 'Suporte', links: ['Central de ajuda', 'Documentação', 'Contato', 'GitHub'] }, { title: 'Legal', links: ['Termos de uso', 'Privacidade', 'Segurança', 'LGPD'] }].map(col => (
            <div key={col.title}><div className="fct">{col.title}</div><ul className="fl">{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul></div>
          ))}
        </div>
        <div className="fb"><span>© 2026 ZetaFin. Todos os direitos reservados.</span></div>
      </footer>

      {modal && <AuthModal initialPanel={modal} onClose={() => setModal(false)} />}
    </>
  )
}