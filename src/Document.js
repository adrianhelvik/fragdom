import Unconstructable, { withConstructor } from './Unconstructable.js'
import Fragment from './Fragment.js'
import Element from './Element.js'
import Text from './Text.js'

class Document {
  #elementToNode = new WeakMap()

  createElement(type) {
    return withConstructor(() => new Element(type))
  }

  createFragment() {
    return withConstructor(() => new Fragment())
  }

  createTextNode(text) {
    return withConstructor(() => new Text(text))
  }

  wrap(realNode) {
    if (this.#elementToNode.has(realNode)) {
      return this.#elementToNode.get(realNode)
    }

    switch (realNode.nodeType) {
      case window.Node.ELEMENT_NODE: {
        const node = withConstructor(() => new Element(realNode))
        this.#elementToNode.set(realNode, node)
        return node
      }
      default:
        throw Error('Could not wrap node')
    }
  }
}

export default Document
