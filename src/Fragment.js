import indent from './indent'
import Node from './Node.js'

class Fragment extends Node {
  #animationFrame = null
  #dirty = true

  appendChild(...args) {
    super.appendChild(...args)
    this.markAsDirty()
  }

  removeChild(child) {
    super.removeChild(child)
    this.markAsDirty()
  }

  replaceChild(newChild, oldChild) {
    super.replaceChild(newChild, oldChild)
    this.markAsDirty()
  }

  dirty() {
    return this.#dirty
  }

  debug() {
    return ['<>', ...this.childNodes.map(x => indent(x.debug())), '</>'].join(
      this.childNodes.length ? '\n' : '',
    )
  }

  reconcile(isContinuation) {
    if (!isContinuation) {
      return this.reconcileNearestParentElement()
    }

    if (this.#animationFrame != null) {
      cancelAnimationFrame(this.#animationFrame)
      this.#animationFrame = null
    }

    if (this.parentNode && this.parentNode.dirty()) {
      return this.parentNode.reconcile()
    }

    if (!this.#dirty) {
      return
    }

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

  markAsDirty() {
    if (this.parentNode) {
      this.parentNode.markAsDirty()
    }
    this.#dirty = true
  }

  reconcileNearestParentElement() {
    let node = this

    while (node && node instanceof Fragment) {
      node.#dirty = true
      node = node.parentNode
    }

    if (node) node.requestReconciliation()
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
