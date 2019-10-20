import { interceptMethod } from '../testUtils.js'
import fragdom from '.'

describe('setAttribute(key, value)', () => {
  it('updates .attributes', () => {
    const element = fragdom.createElement('div')
    element.setAttribute('class', 'foo')

    expect(element.attributes).toEqual({ class: 'foo' })
  })
})

describe('getAttribute(key)', () => {
  it('retrieves the attribute', () => {
    const element = fragdom.createElement('div')
    element.setAttribute('class', 'foo')

    expect(element.getAttribute('class')).toEqual('foo')
  })
})

describe('[nonstandard] .reconcile()', () => {
  it('creates the real element', () => {
    const element = fragdom.createElement('div')

    element.reconcile()

    expect(element.realNode).toBeInstanceOf(window.Element)
  })

  it('does not create a new element the second time', () => {
    const element = fragdom.createElement('div')

    element.reconcile()
    const a = element.realNode
    element.reconcile()
    const b = element.realNode

    expect(a).toBe(b)
  })

  it('appends all element children', () => {
    const a = fragdom.createElement('outer')
    const b = fragdom.createElement('inner')

    a.appendChild(b)
    a.reconcile()

    const element = a.realNode

    expect(element.outerHTML).toBe('<outer><inner></inner></outer>')
  })

  it('can remove children', () => {
    const outer = fragdom.createElement('outer')
    const child = fragdom.createElement('child')

    outer.appendChild(child)
    outer.reconcile()
    outer.removeChild(child)
    outer.reconcile()

    const element = outer.realNode

    expect(element.outerHTML).toBe('<outer></outer>')
  })

  it('can replace children', () => {
    const outer = fragdom.createElement('outer')
    const before = fragdom.createElement('before')
    const after = fragdom.createElement('after')

    outer.appendChild(before)
    outer.reconcile()
    outer.removeChild(before)
    outer.appendChild(after)
    outer.reconcile()

    const element = outer.realNode

    expect(element.outerHTML).toBe('<outer><after></after></outer>')
  })

  it("retains focus when a child isn't (re-/)moved", () => {
    const container = fragdom.createElement('container')
    const input = fragdom.createElement('input')

    container.appendChild(input)
    container.reconcile()

    input.realNode.focus()

    container.reconcile()

    expect(window.document.activeElement).toBe(input.realNode)
  })

  it('can add fragments', () => {
    const container = fragdom.createElement('container')
    const fragment = fragdom.createFragment()
    const a = fragdom.createElement('a')
    const b = fragdom.createElement('b')
    const c = fragdom.createElement('c')

    container.appendChild(fragment)
    fragment.appendChild(a)
    fragment.appendChild(b)
    fragment.appendChild(c)

    container.reconcile()

    expect(container.realNode.innerHTML).toBe('<a></a><b></b><c></c>')
  })

  it('can remove fragments', () => {
    const container = fragdom.createElement('container')
    const fragment = fragdom.createFragment()
    const a = fragdom.createElement('a')
    const b = fragdom.createElement('b')
    const c = fragdom.createElement('c')

    container.appendChild(fragment)
    fragment.appendChild(a)
    fragment.appendChild(b)
    fragment.appendChild(c)
    container.reconcile()
    fragment.removeChild(b)
    container.reconcile()

    expect(container.realNode.innerHTML).toBe('<a></a><c></c>')
  })

  it('can add attributes', () => {
    const element = fragdom.createElement('div')

    element.setAttribute('class', 'foo')
    element.reconcile()

    expect(element.realNode.getAttribute('class')).toBe('foo')
  })

  it('can remove attributes', () => {
    const element = fragdom.createElement('div')

    element.setAttribute('class', 'foo')
    element.reconcile()
    element.removeAttribute('class')
    element.reconcile()

    expect(element.realNode.getAttribute('class')).toBe(null)
  })

  it('can add instance attributes', () => {
    const element = fragdom.createElement('div')

    element.setAttribute('$message', 'Hello world')
    element.reconcile()

    expect(element.realNode.message).toBe('Hello world')
  })

  it('can remove attributes', () => {
    const element = fragdom.createElement('div')

    element.setAttribute('$message', 'Hello world')
    element.reconcile()
    element.removeAttribute('$message')
    element.reconcile()

    expect(element.realNode.message).toBe(null)
  })
})

describe('[nonstandard] .reconcileAsync()', () => {
  it('runs reconcile', done => {
    const element = fragdom.createElement('div')

    interceptMethod(element, 'reconcile', () => done())
    element.reconcileAsync()
  })

  it('runs reconcile after an animation frame', done => {
    const element = fragdom.createElement('div')
    element.reconcileAsync()
    requestAnimationFrame(() => {
      expect(element.realNode).toEqual(window.document.createElement('div'))
      done()
    })
  })

  it('cancels reconcileAsync when running reconcile', done => {
    const element = fragdom.createElement('div')

    let calls = 0

    interceptMethod(element, 'reconcile', () => {
      calls += 1
    })

    element.reconcileAsync()
    element.reconcile()

    requestAnimationFrame(() => {
      expect(calls).toBe(1)
      done()
    })
  })
})

it('sets the parentNode from the existing element', () => {
  const outer = document.createElement('outer')
  const inner = document.createElement('inner')

  outer.appendChild(inner)

  const wrappedInner = fragdom.wrap(inner)

  expect(wrappedInner.parentNode).toBe(fragdom.wrap(outer))
})

it('can wrap elements that are mounted to the document', () => {
  const outer = document.createElement('outer')
  const inner = document.createElement('inner')

  document.body.appendChild(outer)
  outer.appendChild(inner)

  const wrappedInner = fragdom.wrap(inner)

  expect(wrappedInner.parentNode).toBe(fragdom.wrap(outer))
})
