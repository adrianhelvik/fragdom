import fragdom from './fragdom'
import h from './h'

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
