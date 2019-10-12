import Node from './Node.js'

class Text extends Node {
  #value = null

  get textContent() {
    return this.#value
  }

  set textContent(value) {
    this.#value = value
  }

  constructor(text) {
    super()
    this.#value = text
  }
}

export default Text
