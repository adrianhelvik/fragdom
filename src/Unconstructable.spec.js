import Unconstructable, {
  disableConstructor,
  enableConstructor,
} from './Unconstructable.js'

it('is not constructable by default', () => {
  expect(() => new Unconstructable()).toThrow('Illegal constructor')
})

describe('', () => {
  afterEach(() => {
    disableConstructor()
  })

  it('can be constructed when enableConstructor is called', () => {
    enableConstructor()
    expect(() => new Unconstructable()).not.toThrow()
  })
})
