import fragdom from './fragdom'

export default function h(type, props, ...children) {
  if (typeof type === 'string') {
    const node = fragdom.createElement(type)

    if (props) {
      for (const key of Object.keys(props)) {
        node.setAttribute(key, props[key])
      }
    }

    for (const child of children) {
      if (typeof child === 'string') {
        child = fragdom.createTextNode(child)
      }
      node.appendChild(child)
    }

    return node
  }

  if (type === h.Fragment) {
    const node = fragdom.createFragment()

    for (let child of children) {
      if (typeof child === 'string') {
        child = fragdom.createTextNode(child)
      }
      node.appendChild(child)
    }

    return node
  }

  if (typeof type === 'function') {
    return type({
      children,
      ...props,
    })
  }

  console.error('Invalid element type:', type)
  throw Error('invalid element type')
}

h.Fragment = {}
