import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { into, map } from 'ramda'

const MODULE_NAME = 'MProgress'
const formats = [ 'cjs', 'umd', 'es' ]

const produceConfig = format => {
  return {
    input: 'src/main.js',
    output: {
      format: [ format ],
      file: `dist/mprogress.${format}.js`,
    name: MODULE_NAME
  },
  plugins: [
    babel({
        exclude: 'node_modules/**'
    }),
    nodeResolve({
      module: true,
      jsnext: true,
      main: true
    }),
    commonjs({
      include: [ 'src/**', 'node_modules/**' ],
      exclude: ['src/**/*.test.js', 'src/tester.js'],
      sourceMap: false
    })
  ]
  }
}

const configs = into([], map(produceConfig), formats)

export default configs