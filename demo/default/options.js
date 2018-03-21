const { any, equals, identity } = require('ramda')
const options = require('./../../src/options')
const done = any(equals(identity('status4')))

module.exports = { config: options, done }