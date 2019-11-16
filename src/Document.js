import Unconstructable, { withConstructor } from './Unconstructable.js'
import { unwrap } from '@adrianhelvik/bind'
import Fragment from './Fragment.js'
import Comment from './Comment.js'
import Element from './Element.js'
import Text from './Text.js'

class Document {
  elementToNode = new WeakMap()

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
    realNode = unwrap(realNode)

    if (this.elementToNode.has(realNode)) {
      return unwrap(this.elementToNode.get(realNode))
    }

    if (realNode === document) {
      return this
    }

    switch (realNode.nodeType) {
      case window.Node.ELEMENT_NODE: {
        const node = withConstructor(() => new Element(realNode, this))
        this.elementToNode.set(realNode, node)
        for (const child of Array.from(realNode.childNodes)) {
          node.childNodes.push(this.wrap(child))
        }
        return unwrap(node)
      }
      case window.Node.TEXT_NODE: {
        const node = withConstructor(() => new Text(realNode, this))
        this.elementToNode.set(realNode, node)
        return unwrap(node)
      }
      case window.Node.COMMENT_NODE: {
        const node = withConstructor(() => new Comment(realNode, this))
        this.elementToNode.set(realNode, node)
        return unwrap(node)
      }
      default:
        throw Error('Could not wrap node')
    }
  }
}

export default Document
