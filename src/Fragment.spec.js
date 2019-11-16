import { interceptMethod } from '../testUtils.js'
import Fragment from './Fragment.js'
import fragdom from '.'
import h from './h'

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('reconcile', () => {
  it('reconciles all child nodes', () => {
    const fragment = fragdom.createFragment()
    const a = fragdom.createElement('a')
    const b = fragdom.createElement('b')
    const c = fragdom.createElement('c')

    fragment.appendChild(a)
    fragment.appendChild(b)
    fragment.appendChild(c)
    fragment.reconcile()

    expect(fragment.realNode).toEqual([
      document.createElement('a'),
      document.createElement('b'),
      document.createElement('c'),
    ])
  })

  it('merges with child fragments', () => {
    const fragment = fragdom.createFragment()
    const childFragment = fragdom.createFragment()
    const a = fragdom.createElement('a')
    const b = fragdom.createElement('b')
    const c = fragdom.createElement('c')

    fragment.appendChild(a)
    fragment.appendChild(childFragment)
    childFragment.appendChild(b)
    childFragment.appendChild(c)
    fragment.reconcile()

    expect(fragment.realNode).toEqual([
      document.createElement('a'),
      document.createElement('b'),
      document.createElement('c'),
    ])
  })

  it('triggers a reconciliation in the closest non-fragment parent', () => {
    const a = fragdom.createElement('div')
    const b = fragdom.createFragment()
    const c = fragdom.createFragment()
    const d = fragdom.createTextNode('Hello world')

    a.appendChild(b)
    b.appendChild(c)
    c.appendChild(d)

    let success = false

    a.reconcile = () => {
      success = true
    }

    c.reconcile()

    expect(success).toBe(true)
  })

  it('can access the realNode of an empty fragment', () => {
    const fragment = fragdom.createFragment()

    fragment.reconcile()

    expect(() => fragment.realNode).not.toThrow()
  })

  test('bugfix: Reconciliation would throw for an appended fragment', () => {
    const node = (
      <>
        <h1>Hello world</h1>
        Foo <>bar</>
        <b>Baz</b>
      </>
    )

    const container = document.createElement('div')

    document.body.appendChild(container)

    fragdom.wrap(container).appendChild(node)
    expect(() => {
      fragdom.wrap(container).reconcile()
    }).not.toThrow()

    expect(container.innerHTML).toBe('<h1>Hello world</h1>Foo bar<b>Baz</b>')
  })

  test('bugfix', () => {
    const root = <div />

    root.reconcile()

    root.appendChild(
      <div>
        {'done'}
        <input />
      </div>,
    )

    root.reconcile()

    root.childNodes[0].replaceChild(<></>, root.childNodes[0].childNodes[0])

    root.reconcile()

    expect(root.realNode.innerHTML).toBe('<div><input></div>')
  })
})

describe('reconcileAsync', () => {
  it('runs reconcile', done => {
    const fragment = fragdom.createFragment()

    interceptMethod(fragment, 'reconcile', () => done())
    fragment.reconcileAsync()
  })

  it('runs reconcile after an animation frame', done => {
    const fragment = fragdom.createFragment()
    fragment.appendChild(fragdom.createElement('div'))

    fragment.reconcileAsync()

    requestAnimationFrame(() => {
      expect(fragment.realNode).toEqual([document.createElement('div')])
      done()
    })
  })

  xit('cancels reconcileAsync when running reconcile', done => {
    let desiredReconcileCount = 0

    {
      const fragment = fragdom.createFragment()
      interceptMethod(fragment, 'reconcile', () => {
        desiredReconcileCount += 1
      })
      fragment.reconcile()
    }

    const fragment = fragdom.createFragment()
    let calls = 0

    interceptMethod(fragment, 'reconcile', () => {
      calls += 1
    })

    fragment.reconcileAsync()
    fragment.reconcile()

    requestAnimationFrame(() => {
      expect(calls).toBe(desiredReconcileCount)
      done()
    })
  })
})
