import React, { useRef, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import ThreeJSR from '../ThreeJSR'

function uuid () {
  let dt = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

function ThreeJSRComponent (props) {
  const ref = useRef()

  const dispatch = useDispatch()

  const threejsr = useSelector(_ => _.threejsr)

  // needed to prevent multiple rendered threejs scenes from triggering
  // eachother's update loop
  const [id] = useState(uuid())
  const [{ width, height }, setDims] = useState({})
  const [threejs] = useState(() => {
    return new props.ThreeJSR(
      ref,
      timestamp => dispatch({ type: 'THREEJSR', threejsr: { id, timestamp } })
    )
  })

  useLayoutEffect(() => {
    threejs.afterMount(width, height)
    const dims = ref.current.getBoundingClientRect()
    setDims({ width: dims.width, height: dims.height })
    return () => threejs.cleanup()
  }, [])

  // sync threejs render to dimensions provided by parent
  useLayoutEffect(() => {
    threejs.onResize(width, height)
  }, [width, height])

  // animation loop
  useLayoutEffect(() => {
    if (threejsr.id === id) {
      threejs.renderNextFrame(threejsr || {})
      const dims = ref.current.getBoundingClientRect()
      setDims({ width: dims.width, height: dims.height })
    }
  }, [threejsr])

  return (
    <div style={{ width: '100%', height: '100%', ...props.style }} ref={ref} />
  )
}

ThreeJSRComponent.propTypes = {
  ThreeJSR: (props, propName) => {
    if (!(props[ propName ].prototype instanceof ThreeJSR)) {
      return new Error('ThreeJSR prop should be an instance of ThreeJSR')
    }
  },
  style: PropTypes.object
}

export default ThreeJSRComponent
