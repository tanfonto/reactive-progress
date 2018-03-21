const { identity, equals } = require('ramda')
const { isNotNil, isTrue } = require('ramda-adjunct')
const done = equals(identity(42))

module.exports = { config: { valueSafe: isNotNil, compare: equals, differs: isTrue }, done }
