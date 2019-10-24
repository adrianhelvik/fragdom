import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.esm.js',
    format: 'esm',
  },
  plugins: [
    resolve(),
    babel({
      plugins: ['module:@babel/plugin-proposal-class-properties'],
    }),
  ],
}
