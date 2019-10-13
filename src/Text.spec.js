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

describe('.reconsile()', () => {
  it('can create the .realNode', () => {
    const text = document.createTextNode('Hello world')
    text.reconsile()
    expect(text.realNode.textContent).toBe('Hello world')
  })

  it('can update the .realNode', () => {
    const text = document.createTextNode('Hello world')
    text.reconsile()
    text.textContent = 'Foo bar'
    text.reconsile()
    expect(text.realNode.textContent).toBe('Foo bar')
  })
})
