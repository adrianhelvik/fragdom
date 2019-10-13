import Fragment from './Fragment.js'
import Document from './Document.js'
import Element from './Element.js'
import Text from './Text.js'

let document

beforeEach(() => {
  document = new Document()
})

describe('.createElement(tagName)', () => {
  it('can create an element', () => {
    const element = document.createElement('div')
    expect(element).toBeInstanceOf(Element)
  })

  it('assigns the tagName', () => {
    const element = document.createElement('div')
    expect(element.tagName).toBe('DIV')
  })

  it('can not override the tagName', () => {
    const element = document.createElement('div')

    element.tagName = 'span'

    expect(element.tagName).toBe('DIV')
  })

  it('[nonstandard] throws if tagName is not a string', () => {
    expect(() => document.createElement(null)).toThrow(/string/i)
  })
})

describe('[nonstandard] .createFragment()', () => {
  it('creates a fragment', () => {
    const fragment = document.createFragment()

    expect(fragment).toBeInstanceOf(Fragment)
  })
})

describe('createTextNode', () => {
  it('creates a text node', () => {
    const text = document.createTextNode('Hello world')
    expect(text).toBeInstanceOf(Text)
  })

  it('sets the text of the node', () => {
    const text = document.createTextNode('Hello world')
    expect(text.textContent).toBe('Hello world')
  })
})

describe('wrap(element)', () => {
  it('creates a virtual element', () => {
    const realNode = window.document.createElement('div')
    const node = document.wrap(realNode)

    expect(node).toBeInstanceOf(Element)
  })

  it('assigns the correct tagName', () => {
    const realNode = window.document.createElement('div')
    const node = document.wrap(realNode)

    expect(node.tagName).toBe('DIV')
  })

  it('sets all attributes', () => {
    const realNode = window.document.createElement('div')
    realNode.setAttribute('class', 'foo')
    const node = document.wrap(realNode)

    expect(node.attributes.class).toBe('foo')
  })
})
