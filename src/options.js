const { difference } = require('ramda')
const { isNotEmpty } = require('ramda-adjunct')
const { isArray } = require('ramda-adjunct')

module.exports = { valueSafe: isArray, compare: difference, differs: isNotEmpty }