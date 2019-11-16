import { disableConstructor, enableConstructor } from './Unconstructable.js'
import Node from './Node.js'

beforeEach(() => {
  enableConstructor()
})

afterEach(() => {
  Node.skipChecks = false
  disableConstructor()
})

describe('appendChild', () => {
  it('appends a child', () => {
    const a = new Node()
    const b = new Node()

    a.appendChild(b)

    expect(a.childNodes).toEqual([b])
  })

  it('throws if the child contains the parent', () => {
    const a = new Node()
    const b = new Node()

    const message =
      "Failed to execute 'appendChild' on 'Node': The new child element contains the parent."

    a.appendChild(b)

    expect(() => b.appendChild(a)).toThrow(message)
  })

  it('does not throw for containment if skipChecks = true', () => {
    Node.skipChecks = true

    const a = new Node()
    const b = new Node()

    a.appendChild(b)

    expect(() => b.appendChild(a)).not.toThrow()
  })

  it('throws if the child is not a node', () => {
    const a = new Node()
    const b = 'not a Node'
    const message =
      "Failed to execute 'appendChild' on 'Node': parameter 1 is not of type 'Node'."

    expect(() => a.appendChild(b)).toThrow(message)
  })

  it('removes an element from its previous parent', () => {
    const parent1 = new Node()
    const parent2 = new Node()
    const child = new Node()

    parent1.appendChild(child)
    parent2.appendChild(child)

    expect(parent1.childNodes).toEqual([])
    expect(parent2.childNodes).toEqual([child])
  })
})

describe('constains', () => {
  it('is true for itself', () => {
    const node = new Node()
    expect(node.contains(node)).toBe(true)
  })

  it('is true for its children', () => {
    const a = new Node()
    const b = new Node()

    a.appendChild(b)

    expect(a.contains(b)).toBe(true)
  })

  it('is false for non-children', () => {
    const a = new Node()
    const b = new Node()

    expect(a.contains(b)).toBe(false)
  })

  it('is transitive', () => {
    const a = new Node()
    const b = new Node()
    const c = new Node()

    a.appendChild(b)
    b.appendChild(c)

    expect(a.contains(c)).toBe(true)
  })
})

describe('remove', () => {
  it('removes the node from its parent', () => {
    const a = new Node()
    const b = new Node()

    a.appendChild(b)
    b.remove()

    expect(a.childNodes).toEqual([])
  })

  it('sets parentNode = null', () => {
    const a = new Node()
    const b = new Node()

    a.appendChild(b)
    b.remove()

    expect(b.parentNode).toBe(null)
  })
})

describe('[nonstandard] .realNode', () => {
  it('throws without a realNode', () => {
    expect(() => new Node().realNode).toThrow(
      '[nonstandard] You must reconcile before getting the real node',
    )
  })

  it('does not throw after setting realNode', () => {
    expect(() => {
      const node = new Node()
      const element = window.document.createElement('div')
      node.setRealNodeAfterReconciliation(element)
      node.realNode
    }).not.toThrow()
  })

  it('returns the real node', () => {
    const node = new Node()
    const element = window.document.createElement('div')
    node.setRealNodeAfterReconciliation(element)
    expect(node.realNode).toEqual(element)
  })
})
