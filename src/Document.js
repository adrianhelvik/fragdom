import Unconstructable, { withConstructor } from './Unconstructable.js'
import Fragment from './Fragment.js'
import Element from './Element.js'
import Text from './Text.js'

class Document {
  #elementToNode = new WeakMap()

  createElement(type) {
    return withConstructor(() => new Element(type, this))
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

    if (realNode === document) {
      return this
    }

    switch (realNode.nodeType) {
      case window.Node.ELEMENT_NODE: {
        const node = withConstructor(() => new Element(realNode, this))
        this.#elementToNode.set(realNode, node)
        for (const child of Array.from(realNode.childNodes)) {
          node.childNodes.push(this.wrap(child))
        }
        return node
      }
      case window.Node.TEXT_NODE: {
        const node = withConstructor(() => new Text(realNode, this))
        this.#elementToNode.set(realNode, node)
        return node
      }
      default:
        throw Error('Could not wrap node')
    }
  }
}

export default Document
