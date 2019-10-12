import Node from './Node.js'

let instancePrefix = '$'

class Element extends Node {
  attributes = {}
  #tagName = null

  get tagName() {
    return this.#tagName
  }

  set tagName(tagName) {}

  constructor(tagName) {
    super()
    if (typeof tagName !== 'string') {
      throw Error('[nonstandard] tagName must be a string')
    }
    this.#tagName = tagName.toUpperCase()
  }

  setAttribute(key, value) {
    this.attributes[key] = value
  }

  removeAttribute(key) {
    this.attributes[key] = null
  }

  reconcile() {
    const realNode =
      this.getPrivateRealNodeWithoutChecks() ||
      window.document.createElement(this.tagName)

    for (const [key, value] of Object.entries(this.attributes)) {
      if (key.startsWith(instancePrefix)) {
        const name = key.slice(instancePrefix.length)
        realNode[name] = value
      } else {
        if (value == null) {
          realNode.removeAttribute(key)
        } else if (realNode.getAttribute(key) !== value) {
          realNode.setAttribute(key, value)
        }
      }
    }

    let completeAt = this.childNodes.length
    let index = 0

    for (let i = 0; i < this.childNodes.length; i++) {
      this.childNodes[i].reconcile()
      const child = this.childNodes[i].realNode

      if (Array.isArray(child)) {
        completeAt += child.length
        for (const c of child) {
          if (realNode.childNodes[index] !== c) {
            if (realNode.childNodes[index]) {
              realNode.removeChild(realNode.childNodes[index])
            }

            realNode.appendChild(c)
          }
          index += 1
        }
      } else {
        if (realNode.childNodes[i] !== child) {
          if (realNode.childNodes[i]) {
            realNode.removeChild(realNode.childNodes[i])
          }

          realNode.appendChild(child)
        }
        index += 1
      }
    }

    for (let i = completeAt; i < realNode.childNodes.length; i++) {
      realNode.removeChild(realNode.childNodes[i])
    }

    this.setRealNodeAfterReconsiliation(realNode)
  }
}

export default Element
