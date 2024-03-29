import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const { NODE_ENV } = process.env;

const RESIZE = Symbol('RESIZE');

export default class ThreeJSR {
  init(ref, newFrameHook, opts = {}) {
    this.ref = ref;
    this.newFrameHook = newFrameHook;
    this.camera = {};
    this.passes = opts.passes || [];
    this.updates = [];
    this.controls = {};
    return this;
  }

  afterMount() {
    ThreeJSR.verifyEnv();

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.ref.current,
      antialias: true,
    });

    this.createThreeScene();

    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.newFrameHook);

    if (this.passes.length) {
      this.composer = new EffectComposer(this.renderer);

      const renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);

      this.passes.forEach((pass) => this.composer.addPass(pass));
    }
  }

  renderNextFrame(timestamp) {
    if (timestamp) {
      this[RESIZE]();
      this.updates.forEach((update) => update());
      this.renderer.render(this.scene, this.camera);
      this.frameId = requestAnimationFrame(this.newFrameHook);
      if (this.composer) {
        this.composer.render();
      }
    }
  }

  // deprecated
  addControls() {
    const trackball = new TrackballControls(this.camera, this.renderer.domElement);
    trackball.rotateSpeed = 1.0;
    trackball.zoomSpeed = 1.2;
    trackball.panSpeed = 0.8;
    trackball.keys = [65, 83, 68];

    const orbit = new OrbitControls(this.camera, this.renderer.domElement);

    Object.assign(this.controls, { trackball, orbit });

    trackball.update();
    orbit.update();

    this.updates.push(
      () => trackball.update(),
      () => orbit.update(),
    );
  }

  addAxesHelper({ onlyDev = true, size = 200 } = {}) {
    if (onlyDev && NODE_ENV !== 'development') {
      return;
    }

    const axesHelper = new THREE.AxesHelper(size);
    this.scene.add(axesHelper);
  }

  cleanup() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  createThreeScene() {
    throw new Error('must implement createThreeScene()');
  }

  resize() {
    // TODO override this hook for responsive canvas size logic
  }

  [RESIZE]() {
    const canvas = this.renderer.domElement;

    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0; // eslint-disable-line no-bitwise
    // eslint-disable-next-line no-bitwise
    const height = canvas.parentElement.clientHeight * pixelRatio | 0;
    const buffer = 5;

    const needResize = canvas.width !== width
      || Math.abs(canvas.height - height - buffer) > 5;

    if (needResize) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.resize(width, height);
    }
  }

  static verifyEnv() {
    try {
      const canvas = document.createElement('canvas');
      const meetsRequirements = !!(window.WebGLRenderingContext
        && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      if (!meetsRequirements) {
        throw new Error();
      }
    } catch (e) {
      throw new Error('WebGL is not available');
    }
  }
}
