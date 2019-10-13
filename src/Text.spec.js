import Document from './Document.js'
import Text from './Text.js'

const document = new Document()

it('can be created', () => {
  const text = document.createTextNode('Hello world')

  expect(text).toBeInstanceOf(Text)
})

it('can set/get textContent', () => {
  const text = document.createTextNode('Hello world')

  text.textContent = 'Foo bar'

  expect(text.textContent).toBe('Foo bar')
})

describe('.reconcile()', () => {
  it('can create the .realNode', () => {
    const text = document.createTextNode('Hello world')
    text.reconcile()
    expect(text.realNode.textContent).toBe('Hello world')
  })

  it('can update the .realNode', () => {
    const text = document.createTextNode('Hello world')
    text.reconcile()
    text.textContent = 'Foo bar'
    text.reconcile()
    expect(text.realNode.textContent).toBe('Foo bar')
  })
})

describe('.reconcileAsync', () => {
  it('runs .reconcile()', done => {
    const text = document.createTextNode('Hello world')
    text.reconcile = done
    text.reconcileAsync()
  })

  it('creates the .realNode after an animation frame', done => {
    const text = document.createTextNode('Hello world')
    text.reconcile()
    text.textContent = 'Foo bar'
    text.reconcileAsync()
    expect(text.realNode.textContent).toBe('Hello world')
    requestAnimationFrame(() => {
      expect(text.realNode.textContent).toBe('Foo bar')
      done()
    })
  })
})
