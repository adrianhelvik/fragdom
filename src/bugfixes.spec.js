import fragdom from '.'
import h from './h.js'

test('repro', () => {
  const root = <div />
  root.reconcile()
  root.appendChild(
    <>
      <div class="todoName">By "{''}"</div>
    </>,
  )
  root.reconcile()
  root.replaceChild(
    <>
      <div class="todoName">By "{'A nice name'}"</div>
    </>,
    root.childNodes[0],
  )
  root.reconcile()

  const todoNameNode = root.realNode.querySelector('.todoName')
  expect(todoNameNode).not.toBe(null)
  const wrappedTodoNameNode = fragdom.wrap(todoNameNode)

  expect(wrappedTodoNameNode.debug()).toBe(
    [
      /*****************************/
      '<div class={todoName}>',
      '  By "',
      '  A nice name',
      '  "',
      '</div>',
    ].join('\n'),
  )
  expect(todoNameNode.textContent).toBe('By "A nice name"')
})
