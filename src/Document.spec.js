import Fragment from './Fragment.js'
import Document from './Document.js'
import Element from './Element.js'
import Text from './Text.js'

let fragdom

beforeEach(() => {
  fragdom = new Document()
})

describe('.createElement(tagName)', () => {
  it('can create an element', () => {
    const element = fragdom.createElement('div')
    expect(element).toBeInstanceOf(Element)
  })

  it('assigns the tagName', () => {
    const element = fragdom.createElement('div')
    expect(element.tagName).toBe('DIV')
  })

  it('can not override the tagName', () => {
    const element = fragdom.createElement('div')

    try {
      element.tagName = 'span'
    } catch (e) {}

    expect(element.tagName).toBe('DIV')
  })

  it('[nonstandard] throws if tagName is not a string', () => {
    expect(() => fragdom.createElement(null)).toThrow(/string/i)
  })
})

describe('[nonstandard] .createFragment()', () => {
  it('creates a fragment', () => {
    const fragment = fragdom.createFragment()

    expect(fragment).toBeInstanceOf(Fragment)
  })
})

describe('createTextNode', () => {
  it('creates a text node', () => {
    const text = fragdom.createTextNode('Hello world')
    expect(text).toBeInstanceOf(Text)
  })

  it('sets the text of the node', () => {
    const text = fragdom.createTextNode('Hello world')
    expect(text.textContent).toBe('Hello world')
  })
})

describe('wrap(element)', () => {
  it('creates a virtual element', () => {
    const realNode = document.createElement('div')
    const node = fragdom.wrap(realNode)

    expect(node).toBeInstanceOf(Element)
  })

  it('assigns the correct tagName', () => {
    const realNode = document.createElement('div')
    const node = fragdom.wrap(realNode)

    expect(node.tagName).toBe('DIV')
  })

  it('sets all attributes', () => {
    const realNode = document.createElement('div')
    realNode.setAttribute('class', 'foo')
    const node = fragdom.wrap(realNode)

    expect(node.attributes.class).toBe('foo')
  })

  it('returns the same node for a given element', () => {
    const realNode = document.createElement('div')

    const a = fragdom.wrap(realNode)
    const b = fragdom.wrap(realNode)

    expect(a).toBe(b)
  })

  it('throws if the subject is not a node', () => {
    expect(() => fragdom.wrap('Hello world')).toThrow()
  })

  it('can wrap document', () => {
    expect(fragdom.wrap(document)).toBe(fragdom)
  })

  it('can wrap text nodes', () => {
    const text = document.createTextNode('Hello world')
    const wrapped = fragdom.wrap(text)
    expect(wrapped.textContent).toBe('Hello world')
  })
})
