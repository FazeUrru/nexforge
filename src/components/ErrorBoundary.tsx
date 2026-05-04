'use client'

import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
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

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-[oklch(0.1_0.02_260)] border border-red-500/20 text-center max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h3 className="text-lg font-bold mb-2">Algo salió mal</h3>
          <p className="text-sm text-[oklch(0.5_0.02_200)] mb-4 leading-relaxed">
            La IA tuvo un problema inesperado. Esto no es tu culpa — intenta de nuevo y funcionará.
          </p>
          {this.state.error && (
            <p className="text-xs text-[oklch(0.4_0.02_200)] mb-4 font-mono bg-[oklch(0.08_0.02_260)] px-3 py-2 rounded-lg max-w-full truncate">
              {this.state.error.message}
            </p>
          )}
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#06d6a0] to-[#00ffc8] text-[#0a0f1c] text-sm font-bold hover:shadow-[0_0_20px_rgba(6,214,160,0.3)] transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Intentar de nuevo
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
