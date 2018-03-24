const { any, equals, identity } = require('ramda')
const { opts } = require('./../../src/factory.array')
const done = any(equals(identity('status4')))

module.exports = { config: opts, done }