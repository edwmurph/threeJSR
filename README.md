# ThreeJSR

Infastructure for building [three.js](https://threejs.org/) projects with ReactN.

# Features

- affect three.js scene from external components via [ReactN](https://github.com/CharlesStover/reactn) globally accessible state
- render three.js scene as a background that spans the full viewport and resizes when the browser size changes
- three.js scene and render loop logic is defined with javascript to ensure consistency with the three.js docs

See example usage: https://github.com/edwmurph/threejs

# Installation

```
npm i threejs-r
```
Also install required peer dependencies:
```
npm i three reactn
```

# Getting started

1. Extend ThreeJSR to build your own threejs scene:
```
// src/threejs/sphere.js
import * as THREE from 'three'
import { ThreeJSR } from 'threejs-r'

export default class Sphere extends ThreeJSR {
  renderNextFrame (threejsr) {
    if (this.change < 100) {
      this.spotLight.position.set(0, 50, this.change)
      this.change = this.change + 0.5
    }

    if (threejsr.color) {
      this.mesh.material.color.set(threejsr.color)
    }

    this.mesh.rotation.x += 0.001
    this.mesh.rotation.y += 0.001

    return super.renderNextFrame(threejsr)
  }

  createThreeScene () {
    this.change = 0
    this.scene = new THREE.Scene()

    const ambient = new THREE.AmbientLight(0xffffff, 0.1)
    this.scene.add(ambient)

    this.spotLight = new THREE.SpotLight(0xffffff)
    this.spotLight.position.set(20, 20, 60)
    this.spotLight.position.set(0, 50, 0)
    this.scene.add(this.spotLight)

    this.camera = new THREE.PerspectiveCamera(75, 0, 0.1, 1000)
    this.camera.position.set(0, 0, 100)

    const geometry = new THREE.SphereGeometry(40, 50, 30)
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true })

    this.mesh = new THREE.Mesh(geometry, material)
    this.scene.add(this.mesh)
  }
}
```

2. Add ThreeJSRComponent to one of your components:
```
// src/components/App.js
import React, { useGlobal, useState } from 'reactn'
import Sphere from '../threejs/sphere'
import { ThreeJSRComponent } from 'threejs-r'

export default function () {
  const [, setThreejsr] = useGlobal('threejsr')
  const [color, setColor] = useState()

  const handleSubmit = (e) => {
    e.preventDefault()
    setThreejsr({ color })
  }

  return (
    <div>
      <ThreeJSRComponent ThreeJSR={Sphere} />
      <div className='text-center'>
        <form className='m-5 p-5' onSubmit={handleSubmit}>
          <input name='color' onChange={(e) => setColor(e.target.value)} />
          <button type='submit'>Set Color</button>
        </form>
        <h1 className='text-light m-5 p-5'>asdf</h1>
        <h1 className='text-light m-5 p-5'>asdf</h1>
        <h1 className='text-light m-5 p-5'>asdf</h1>
        <h1 className='text-light m-5 p-5'>asdf</h1>
      </div>
    </div>
  )
}
```

# Affecting threejs scene from external component

ThreeJSR relies on the `threejsr` attribute of ReactN's global state. Anything inserted into the `threejsr` prop of ReactN's global state will be available inside your implementation of ThreeJSR's `renderNextFrame` function. See example implementation linked above for more details.

