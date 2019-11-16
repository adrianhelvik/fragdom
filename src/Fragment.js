import { memoize } from '@adrianhelvik/bind'
import indent from './indent'
import Node from './Node.js'

class Fragment extends Node {
  animationFrame = null

  appendChild(...args) {
    super.appendChild(...args)
  }

  removeChild(child) {
    super.removeChild(child)
  }

  replaceChild(newChild, oldChild) {
    super.replaceChild(newChild, oldChild)
  }

  debug() {
    return ['<>', ...this.childNodes.map(x => indent(x.debug())), '</>'].join(
      this.childNodes.length ? '\n' : '',
    )
  }

  get realNode() {
    return this.reconcileDown()
  }

  reconcile = () => {
    let node = this.parentNode

    while (node instanceof Fragment) {
      node = node.parentNode
    }

    if (node) node.reconcile()
  }

  reconcileDown = memoize(() => {
    if (this.animationFrame != null) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }

    const realNode = []

    for (let node of this.childNodes) {
      if (node instanceof Fragment) {
        realNode.push(...node.reconcileDown())
      } else {
        node.reconcile()
        realNode.push(node.realNode)
      }
    }

    return realNode
  })

  reconcileAsync() {
    if (this.animationFrame != null) {
      return
    }

    this.animationFrame = requestAnimationFrame(() => {
      this.animationFrame = null
      this.reconcile()
    })
  }
}

export default Fragment
