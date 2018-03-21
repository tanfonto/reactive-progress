const tape = require('tape')
const { curry, __ } = require('ramda')
const { isFunction } = require('ramda-adjunct')

function test(underTest, description, expectation, ...args) {
    tape(description, t => {
        const actual = underTest(...args)
        if (isFunction(expectation)) t.ok(expectation(actual))
        else t.deepEqual(actual, expectation)
        t.end()
    })
}

const predicatify = val => curry(test)(__, __, val)

test.falsy = predicatify(false)
test.truthy = predicatify(true)

module.exports = test