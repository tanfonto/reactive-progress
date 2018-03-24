import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import { defaultTo, union, flatten, into, map, length, zipWith, repeat, always } from 'ramda'

const MODULE_NAME = always('MProgress')
const minSuffix = always('.min')
const formats = [ 'cjs', 'umd', 'es' ]

const produceConfig = ({ format, suffix }) => {
  const plugins = union([
    babel({
        exclude: 'node_modules/**'
    }),
    nodeResolve({
      module: true,
      main: true
    }),
    commonjs({
      include: [ './index.js', 'src/**/*.js', 'node_modules/**' ],
      exclude: ['src/test/**/*.js'],
      sourceMap: false
    })],  
    [...(suffix ? [uglify()] : [])]
  )

  return {
    input: './index.js',
    output: {
      format: [ format ],
      file: `dist/mprogress.${format}${defaultTo('', suffix)}.js`,
    name: MODULE_NAME()
  },
  plugins: plugins
  }
}

const configs = into(
  [], 
  map(produceConfig), 
  flatten([...zipWith((format, suffix) => [{ format }, { format, suffix }], formats, repeat(minSuffix(), length(formats)))])
)

export default configs