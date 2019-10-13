import Node from './Node.js'

class Text extends Node {
  #animationFrame = null
  #value = null

  get textContent() {
    return this.#value
  }

  set textContent(value) {
    this.#value = value
  }

  constructor(text) {
    super()
    this.#value = text
  }

  reconcile() {
    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame)
      this.#animationFrame = null
    }

    const realNode =
      this.getPrivateRealNodeWithoutChecks() ||
      window.document.createTextNode(this.textContent)

    if (realNode.textContent !== this.textContent) {
      realNode.textContent = this.textContent
    }

    this.setRealNodeAfterReconciliation(realNode)
  }

  reconcileAsync() {
    if (this.#animationFrame != null) {
      return
    }

    this.#animationFrame = requestAnimationFrame(() => {
      this.#animationFrame = null
      this.reconcile()
    })
  }
}

export default Text
