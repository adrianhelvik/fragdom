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
