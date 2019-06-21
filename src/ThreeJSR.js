import * as THREE from 'three'

export default class ThreeJSR {
  constructor (ref, newFrameHook) {
    this.ref = ref
    this.newFrameHook = newFrameHook
    this.camera = {}
  }

  afterMount (width, height) {
    ThreeJSR.verifyEnv()

    this.createThreeScene()
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    this.onResize(width, height)
    this.ref.current.appendChild(this.renderer.domElement)

    this.renderer.render(this.scene, this.camera)
    this.frameId = requestAnimationFrame(this.newFrameHook)
  }

  renderNextFrame ({ timestamp } = {}) {
    if (timestamp) {
      this.renderer.render(this.scene, this.camera)
      this.frameId = requestAnimationFrame(this.newFrameHook)
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
