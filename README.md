# ThreeJSR

*UNDER DEVELOPMENT*

React based library for [three.js](https://threejs.org/) projects.

<a href="https://www.npmjs.com/package/threejs-r"><img src="https://img.shields.io/npm/v/@edwmurph/threejsr.svg?style=flat" alt="npm version"></a>
<a href="https://www.npmjs.com/package/threejs-r" target="_blank"><img src="https://img.shields.io/npm/dm/@edwmurph/threejsr.svg" alt="npm downloads per month"></a>

# Features

- render three.js scene in dimensions set by parent element
- three.js scene and render loop logic is defined with javascript to ensure consistency with the three.js docs
- add post operation passes like the GlitchPass and UnrealBloomPass
- threejs environment requirement error handling with customizable error boundary

See example usage: https://github.com/edwmurph/threejs

# Installation

```
npm i @edwmurph/threejsr
```
Also install required peer dependencies:
```
npm i three@^0 react@^16
```

# Getting started

1. Extend ThreeJSR to build your own threejs scene:

```
// src/threejs/sphere.js
import * as THREE from 'three';
import { ThreeJSR } from '@edwmurph/threejsr';

import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

class Sphere extends ThreeJSR {
  constructor (ref, newFrameHook) {
    const bloomPass = new UnrealBloomPass();
    super(ref, newFrameHook, { passes: [bloomPass] });
  }

  renderNextFrame({ spin, timestamp }) {
    if (spin) {
      this.mesh.rotation.x += 0.001;
      this.mesh.rotation.y += 0.001;
    }

    return super.renderNextFrame(timestamp);
  }

  createThreeScene() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 0, 0.1, 1000);
    this.camera.position.z = 100;

    const geometry = new THREE.SphereGeometry(40, 50, 30);
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff, wireframe: true });

    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(100, 10, 100);

    this.scene.add(spotLight);
  }
}

export default new Sphere();
```

2. Add ThreeJSRComponent to one of your components:

```
// src/components/app.js
import React from 'react';
import Sphere from '../threejs/sphere';
import { ThreeJSRComponent } from '@edwmurph/threejsr';

const renderLoopData = {
  spin: true
};

const Component = () => {
  return (
    <ThreeJSRComponent
      ThreeJSR={Sphere}
      renderLoopData={renderLoopData}
      style={{ border: '5px solid green' }}
    />
  );
};

export default Component;
```
