import React from 'react'
import ThreeJSRComponent from './ThreeJSRComponent'
import ErrorBoundary from './ErrorBoundary'

export default class SafeThreeJSRComponent extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <ThreeJSRComponent
          ThreeJSR={this.props.ThreeJSR}
          events={this.props.events}
        />
      </ErrorBoundary>
    )
  }
}
