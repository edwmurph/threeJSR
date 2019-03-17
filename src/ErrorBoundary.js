import './ErrorBoundary.css'

import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error }
  }

  componentDidCatch(error) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary: ', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="errorMsg">
          <h2>{this.state.error.message}</h2>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
