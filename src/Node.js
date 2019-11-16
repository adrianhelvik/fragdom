import { unwrap, computed, observable } from '@adrianhelvik/bind'
import Unconstructable from './Unconstructable.js'

class Node extends Unconstructable {
  static skipChecks = false

  nodeState = observable({
    parentNode: null,
    realNode: null,
    childNodes: [],
  })

  set parentNode(parentNode) {
    this.nodeState.parentNode = parentNode
  }

  get parentNode() {
    return unwrap(this.nodeState.parentNode)
  }

  get childNodes() {
    return this.nodeState.childNodes
  }

  set childNodes(childNodes) {
    this.childNodes = observable(childNodes)
  }

  childNodes = []

  get realNode() {
    if (!this.nodeState.realNode) {
      throw Error(
        '[nonstandard] You must reconcile before getting the real node',
      )
    }
    return this.nodeState.realNode
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
    return this.nodeState.realNode
  }

  setRealNodeAfterReconciliation(realNode) {
    this.nodeState.realNode = realNode
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

  contains(node, source) {
    if (this === source) {
      throw Error('Cyclic node graph detected')
    }

    if (this === node) {
      return true
    }

    for (const child of this.childNodes) {
      if (child.contains(node, source || this)) {
        return true
      }
    }

    return false
  }

  remove() {
    if (!this.parentNode) {
      throw Error('[nonstandard] Can not remove node with no parent')
    }

    this.parentNode.removeChild(observable(this))
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
