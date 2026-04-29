import { ReactNode } from 'react'
import React from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('ErrorBoundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-screen bg-dark-950 flex items-center justify-center flex-col gap-4 p-4">
          <div className="text-red-500 text-center max-w-md">
            <h1 className="text-2xl font-bold mb-2">Erro ao carregar</h1>
            <p className="text-sm break-words">{this.state.error?.message}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
