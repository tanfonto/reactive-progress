const { propOr, defaultTo, props, pickBy, keys, pipe, length, equals, lte, identity, and, reduce } = require('ramda')
const { isFunction, curryRight } = require('ramda-adjunct')
const { argv } = require('yargs')

const spec = pipe(props(['flatMap', 'flatten']), pickBy(isFunction), keys, length, equals(identity(2)))
const atLeast = (n, arr) => lte(identity(defaultTo(0, n)), length(defaultTo([], arr)))
const andN = (...args) => reduce((p, c) => and(p, c), true, args)
const argvOr = curryRight(propOr)(argv)

module.exports = { spec, atLeast, andN, argvOr }