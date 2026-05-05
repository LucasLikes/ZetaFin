export type TransactionType = 'entrada' | 'despesa'

export interface Transaction {
  id: string
  tipo: TransactionType
  descricao: string
  categoria: string
  valor: number
  data: string // 'DD/MM'
  dataISO?: string
}

export interface Debt {
  id: string
  nome: string
  descricao: string
  total: number
  pago: number
}

 
export type Goal = {
  id: string
  title: string
  description?: string
  targetAmount: number
  currentAmount: number
 
  // ── campos de investimento (opcionais para metas simples) ──
  type?: 'savings' | 'investment'
  yieldRate?: number           // taxa anual, ex: 0.115 = 11.5% ao ano
  monthlyContribution?: number // aporte mensal em R$
 
  createdAt: string
}

export interface DashboardSummary {
  saldo: number
  entradas: number
  despesas: number
  salario: number
  limiteDiario: number
}


