import React from 'react'

interface NavbarProps {
  onLoginClick: () => void
  onRegisterClick: () => void
}

export default function Navbar({ onLoginClick, onRegisterClick }: NavbarProps) {
  return (
    <nav>
      <a href="#" className="nl">
        <div className="lb">Z</div>
        ZetaFin
      </a>
      <ul className="nm">
        <li><a href="#funcionalidades">Funcionalidades</a></li>
        <li><a href="#planos">Planos</a></li>
        <li><a href="#dep">Depoimentos</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
      <div className="nr">
        <button className="bng" onClick={onLoginClick}>Entrar</button>
        <button className="bnw" onClick={onRegisterClick}>Começar agora</button>
      </div>
    </nav>
  )
}
