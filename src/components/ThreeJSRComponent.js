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
    for (let key in this.props.events || {}) {
      this.events[key] = function(e) {
        return this.props.threeJSR(
          this.props.events[key](e)
        )
      }
      this.events[key] = this.events[key].bind(this)
    }
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
