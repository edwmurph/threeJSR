import React from 'react'
import { connect } from 'react-redux'

class Component extends React.Component {
  constructor(props) {
    super(props)
    this.ref = React.createRef()
    this.threejs = new this.props.ThreeJS(
      this.ref,
      timestamp => this.props.update({ timestamp }),
    )
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
      <div ref={this.ref} onMouseDown={this.props.mouseDown} />
    )
  }
}

function mapStateToProps(state) {
  return {
    timestamp: state.timestamp,
    mouse: state.mouse,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    update: timestamp => dispatch({
      type: 'TIMESTAMP',
      timestamp,
    }),
    mouseDown: e => dispatch({
      type: 'MOUSE_DOWN',
      mouse: {
        x: e.screenX,
        y: e.screenY,
      },
    }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
