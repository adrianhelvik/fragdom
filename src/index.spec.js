import fragdom from '.'
import h from './h'

test('bugfix 1', () => {
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

test('bugfix 2', () => {
  const root = (
    <div id="root">
      <>
        <></>
      </>
    </div>
  )

  root.reconcile()

  root.childNodes[0].childNodes[0].appendChild(
    <>
      <>Hello world!</>
    </>,
  )

  root.childNodes[0].childNodes[0].childNodes[0].reconcile()

  expect(root.realNode.innerHTML).toBe('Hello world!')
})
