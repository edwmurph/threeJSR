# ThreeJSR

A library for building [Three.js](https://threejs.org/) projects using React and Redux.

See example usage: https://github.com/edwmurph/threejs

# Installation

```
npm i git+ssh://git@github.com:edwmurph/threeJSR.git
```

# Usage

1. Add ThreeJSR `timestamp` reducer to your root reducers:
```
// src/reducers/index.js
import { combineReducers } from 'redux'
import { timestamp } from 'threeJSR'

export default combineReducers({
  timestamp
  ...
})
```

2. Extend ThreeJSR to build your own threejs scene:
```
// src/threejs/sphere.js
import * as THREE from 'three'
import { ThreeJSR } from 'threeJSR'

export default class Sphere extends ThreeJSR {
  renderNextFrame({ timestamp }) {
    this.mesh.rotation.x += 0.001
    this.mesh.rotation.y += 0.001

    return super.renderNextFrame(timestamp)
  }

  createThreeScene() {
    this.scene = new THREE.Scene()

    this.camera = new THREE.PerspectiveCamera(75, 0, 0.1, 1000)
    this.camera.position.z = 100

    const geometry = new THREE.SphereGeometry(40, 50, 30)
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true })

    this.mesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.mesh)

    const spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(100, 10, 100)

    this.scene.add(spotLight)
  }
}
```

3. Add SafeThreeJSRComponent to one of your components:
```
// src/components/App.js
import React from 'react'
import Sphere from '../threejs/sphere'
import { SafeThreeJSRComponent } from 'threeJSR'

export default class App extends React.Component {
  render() {
    return (
      <SafeThreeJSRComponent ThreeJSR={Sphere} />
    )
  }
}
```
