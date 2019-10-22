import util from 'util'

function indent(x) {
  if (typeof x !== 'string') {
    x = util.inspect(x)
  }
  return x
    .split('\n')
    .map(x => '  ' + x)
    .join('\n')
}

export default indent
