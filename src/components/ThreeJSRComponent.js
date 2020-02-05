import React, { useRef, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import ThreeJSR from '../ThreeJSR'

function ThreeJSRComponent (props) {
  const ref = useRef()

  const dispatch = useDispatch()

  const timestamp = useSelector(_ => _.threejsr[props.namespace].timestamp)

  const [{ width, height }, setDims] = useState({})

  // called by `requestAnimationFrame()`
  const newFrameHook = timestamp => {
    return dispatch({
      type: 'THREEJSR',
      threejsr: {
        [props.namespace]: {
          timestamp
        }
      }
    })
  }

  const [threejs] = useState(() => new props.ThreeJSR(ref, newFrameHook))

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
  namespace: PropTypes.string.isRequired,
  style: PropTypes.object
}

export default ThreeJSRComponent
