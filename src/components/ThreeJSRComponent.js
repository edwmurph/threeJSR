import React, { useGlobal, useRef, useEffect, useState } from 'reactn'
import { ThreeJSR } from 'threejs-r'
import './ThreeJSRComponent.css'

function ThreeJSRComponent (props) {
  const [threejsr, setThreejsr] = useGlobal('threejsr')
  const ref = useRef()
  const dim = ref.current && ref.current.getBoundingClientRect()
  const { width, height } = dim || {}

  const [threejs] = useState(() => {
    return new props.ThreeJSR(ref, timestamp => setThreejsr({ timestamp }))
  })

  useEffect(() => {
    threejs.afterMount(width, height)
    return () => threejs.cleanup()
  }, [])

  useEffect(() => {
    threejs.onResize(width, height)
  }, [width, height])

  useEffect(() => {
    threejs.renderNextFrame(threejsr || {})
  }, [threejsr])

  return (
    <div className='full-screen fixed-top z--1' ref={ref} />
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
