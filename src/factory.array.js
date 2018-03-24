const { clone, difference } = require('ramda')
const { isNotEmpty, isArray } = require('ramda-adjunct')
const Progress = require('./Progress')

const opts = { valueSafe: isArray, compare: difference, differs: isNotEmpty }

const of = (...args) => {
    return Progress(clone(opts), ...args)   
}

module.exports = { of, opts }