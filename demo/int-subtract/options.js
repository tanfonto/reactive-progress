const { identity, equals, subtract , complement } = require('ramda')
const { isNotNil } = require('ramda-adjunct')
const isNotZero = complement(equals(0))
const done = equals(identity(42))

module.exports = { config: { valueSafe: isNotNil, compare: subtract, differs: isNotZero }, done }
