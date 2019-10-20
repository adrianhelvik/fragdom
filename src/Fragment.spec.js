import { interceptMethod } from '../testUtils.js'
import Fragment from './Fragment.js'
import fragdom from '.'

describe('reconcile', () => {
  it('reconcile all child nodes', () => {
    const fragment = fragdom.createFragment()
    const a = fragdom.createElement('a')
    const b = fragdom.createElement('b')
    const c = fragdom.createElement('c')

    fragment.appendChild(a)
    fragment.appendChild(b)
    fragment.appendChild(c)
    fragment.reconcile()

    expect(fragment.realNode).toEqual([
      window.document.createElement('a'),
      window.document.createElement('b'),
      window.document.createElement('c'),
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
      window.document.createElement('a'),
      window.document.createElement('b'),
      window.document.createElement('c'),
    ])
  })

  it('triggers a reconciliation in the closest non-fragment parent', done => {
    const a = fragdom.createElement('div')
    const b = fragdom.createFragment()
    const c = fragdom.createFragment()
    const d = fragdom.createTextNode('Hello world')

    a.appendChild(b)
    b.appendChild(c)
    c.appendChild(d)

    a.reconcile = done

    c.reconcile()
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
      expect(fragment.realNode).toEqual([window.document.createElement('div')])
      done()
    })
  })

  it('cancels reconcileAsync when running reconcile', done => {
    const fragment = fragdom.createFragment()

    let calls = 0

    interceptMethod(fragment, 'reconcile', () => {
      calls += 1
    })

    fragment.reconcileAsync()
    fragment.reconcile()

    requestAnimationFrame(() => {
      expect(calls).toBe(1)
      done()
    })
  })

  it('can access the realNode of an empty fragment', () => {
    const fragment = fragdom.createFragment()

    fragment.reconcile()

    expect(() => fragment.realNode).not.toThrow()
  })
})
