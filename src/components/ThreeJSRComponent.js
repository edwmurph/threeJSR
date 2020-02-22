import React, { useRef, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import ThreeJSR from '../ThreeJSR'

function ThreeJSRComponent (props) {
  const ref = useRef()

  const [{ width, height }, setDims] = useState({})
  const [timestamp, setTimestamp] = useState()

  const [threejs] = useState(() => new props.ThreeJSR(ref, setTimestamp))

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
    const renderLoopData = { ...(props.renderLoopData || {}), timestamp }
    threejs.renderNextFrame(renderLoopData)
    const dims = ref.current.getBoundingClientRect()
    setDims({ width: dims.width, height: dims.height })
  }, [props.renderLoopData, timestamp])

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
