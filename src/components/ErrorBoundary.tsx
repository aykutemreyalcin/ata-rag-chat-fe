import { Component, type ErrorInfo, type ReactNode } from 'react'
import './ErrorBoundary.css'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled UI error', error, info.componentStack)
  }

  private handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary" role="alert">
          <h1>Something went wrong</h1>
          <p>
            The app hit an unexpected error. You can reload the page or return
            to chat.
          </p>
          <p className="error-boundary__detail">{this.state.error.message}</p>
          <div className="error-boundary__actions">
            <button type="button" onClick={this.handleReload}>
              Reload page
            </button>
            <a href="/">Go to chat</a>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
