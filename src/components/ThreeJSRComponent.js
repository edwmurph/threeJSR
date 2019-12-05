import React, { useRef, useLayoutEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import ThreeJSR from '../ThreeJSR'

function ThreeJSRComponent (props) {
  const ref = useRef()

  const dispatch = useDispatch()

  const threejsr = useSelector(_ => _.threejsr)

  const [{ width, height }, setDims] = useState({})
  const [threejs] = useState(() => {
    return new props.ThreeJSR(ref, timestamp => dispatch({
      type: 'THREEJSR',
      threejsr: {
        name: props.name,
        timestamp
      }
    }))
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
    if (threejsr.name === props.name) {
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
  name: PropTypes.string.isRequired,
  style: PropTypes.object
}

export default ThreeJSRComponent
