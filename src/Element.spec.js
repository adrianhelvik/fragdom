import { interceptMethod } from '../testUtils.js'
import fragdom from './fragdom.js'
import h from './h.js'

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
    expect(fragment.dirty()).toBe(false)
    fragment.removeChild(b)
    expect(fragment.dirty()).toBe(true)
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

describe('[nonstandard .dirty()', () => {
  it('is true for newly created elements', () => {
    const element = fragdom.createElement('div')
    expect(element.dirty()).toBe(true)
  })

  it('is false after the initial reconciliation', () => {
    const element = fragdom.createElement('div')
    element.reconcile()
    expect(element.dirty()).toBe(false)
  })

  it('is true after setting an attribute', () => {
    const element = fragdom.createElement('div')
    element.reconcile()
    element.setAttribute('class', 'my-div')
    expect(element.dirty()).toBe(true)
  })

  it('is true after removing an attribute', () => {
    const element = fragdom.createElement('div')
    element.reconcile()
    element.setAttribute('class', 'my-div')
    element.reconcile()
    element.removeAttribute('class')
    expect(element.dirty()).toBe(true)
  })

  it('is true after appending a child', () => {
    const element = fragdom.createElement('div')
    element.reconcile()
    element.appendChild(fragdom.createElement('div'))
    expect(element.dirty()).toBe(true)
  })

  it('is true after removing a child', () => {
    const element = fragdom.createElement('div')
    element.reconcile()
    element.appendChild(fragdom.createElement('div'))
    element.reconcile()
    element.removeChild(element.childNodes[0])
    expect(element.dirty()).toBe(true)
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

describe('.replaceChild(newChild, oldChild)', () => {
  it('replaces the child in .childNodes', () => {
    const template = (
      <outer>
        <a />
        <b />
        <c />
      </outer>
    )

    template.replaceChild(
      fragdom.createElement('new-b'),
      template.childNodes[1],
    )

    expect(template.debug()).toBe(
      [
        '<outer>',
        '  <a></a>',
        '  <new-b></new-b>',
        '  <c></c>',
        '</outer>',
      ].join('\n'),
    )
  })

  it('reconciles correctly', () => {
    const template = (
      <outer>
        <a />
        <b />
        <c />
      </outer>
    )

    template.reconcile()

    template.replaceChild(
      fragdom.createElement('new-b'),
      template.childNodes[1],
    )

    template.reconcile()

    expect(template.realNode.innerHTML).toBe('<a></a><new-b></new-b><c></c>')
  })

  test('reconciliation bugfix', () => {
    const root = <div />

    const frag = (
      <>
        {'1'}
        {''}
        {'2'}
      </>
    )

    root.appendChild(frag)
    frag.reconcile()

    frag.replaceChild(fragdom.createTextNode('Hello'), frag.childNodes[1])
    frag.reconcile()

    expect(root.realNode.innerHTML).toBe('1Hello2')
  })
})

test('bugfix: Element containing fragment that shrunk in size', () => {
  const root = <div />

  root.reconcile()

  root.appendChild(
    <div>
      {'done'}
      <input />
    </div>,
  )

  root.reconcile()

  expect(root.realNode.innerHTML).toBe('<div>done<input></div>')

  root.childNodes[0].replaceChild(<></>, root.childNodes[0].childNodes[0])

  window.DEBUG_FRAGDOM_ELEMENT = true

  root.reconcile()

  expect(root.realNode.innerHTML).toBe('<div><input></div>')
})
