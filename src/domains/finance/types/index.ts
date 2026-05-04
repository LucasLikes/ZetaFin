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

export interface DashboardSummary {
  saldo: number
  entradas: number
  despesas: number
  salario: number
  limiteDiario: number
}
