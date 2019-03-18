import React from 'react'
import { connect } from 'react-redux'

class ThreeJSRComponent extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.threejs = new this.props.ThreeJSR(
      this.ref,
      timestamp => this.props.update({ timestamp }),
    )

    this.events = {}
    Object.entries(this.props.events || {}).forEach(([key, fn]) => {
      this.events[key] = e => this.props.threeJSR( fn(e) )
    })
  }

  componentDidMount() {
    this.threejs.afterMount()
  }

  componentDidUpdate() {
    this.threejs.renderNextFrame(this.props)
  }

  componentWillUnmount() {
    this.threejs.cleanup()
  }

  render() {
    return (
      <div ref={this.ref} {...this.events} />
    )
  }
}

function mapStateToProps(state) {
  return {
    timestamp: state.timestamp,
    threejsr: state.threejsr,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    update: timestamp => dispatch({
      type: 'TIMESTAMP',
      timestamp,
    }),
    threeJSR: e => dispatch({
      type: 'THREEJSR',
      e
    })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreeJSRComponent)
