# ThreeJSR

Infastructure for building [Three.js](https://threejs.org/) projects using [ReactN](https://github.com/CharlesStover/reactn).

See example usage: https://github.com/edwmurph/threejs

# Installation

```
npm i threejs-r
```

# Getting started

1. Extend ThreeJSR to build your own threejs scene:
```
// src/threejs/sphere.js
import * as THREE from 'three'
import { ThreeJSR } from 'threejs-r'

export default class Sphere extends ThreeJSR {
  renderNextFrame({ threejsr }) {
    this.mesh.rotation.x += 0.001
    this.mesh.rotation.y += 0.001
    return super.renderNextFrame(threejsr)
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

2. Add ThreeJSRComponent to one of your components:
```
// src/components/App.js
import React from 'reactn'
import Sphere from '../threejs/sphere'
import { ThreeJSRComponent } from 'threejs-r'

export default function () {
  return (
    <ThreeJSRComponent ThreeJSR={Sphere} />
  )
}
```

# Affecting threejs scene from external component

ThreeJSR relies on the `threejsr` attribute of ReactN's global state. Anything inserted into the `threejsr` prop of ReactN's global state will be available inside your implementation of ThreeJSR's `renderNextFrame` function.

E.g. you can have a button that changes the color of a mesh:
```
// some component
import React, { useGlobal } from 'reactn'

export default function () {
  const [threejsr, setThreejsr] = useGlobal('threejsr')
  return (
    <button onClick={() => setThreejsr({ color: 'blue' })}>Change color</button>
  )
}
```

```
// your ThreeJSR implementation
import { ThreeJSR } from 'threejs-r'
export default class Sphere extends ThreeJSR {
  renderNextFrame (threejsr) {
    if (threejsr.color) {
      this.mesh.material.color.set(threejsr.color)
    }
  }

  createThreeScene () {
    ...
  }
}
```
