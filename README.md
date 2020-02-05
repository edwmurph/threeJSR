# ThreeJSR

Infastructure for building [three.js](https://threejs.org/) projects with React Redux hooks.

<a href="https://www.npmjs.com/package/threejs-r"><img src="https://img.shields.io/npm/v/@edwmurph/threejsr.svg?style=flat" alt="npm version"></a>
<a href="https://www.npmjs.com/package/threejs-r" target="_blank"><img src="https://img.shields.io/npm/dm/@edwmurph/threejsr.svg" alt="npm downloads per month"></a>

# Features

- affect three.js scene from external components via react redux hooks
- render three.js scene in dimensions set by parent element
- three.js scene and render loop logic is defined with javascript to ensure consistency with the three.js docs
- add post operation passes like the GlitchPass and UnrealBloomPass

See example usage: https://github.com/edwmurph/threejs

# Installation

```
npm i @edwmurph/threejsr
```
Also install required peer dependencies:
```
npm i three@^0 react@^16 react-redux@^7
```

# Getting started

1. Add ThreeJSR threejsr reducer to your root reducers:
```
// src/reducers/index.js
import { combineReducers } from 'redux'
import { reducer as threejsr } from '@edwmurph/threejsr'

export default combineReducers({
  threejsr,
  ...
})
```

2. Extend ThreeJSR to build your own threejs scene:

```
// src/threejs/sphere.js
import * as THREE from 'three'
import { ThreeJSR } from '@edwmurph/threejsr'

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export default class Sphere extends ThreeJSR {
  constructor (ref, newFrameHook) {
    const bloomPass = new UnrealBloomPass()
    super(ref, newFrameHook, { passes: [bloomPass] })
  }

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
```

3. Add ThreeJSRComponent to one of your components:

```
// src/components/app.js
import React from 'react'
import { useSelector } from 'react-redux'
import Sphere from '../threejs/sphere'
import { ThreeJSRComponent, threejsrSelector } from '@edwmurph/threejsr'

export default function () {
  const renderLoopData = {
    spin: useSelector(threejsrSelector('SPHERE', state => state.spin))
  }

  return (
    <ThreeJSRComponent
      ThreeJSR={Sphere}
      namespace='SPHERE'
      renderLoopData={renderLoopData}
      style={{ border: '5px solid green' }}
    />
  )
}
```

# Affecting threejs scene from external component

```
// src/components/external-component.js
impot React from 'react'
import { useDispatch } from 'react-redux'
import { updateThreejsrData } from @edwmurph/threejsr

const ExternalComponent = () => {
  const dispatch =  useDispatch()

  useEffect(() => {
    dispatch(updateThreejsrData('SPHERE', { spin: true }))
  }, [])

  return (<div />)
}

export default ExternalComponent
```
