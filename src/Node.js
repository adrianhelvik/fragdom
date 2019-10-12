import Unconstructable from './Unconstructable.js'

class Node extends Unconstructable {
  static skipChecks = false

  #realNode = null
  parentNode = null
  childNodes = []

  get realNode() {
    if (!this.#realNode) {
      throw Error(
        '[nonstandard] You must reconsile before getting the real node',
      )
    }
    return this.#realNode
  }

  getPrivateRealNodeWithoutChecks() {
    return this.#realNode
  }

  setRealNodeAfterReconsiliation(realNode) {
    this.#realNode = realNode
  }

  appendChild(child) {
    if (!(child instanceof Node)) {
      throw Error(
        "Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'.",
      )
    }

    if (!this.constructor.skipChecks) {
      if (child.contains(this)) {
        throw Error(
          "Failed to execute 'appendChild' on 'Node': The new child element contains the parent.",
        )
      }
    }

    child.parentNode = this
    this.childNodes.push(child)
  }

  contains(node) {
    if (this === node) return true

    for (const child of this.childNodes) {
      if (child.contains(node)) {
        return true
      }
    }

    return false
  }

  remove() {
    if (!this.parentNode) {
      throw Error('[nonstandard] Can not remove node with no parent')
    }

    this.parentNode.removeChild(this)
  }

  removeChild(child) {
    const index = this.childNodes.indexOf(child)

    if (index === -1) {
      throw Error(
        "Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.",
      )
    }

    this.childNodes.splice(index, 1)
    child.parentNode = null
  }
}

export default Node
