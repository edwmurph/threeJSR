import React, { useRef, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ThreeJSR from '../ThreeJSR'
import './ThreeJSRComponent.css'

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
