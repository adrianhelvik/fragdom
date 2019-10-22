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

  reconcile(isContinuation) {
    if (!isContinuation) {
      return this.reconcileNearestParentElement()
    }

    if (this.#animationFrame != null) {
      cancelAnimationFrame(this.#animationFrame)
      this.#animationFrame = null
    }

    if (!this.#dirty) return

    this.#dirty = false

    const realNode = []

    for (let node of this.childNodes) {
      node.reconcile(true)
      if (Array.isArray(node.realNode)) {
        realNode.push(...node.realNode)
      } else {
        realNode.push(node.realNode)
      }
    }

    this.setRealNodeAfterReconciliation(realNode)
  }

  reconcileNearestParentElement() {
    let node = this

    while (node && node instanceof Fragment) {
      node.#dirty = true
      node = node.parentNode
    }

    if (node) node.reconcile()
    else this.reconcile(true)
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
