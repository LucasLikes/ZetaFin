import { useState, useEffect, useCallback } from 'react'
import type { Transaction, Debt, DashboardSummary } from '../types'
import { financeService } from '../services/finance.service'

export const useFinance = () => {
  const [summary, setSummary]           = useState<DashboardSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [debts, setDebts]               = useState<Debt[]>([])
  const [loading, setLoading]           = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const [s, t, d] = await Promise.all([
        financeService.getDashboard(),
        financeService.getTransactions(),
        financeService.getDebts(),
      ])
      setSummary(s)
      setTransactions(t)
      setDebts(d)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const addTransaction = useCallback(async (tx: Omit<Transaction, 'id'>) => {
    await financeService.addTransaction(tx)
    await refresh()
  }, [refresh])

  const deleteTransaction = useCallback(async (id: string) => {
    await financeService.deleteTransaction(id)
    await refresh()
  }, [refresh])

  const addDebt = useCallback(async (d: Omit<Debt, 'id' | 'pago'>) => {
    await financeService.addDebt(d)
    await refresh()
  }, [refresh])

  const payDebt = useCallback(async (id: string, valor: number) => {
    await financeService.payDebt(id, valor)
    await refresh()
  }, [refresh])

  const deleteDebt = useCallback(async (id: string) => {
    await financeService.deleteDebt(id)
    await refresh()
  }, [refresh])

  return {
    summary, transactions, debts, loading, refresh,
    addTransaction, deleteTransaction,
    addDebt, payDebt, deleteDebt,
  }
}
