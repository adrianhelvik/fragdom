import Unconstructable, { withConstructor } from './Unconstructable.js'
import Fragment from './Fragment.js'
import Element from './Element.js'
import Text from './Text.js'

class Document {
  createElement(type) {
    return withConstructor(() => new Element(type))
  }

  createFragment() {
    return withConstructor(() => new Fragment())
  }

  createTextNode(text) {
    return withConstructor(() => new Text(text))
  }
}

export default Document
