import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

export default class ThreeJSR {
  constructor (ref, newFrameHook, opts = {}) {
    this.ref = ref
    this.newFrameHook = newFrameHook
    this.camera = {}
    this.passes = opts.passes || []
  }

  afterMount (width, height) {
    ThreeJSR.verifyEnv()

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

    this.createThreeScene()

    this.onResize(width, height)
    this.ref.current.appendChild(this.renderer.domElement)

    this.renderer.render(this.scene, this.camera)
    this.renderer.setPixelRatio(window.devicePixelRatio * 1.5)
    this.frameId = requestAnimationFrame(this.newFrameHook)

    if (this.passes.length) {
      this.composer = new EffectComposer(this.renderer)

      const renderPass = new RenderPass(this.scene, this.camera)
      this.composer.addPass(renderPass)

      this.passes.forEach(pass => this.composer.addPass(pass))
    }
  }

  renderNextFrame ({ timestamp } = {}, postOp = () => {}) {
    if (timestamp) {
      this.renderer.render(this.scene, this.camera)
      this.frameId = requestAnimationFrame(this.newFrameHook)
      if (this.composer) {
        this.composer.render()
      }
    }
  }

  cleanup () {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
    }
  }

  createThreeScene () {
    throw new Error('must implement createThreeScene()')
  }

  onResize (width, height) {
    if (!width || !height) return
    const heightChanged = Math.abs(this.height - height) > 20
    const widthChanged = Math.abs(this.width - width) > 20
    if (!heightChanged && !widthChanged && this.width && this.height) return

    this.width = width
    this.height = Math.max(height, 200)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  static verifyEnv () {
    try {
      const canvas = document.createElement('canvas')
      const meetsRequirements = !!(window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
      if (!meetsRequirements) {
        throw new Error()
      }
    } catch (e) {
      throw new Error('WebGL is not available')
    }
  }
}
