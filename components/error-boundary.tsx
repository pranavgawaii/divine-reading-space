"use client"

import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorBoundaryProps {
    children: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-6">
                    <div className="max-w-md w-full text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center">
                                <AlertCircle className="h-8 w-8 text-destructive" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-display font-bold text-foreground">
                                Something went wrong
                            </h1>
                            <p className="text-muted-foreground font-mono text-sm">
                                We encountered an unexpected error. Please try refreshing the page.
                            </p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center px-6 py-3 bg-foreground text-background rounded-sm hover:bg-foreground/90 transition text-xs font-mono font-bold uppercase tracking-widest"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
