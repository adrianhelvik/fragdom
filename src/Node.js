import Unconstructable from './Unconstructable.js'

class Node extends Unconstructable {
  static skipChecks = false

  #performedReconciliations = new Set()
  #realNode = null
  parentNode = null
  childNodes = []

  get realNode() {
    if (!this.#realNode) {
      throw Error(
        '[nonstandard] You must reconcile before getting the real node',
      )
    }
    return this.#realNode
  }

  replaceChild(newChild, oldChild) {
    const index = this.childNodes.indexOf(oldChild)

    if (index === -1) {
      throw Error(
        "Failed to execute 'replaceChild' on 'Node'. The node to be replaced is not a child of this node.",
      )
    }

    this.childNodes[index] = newChild
    newChild.parentNode = this
  }

  getPrivateRealNodeWithoutChecks() {
    return this.#realNode
  }

  setRealNodeAfterReconciliation(realNode) {
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

    if (child.parentNode) {
      child.remove()
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
