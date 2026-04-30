import type { Transaction, Debt, DashboardSummary } from '../types'

const delay = (ms = 600) => new Promise(r => setTimeout(r, ms))

// ─── dados mock ──────────────────────────────────────────────
let _transactions: Transaction[] = [
  { id:'t1', tipo:'despesa',  descricao:'Supermercado Extra',  categoria:'Alimentação',  valor:287.50, data:'29/05' },
  { id:'t2', tipo:'entrada',  descricao:'Salário maio',        categoria:'Salário',      valor:4200,   data:'28/05' },
  { id:'t3', tipo:'despesa',  descricao:'Uber',                categoria:'Transporte',   valor:34.90,  data:'28/05' },
  { id:'t4', tipo:'despesa',  descricao:'iFood',               categoria:'Alimentação',  valor:68.00,  data:'27/05' },
  { id:'t5', tipo:'entrada',  descricao:'Freelance — site',    categoria:'Freelance',    valor:1000,   data:'26/05' },
  { id:'t6', tipo:'despesa',  descricao:'Conta de luz',        categoria:'Moradia',      valor:189.30, data:'25/05' },
  { id:'t7', tipo:'despesa',  descricao:'Netflix + Spotify',   categoria:'Assinaturas',  valor:67.90,  data:'24/05' },
  { id:'t8', tipo:'despesa',  descricao:'Farmácia',            categoria:'Saúde',        valor:45.00,  data:'23/05' },
  { id:'t9', tipo:'despesa',  descricao:'Gasolina',            categoria:'Transporte',   valor:120.00, data:'22/05' },
  { id:'t10',tipo:'despesa',  descricao:'Cinema',              categoria:'Lazer',        valor:58.00,  data:'21/05' },
]

let _debts: Debt[] = [
  { id:'d1', nome:'Empréstimo Banco',  descricao:'12x de R$ 520', total:5200, pago:3536 },
  { id:'d2', nome:'Cartão Nubank',     descricao:'Fatura aberta', total:1400, pago:308  },
]

let _salario = 5200

// ─── service ─────────────────────────────────────────────────
export const financeService = {
  async getDashboard(): Promise<DashboardSummary> {
    await delay(400)
    const entradas = _transactions.filter(t => t.tipo === 'entrada').reduce((a, t) => a + t.valor, 0)
    const despesas = _transactions.filter(t => t.tipo === 'despesa').reduce((a, t) => a + t.valor, 0)
    const diasNoMes = 30
    const diaAtual = new Date().getDate()
    const diasRestantes = Math.max(diasNoMes - diaAtual, 1)
    const saldo = entradas - despesas
    const limiteDiario = Math.max(saldo / diasRestantes, 0)
    return { saldo, entradas, despesas, salario: _salario, limiteDiario }
  },

  async getTransactions(): Promise<Transaction[]> {
    await delay(500)
    return [..._transactions]
  },

  async addTransaction(tx: Omit<Transaction, 'id'>): Promise<Transaction> {
    await delay(400)
    const now = new Date()
    const nova: Transaction = {
      ...tx,
      id: `t${Date.now()}`,
      data: `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}`,
    }
    _transactions = [nova, ..._transactions]
    return nova
  },

  async deleteTransaction(id: string): Promise<void> {
    await delay(300)
    _transactions = _transactions.filter(t => t.id !== id)
  },

  async getDebts(): Promise<Debt[]> {
    await delay(400)
    return [..._debts]
  },

  async addDebt(d: Omit<Debt, 'id' | 'pago'>): Promise<Debt> {
    await delay(400)
    const nova: Debt = { ...d, id: `d${Date.now()}`, pago: 0 }
    _debts = [..._debts, nova]
    return nova
  },

  async payDebt(id: string, valor: number): Promise<Debt> {
    await delay(400)
    _debts = _debts.map(d => d.id === id ? { ...d, pago: Math.min(d.pago + valor, d.total) } : d)
    return _debts.find(d => d.id === id)!
  },

  async deleteDebt(id: string): Promise<void> {
    await delay(300)
    _debts = _debts.filter(d => d.id !== id)
  },

  async getSalario(): Promise<number> {
    await delay(200)
    return _salario
  },

  async setSalario(valor: number): Promise<void> {
    await delay(300)
    _salario = valor
  },
}
