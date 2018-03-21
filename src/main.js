const { clone } = require('ramda')
const Progress = require('./Progress')
const defaults = require('./options')

const factory = (...args) => {
    return Progress(clone(defaults), ...args)   
}

factory.of = (...args) => factory(...args)

module.exports = factory    