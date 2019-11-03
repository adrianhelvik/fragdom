import Document from './Document'
import h from './h'

let fragdom

beforeEach(() => {
  fragdom = new Document()
})

describe('debug', () => {
  it('can display nodes', () => {
    expect(
      (
        <div>
          <>Foo</>
          <>Bar</>
        </div>
      ).debug(),
    ).toBe(
      [
        '<div>',
        '  <>',
        '    Foo',
        '  </>',
        '  <>',
        '    Bar',
        '  </>',
        '</div>',
      ].join('\n'),
    )
  })

  it('can display functions', () => {
    expect(
      (
        <button
          $onclick={function() {
            alert('Hello world')
          }}
        >
          Say hi!
        </button>
      ).debug(),
    ).toContain(`alert('Hello world')`)
  })

  it('can show that an object is set as a prop (needs refinement)', () => {
    expect(<div $style={{ color: 'red' }} />.debug()).toBe(
      `<div $style={[object Object]}></div>`,
    )
  })
})

test('bugfix', () => {
  document.body.innerHTML = '<script></script>'
  const body = fragdom.wrap(document.body)
  const root = fragdom.createFragment()
  root.appendChild(fragdom.createTextNode('Hello world'))
  body.appendChild(root)
  root.reconcile()
  expect(document.body.innerHTML).toBe('<script></script>Hello world')
})

it('handles comments', () => {
  document.body.innerHTML = '<!-- My comment -->'
  const body = fragdom.wrap(document.body)
  const root = fragdom.createFragment()
  root.appendChild(fragdom.createTextNode('Hello world'))
  body.appendChild(root)
  root.reconcile()
  expect(document.body.innerHTML).toBe('<!-- My comment -->Hello world')
})

test('another bugfix', () => {
  const root = fragdom.createElement('div')
  root.reconcile()
  root.appendChild(<a />)
  root.reconcile()
  expect(root.realNode.innerHTML).toBe('<a></a>')
  root.childNodes[0].appendChild(<b />)
  root.reconcile()
  expect(root.realNode.innerHTML).toBe('<a><b></b></a>')
})

test('bugfix adjacent fragments', () => {
  const root = <div />

  root.appendChild(
    <>
      <>
        <>
          {''}
          {'1'}
          {'2'}
          {'3'}
        </>
      </>
    </>,
  )

  root.reconcile()

  root.childNodes[0].childNodes[0].childNodes[0].replaceChild(
    fragdom.createTextNode('Hello'),
    root.childNodes[0].childNodes[0].childNodes[0].childNodes[0],
  )

  root.childNodes[0].childNodes[0].reconcile()

  expect(root.realNode.innerHTML).toBe('Hello123')
})

test('bugfix fragment with element with text not updating', () => {
  const root = <div />

  root.reconcile()

  root.appendChild(
    <>
      <div>Hi "{'a'}"</div>
    </>,
  )

  root.reconcile()

  root.childNodes[0].childNodes[0].replaceChild(
    fragdom.createTextNode('b'),
    root.childNodes[0].childNodes[0].childNodes[1],
  )

  root.reconcile()

  expect(root.realNode.innerHTML).toBe('<div>Hi "b"</div>')
})
