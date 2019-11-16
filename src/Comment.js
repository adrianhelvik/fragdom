import Node from './Node.js'

class Comment extends Node {
  raf

  constructor(realNode, fragdom) {
    super()
    this.setRealNodeAfterReconciliation(realNode)
  }

  reconcile() {
    cancelAnimationFrame(this.raf)

    // ... ?
  }

  reconcileAsync() {
    if (this.raf) return

    this.raf = requestAnimationFrame(() => {
      this.raf = null
      this.reconcile()
    })
  }
}

export default Comment
