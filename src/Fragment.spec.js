import { interceptMethod } from '../testUtils.js'
import Fragment from './Fragment.js'
import Document from './Document.js'

describe('reconcile', () => {
  it('reconcile all child nodes', () => {
    const document = new Document()
    const fragment = document.createFragment()
    const a = document.createElement('a')
    const b = document.createElement('b')
    const c = document.createElement('c')

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
    const document = new Document()
    const fragment = document.createFragment()
    const childFragment = document.createFragment()
    const a = document.createElement('a')
    const b = document.createElement('b')
    const c = document.createElement('c')

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
})

describe('reconcileAsync', () => {
  it('runs reconcile', done => {
    const document = new Document()
    const fragment = document.createFragment()

    interceptMethod(fragment, 'reconcile', () => done())
    fragment.reconcileAsync()
  })

  it('runs reconcile after an animation frame', done => {
    const document = new Document()
    const fragment = document.createFragment()
    fragment.appendChild(document.createElement('div'))

    fragment.reconcileAsync()

    requestAnimationFrame(() => {
      expect(fragment.realNode).toEqual([window.document.createElement('div')])
      done()
    })
  })

  it('cancels reconcileAsync when running reconcile', done => {
    const document = new Document()
    const fragment = document.createFragment()

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
    const document = new Document()
    const fragment = document.createFragment()

    fragment.reconcile()

    expect(() => fragment.realNode).not.toThrow()
  })
})
