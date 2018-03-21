const { clone } = require('ramda')
const { type } = require('./args')
const Progress = require('./../src/Progress')
const options = require(`./${type + '/'}options`)

function factory (...args) {
    return Progress(clone(options.config), ...args)   
}

module.exports = { lift: factory, done: options.done }
