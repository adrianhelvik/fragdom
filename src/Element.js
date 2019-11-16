import { memoize, observable, unwrap } from '@adrianhelvik/bind'
import Fragment from './Fragment'
import indent from './indent'
import Node from './Node.js'

let instancePrefix = '$'

class Element extends Node {
  animationFrame = null

  elementState = observable({
    attributes: {},
    tagName: null,
  })

  get attributes() {
    return this.elementState.attributes
  }

  set attributes(attributes) {
    this.elementState.attributes = attributes
  }

  get tagName() {
    return this.elementState.tagName
  }

  set tagName(tagName) {
    if (this.elementState.tagName) {
      throw Error('Unsopported mutation of tagName')
      return
    }
    this.elementState.tagName = tagName
  }

  appendChild(child) {
    super.appendChild(child)
  }

  replaceChild(newChild, oldChild) {
    super.replaceChild(newChild, oldChild)
  }

  removeChild(child) {
    super.removeChild(child)
  }

  constructor(arg, fragdom) {
    super()

    if (arg && typeof arg === 'object' && arg instanceof window.Node) {
      for (const { name, value } of arg.attributes) {
        this.attributes[name] = value
      }
      this.tagName = arg.tagName
      this.setRealNodeAfterReconciliation(arg)
      if (arg.parentNode && arg.parentNode !== document) {
        this.parentNode = fragdom.wrap(arg.parentNode)
      }
    } else if (typeof arg === 'string') {
      this.tagName = arg.toUpperCase()
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

  reconcile = memoize(() => {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }

    const realNode =
      this.getPrivateRealNodeWithoutChecks() ||
      window.document.createElement(this.tagName)

    if (!this.getPrivateRealNodeWithoutChecks()) {
      this.setRealNodeAfterReconciliation(realNode)
    }

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

    let index = 0

    for (let i = 0; i < this.childNodes.length; i++) {
      if (this.childNodes[i] instanceof Fragment) {
        const child = this.childNodes[i].reconcileDown()

        for (const c of child) {
          if (realNode.childNodes[index] !== c) {
            if (realNode.childNodes[index]) {
              realNode.replaceChild(
                unwrap(c),
                unwrap(realNode.childNodes[index]),
              )
            } else {
              realNode.appendChild(unwrap(c))
            }
          }
          index += 1
        }
      } else {
        this.childNodes[i].reconcile()
        const child = this.childNodes[i].realNode
        if (realNode.childNodes[i] !== child) {
          if (realNode.childNodes[i]) {
            realNode.replaceChild(child, realNode.childNodes[i])
          } else {
            realNode.appendChild(unwrap(child))
          }
        }
        index += 1
      }
    }

    for (let i = realNode.childNodes.length - 1; i >= 0 && i >= index; i--) {
      realNode.removeChild(realNode.childNodes[i])
    }
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

export default Element
