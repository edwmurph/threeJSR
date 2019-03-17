import React from 'react'
import ThreeJSComponent from './ThreeJSComponent'
import ErrorBoundary from './ErrorBoundary'

export default class SafeThreeJS extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <ThreeJSComponent ThreeJS={this.props.ThreeJS} />
      </ErrorBoundary>
    )
  }
}
