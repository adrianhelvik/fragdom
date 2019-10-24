import Node from './Node.js'

class Text extends Node {
  #animationFrame = null
  #textContent = ''
  #dirty = true

  constructor(textOrElement) {
    super()
    if (textOrElement instanceof window.Text) {
      this.setRealNodeAfterReconciliation(textOrElement)
      this.textContent = textOrElement.textContent
    } else {
      this.textContent = textOrElement
    }
  }

  debug() {
    return this.textContent
  }

  set textContent(textContent) {
    this.#textContent = textContent
    this.#dirty = true
  }

  get textContent() {
    return this.#textContent
  }

  markAsDirty() {
    this.#dirty = true
  }

  reconcile() {
    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame)
      this.#animationFrame = null
    }

    if (!this.#dirty) return
    this.#dirty = false

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
