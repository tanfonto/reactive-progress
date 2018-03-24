const { clone, equals, cond, complement, identity, F } = require('ramda')
const { isNotNil } = require('ramda-adjunct')
const Progress = require('./Progress')
const eq = (...args) => cond([
    [ complement(equals), identity ],
    [ F, F ]
])(...args)

const opts = { valueSafe: isNotNil, compare: eq, differs: isNotNil }

const of = (...args) => {
    return Progress(clone(opts), ...args)   
}

module.exports = { of, opts }