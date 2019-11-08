import React, { useRef, useLayoutEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ThreeJSR from '../ThreeJSR'

function ThreeJSRComponent (props) {
  const dispatch = useDispatch()
  const threejsr = useSelector(_ => _.threejsr)
  const ref = useRef()
  const dim = ref.current && ref.current.getBoundingClientRect()
  const { width, height } = dim || {}

  const [threejs] = useState(() => {
    return new props.ThreeJSR(
      ref,
      timestamp => dispatch({ type: 'THREEJSR', threejsr: { timestamp } })
    )
  })

  useLayoutEffect(() => {
    threejs.afterMount(width, height)
    return () => threejs.cleanup()
  }, [])

  useLayoutEffect(() => {
    threejs.onResize(width, height)
  }, [width, height])

  useLayoutEffect(() => {
    threejs.renderNextFrame(threejsr || {})
  }, [threejsr])

  return (
    <div style={{ width: '100%', height: '100%' }} ref={ref} />
  )
}

ThreeJSRComponent.propTypes = {
  ThreeJSR: (props, propName) => {
    if (!(props[ propName ].prototype instanceof ThreeJSR)) {
      return new Error('ThreeJSR prop should be an instance of ThreeJSR')
    }
  }
}

export default ThreeJSRComponent
