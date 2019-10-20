import Node from './Node.js'

let instancePrefix = '$'

class Element extends Node {
  attributes = {}

  #animationFrame = null
  #tagName = null

  get tagName() {
    return this.#tagName
  }

  set tagName(tagName) {}

  constructor(arg, fragdom) {
    super()

    if (arg && typeof arg === 'object' && arg instanceof window.Node) {
      for (const { name, value } of arg.attributes) {
        this.attributes[name] = value
      }
      this.#tagName = arg.tagName
      this.setRealNodeAfterReconciliation(arg)
      if (arg.parentNode && arg.parentNode !== document) {
        this.parentNode = fragdom.wrap(arg.parentNode)
      }
    } else if (typeof arg === 'string') {
      this.#tagName = arg.toUpperCase()
    } else {
      throw Error('[nonstandard] tagName must be a string or element')
    }
  }

  getAttribute(key) {
    return this.attributes[key]
  }

  setAttribute(key, value) {
    this.attributes[key] = value
  }

  removeAttribute(key) {
    this.attributes[key] = null
  }

  reconcile() {
    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame)
      this.#animationFrame = null
    }

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

    for (
      let i = realNode.childNodes.length - 1;
      i >= 0 && i >= completeAt;
      i--
    ) {
      realNode.removeChild(realNode.childNodes[i])
    }

    this.setRealNodeAfterReconciliation(realNode)
  }

  reconcileAsync() {
    if (this.#animationFrame != null) {
      return
    }

    this.#animationFrame = requestAnimationFrame(() => {
      this.#animationFrame = null
      this.reconcile()
    })
  }
}

export default Element
