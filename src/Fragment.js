import Node from './Node.js'

class Fragment extends Node {
  #animationFrame = null
  #dirty = true

  appendChild(...args) {
    super.appendChild(...args)
    this.#dirty = true
  }

  removeChild(...args) {
    super.removeChild(...args)
    this.#dirty = true
  }

  reconcile() {
    if (this.#animationFrame != null) {
      cancelAnimationFrame(this.#animationFrame)
      this.#animationFrame = null
    }

    if (!this.#dirty) {
      return
    }

    this.#dirty = false

    const realNode = []

    for (let node of this.childNodes) {
      node.reconcile()
      if (Array.isArray(node.realNode)) {
        realNode.push(...node.realNode)
      } else {
        realNode.push(node.realNode)
      }
    }

    this.setRealNodeAfterReconciliation(realNode)

    let parentNode = this.parentNode

    while (parentNode instanceof Fragment) {
      parentNode = parentNode.parentNode
    }

    if (parentNode) {
      parentNode.reconcile()
    }
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

export default Fragment
