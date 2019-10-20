import fragdom from '.'

test('bugfix', () => {
  // <container>
  //   <first-child>Hello world</first-child>
  //   <second-child>
  //     <p>Foo bar</p>
  //   </second-child>
  // </container>

  const container = fragdom.createElement('container')
  const firstChild = fragdom.createElement('first-child')
  const firstChildText = fragdom.createTextNode('Hello world')
  const secondChild = fragdom.createElement('second-child')
  const secondChildChild = fragdom.createElement('p')
  const secondChildChildText = fragdom.createTextNode('Foo bar')

  firstChild.appendChild(firstChildText)
  container.appendChild(firstChild)
  secondChildChild.appendChild(secondChildChildText)
  secondChild.appendChild(secondChildChild)
  container.appendChild(secondChild)

  container.reconcile()

  // <container></container>

  secondChild.remove()
  firstChild.remove()

  container.reconcile()

  expect(container.realNode.outerHTML).toBe('<container></container>')
})
