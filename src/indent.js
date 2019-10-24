export default function indent(x) {
  return x
    .split('\n')
    .map(x => '  ' + x)
    .join('\n')
}
