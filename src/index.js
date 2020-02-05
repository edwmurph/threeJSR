import ThreeJSRComponent from './components/ThreeJSRComponent'
import ThreeJSR from './ThreeJSR'
import reducer from './reducers/index'

const updateThreejsrData = (namespace, data) => ({
  type: 'THREEJSR',
  threejsr: {
    [namespace]: data
  }
})

const threejsrSelector = (namespace, selector) => (state) => {
  const threejsrEvent = state.threejsr[namespace]
  return threejsrEvent ? selector(threejsrEvent) : undefined
}

export {
  ThreeJSRComponent,
  ThreeJSR,
  reducer,
  updateThreejsrData,
  threejsrSelector
}
