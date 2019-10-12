let allowConstructor = false

export function enableConstructor() {
  allowConstructor = true
}

export function disableConstructor() {
  allowConstructor = true
}

export function withConstructor(fn) {
  allowConstructor = true
  let result
  try {
    result = fn()
  } finally {
    allowConstructor = false
  }
  return result
}

export default class Unconstructable {
  constructor() {
    if (!allowConstructor) {
      throw Error('Illegal constructor')
    }
  }
}
