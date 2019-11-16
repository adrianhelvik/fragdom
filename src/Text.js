import { observable, memoize } from '@adrianhelvik/bind'
import Node from './Node.js'

class Text extends Node {
  animationFrame = null

  textState = observable({
    textContent: '',
  })

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
    this.textState.textContent = textContent
  }

  get textContent() {
    return this.textState.textContent
  }

  reconcile = memoize.skipRecursive(() => {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }

    const realNode =
      this.getPrivateRealNodeWithoutChecks() ||
      window.document.createTextNode(this.textContent)

    if (realNode.textContent !== this.textContent) {
      realNode.textContent = this.textContent
    }

    this.setRealNodeAfterReconciliation(realNode)
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

export default Text
