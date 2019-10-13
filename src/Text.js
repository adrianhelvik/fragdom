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

  reconsile() {
    const realNode =
      this.getPrivateRealNodeWithoutChecks() ||
      window.document.createTextNode(this.textContent)

    if (realNode.textContent !== this.textContent) {
      realNode.textContent = this.textContent
    }

    this.setRealNodeAfterReconsiliation(realNode)
  }
}

export default Text
