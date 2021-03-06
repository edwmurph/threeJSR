import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  componentDidCatch(error) {
    console.error('ErrorBoundary: ', error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className='errorMsg'>
          <h2>{this.state.error.message}</h2>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
