import { interceptMethod } from '../testUtils.js'
import Document from './Document.js'

describe('setAttribute(key, value)', () => {
  it('updates .attributes', () => {
    const document = new Document()
    const element = document.createElement('div')
    element.setAttribute('class', 'foo')

    expect(element.attributes).toEqual({ class: 'foo' })
  })
})

describe('[nonstandard] .reconcile()', () => {
  it('creates the real element', () => {
    const document = new Document()
    const element = document.createElement('div')

    element.reconcile()

    expect(element.realNode).toBeInstanceOf(window.Element)
  })

  it('does not create a new element the second time', () => {
    const document = new Document()
    const element = document.createElement('div')

    element.reconcile()
    const a = element.realNode
    element.reconcile()
    const b = element.realNode

    expect(a).toBe(b)
  })

  it('appends all element children', () => {
    const document = new Document()
    const a = document.createElement('outer')
    const b = document.createElement('inner')

    a.appendChild(b)
    a.reconcile()

    const element = a.realNode

    expect(element.outerHTML).toBe('<outer><inner></inner></outer>')
  })

  it('can remove children', () => {
    const document = new Document()
    const outer = document.createElement('outer')
    const child = document.createElement('child')

    outer.appendChild(child)
    outer.reconcile()
    outer.removeChild(child)
    outer.reconcile()

    const element = outer.realNode

    expect(element.outerHTML).toBe('<outer></outer>')
  })

  it('can replace children', () => {
    const document = new Document()
    const outer = document.createElement('outer')
    const before = document.createElement('before')
    const after = document.createElement('after')

    outer.appendChild(before)
    outer.reconcile()
    outer.removeChild(before)
    outer.appendChild(after)
    outer.reconcile()

    const element = outer.realNode

    expect(element.outerHTML).toBe('<outer><after></after></outer>')
  })

  it("retains focus when a child isn't (re-/)moved", () => {
    const document = new Document()
    const container = document.createElement('container')
    const input = document.createElement('input')

    container.appendChild(input)
    container.reconcile()

    input.realNode.focus()

    container.reconcile()

    expect(window.document.activeElement).toBe(input.realNode)
  })

  it('can add fragments', () => {
    const document = new Document()
    const container = document.createElement('container')
    const fragment = document.createFragment()
    const a = document.createElement('a')
    const b = document.createElement('b')
    const c = document.createElement('c')

    container.appendChild(fragment)
    fragment.appendChild(a)
    fragment.appendChild(b)
    fragment.appendChild(c)

    container.reconcile()

    expect(container.realNode.innerHTML).toBe('<a></a><b></b><c></c>')
  })

  it('can remove fragments', () => {
    const document = new Document()
    const container = document.createElement('container')
    const fragment = document.createFragment()
    const a = document.createElement('a')
    const b = document.createElement('b')
    const c = document.createElement('c')

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
    const document = new Document()
    const element = document.createElement('div')

    element.setAttribute('class', 'foo')
    element.reconcile()

    expect(element.realNode.getAttribute('class')).toBe('foo')
  })

  it('can remove attributes', () => {
    const document = new Document()
    const element = document.createElement('div')

    element.setAttribute('class', 'foo')
    element.reconcile()
    element.removeAttribute('class')
    element.reconcile()

    expect(element.realNode.getAttribute('class')).toBe(null)
  })

  it('can add instance attributes', () => {
    const document = new Document()
    const element = document.createElement('div')

    element.setAttribute('$message', 'Hello world')
    element.reconcile()

    expect(element.realNode.message).toBe('Hello world')
  })

  it('can remove attributes', () => {
    const document = new Document()
    const element = document.createElement('div')

    element.setAttribute('$message', 'Hello world')
    element.reconcile()
    element.removeAttribute('$message')
    element.reconcile()

    expect(element.realNode.message).toBe(null)
  })
})

describe('[nonstandard] .reconcileAsync()', () => {
  it('runs reconcile', done => {
    const document = new Document()
    const element = document.createElement('div')

    interceptMethod(element, 'reconcile', () => done())
    element.reconcileAsync()
  })

  it('runs reconcile after an animation frame', done => {
    const document = new Document()
    const element = document.createElement('div')
    element.reconcileAsync()
    requestAnimationFrame(() => {
      expect(element.realNode).toEqual(window.document.createElement('div'))
      done()
    })
  })

  it('cancels reconcileAsync when running reconcile', done => {
    const document = new Document()
    const element = document.createElement('div')

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
