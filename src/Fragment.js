import Node from './Node.js'

class Fragment extends Node {
  #dirty = false

  appendChild(...args) {
    super.appendChild(...args)
    this.#dirty = true
  }

  removeChild(...args) {
    super.removeChild(...args)
    this.#dirty = true
  }

  reconcile() {
    if (!this.#dirty) return
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

    this.setRealNodeAfterReconsiliation(realNode)
  }
}

export default Fragment
