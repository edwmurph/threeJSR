import * as THREE from 'three'

export default class ThreeJSR {
  constructor(ref, newFrameHook) {
    this.ref = ref
    this.newFrameHook = newFrameHook
    this.camera = {}
  }

  // USAGE: call inside componentDidMount()
  afterMount() {
    ThreeJSR.verifyEnv()
    window.addEventListener('resize', this.onResize.bind(this))

    this.createThreeScene()
    this.renderer = new THREE.WebGLRenderer({ antialias: true })

    this.onResize()
    this.ref.current.appendChild(this.renderer.domElement)

    this.renderer.render(this.scene, this.camera)
    this.frameId = requestAnimationFrame(this.newFrameHook)
  }

  // USAGE: call inside componentDidUpdate()
  renderNextFrame({ timestamp } = {}) {
    if (timestamp) {
      this.renderer.render(this.scene, this.camera)
      this.frameId = requestAnimationFrame(this.newFrameHook)
    }
  }

  // USAGE: call inside componentWillUnmount()
  cleanup() {
    window.removeEventListener('resize', this.onResize)
    if (this.frameId) {
      cancelAnimationFrame(this.frameId)
    }
  }

  createThreeScene() {
    throw new Error('must implement createThreeScene()')
  }

  onResize() {
    this.width = window.innerWidth
    this.height = Math.max(window.innerHeight - 200, 200)
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  static verifyEnv() {
    try {
      const canvas = document.createElement('canvas')
      const meetsRequirements = !!(window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')))
      if (!meetsRequirements) {
        throw new Error()
      }
    } catch (e) {
      throw new Error('WebGL is not available on your browser')
    }
  }
}
