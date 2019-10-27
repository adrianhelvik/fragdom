import indent from './indent'
import Node from './Node.js'

let instancePrefix = '$'

class Element extends Node {
  attributes = {}

  #dirty = true
  #animationFrame = null
  #tagName = null

  get tagName() {
    return this.#tagName
  }

  set tagName(tagName) {}

  appendChild(child) {
    super.appendChild(child)
    child.markAsDirty()
    this.#dirty = true
  }

  replaceChild(newChild, oldChild) {
    super.replaceChild(newChild, oldChild)
    newChild.markAsDirty()
    this.#dirty = true
  }

  removeChild(child) {
    super.removeChild(child)
    this.#dirty = true
  }

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

  markAsDirty() {
    this.#dirty = true
  }

  dirty() {
    return this.#dirty
  }

  requestReconciliation() {
    this.#dirty = true
    this.reconcile()
  }

  getAttribute(key) {
    return this.attributes[key]
  }

  setAttribute(key, value) {
    this.attributes[key] = value
    this.#dirty = true
  }

  removeAttribute(key) {
    this.attributes[key] = null
    this.#dirty = true
  }

  debug() {
    const tagName = this.tagName.toLowerCase()
    let attrs = ''
    for (const [k, v] of Object.entries(this.attributes)) {
      attrs += ` ${k}={${v}}`
    }

    return [
      `<${tagName}${attrs}>`,
      ...this.childNodes.map(x => indent(x.debug())),
      `</${tagName}>`,
    ].join(this.childNodes.length ? '\n' : '')
  }

  reconcile(isContinuation) {
    if (this.#animationFrame) {
      cancelAnimationFrame(this.#animationFrame)
      this.#animationFrame = null
    }

    if (!this.dirty()) {
      for (const node of this.childNodes) {
        node.reconcile(true)
      }
      return
    }

    this.#dirty = false

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
      this.childNodes[i].reconcile(true)
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
            realNode.replaceChild(child, realNode.childNodes[i])
          } else {
            realNode.appendChild(child)
          }
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
