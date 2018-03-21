const { not } = require('ramda')
const { isNotEmpty } = require('ramda-adjunct')
const { type } = require('./args')
const states = require(`./${type + '/'}data`)

module.exports = {
    fetch: () => Promise.resolve(states.shift()),
    subscribe: cb => {
        const push = async (ms, leaky) => {
            const unsub = await cb(Promise.resolve(states.shift()))
            if (isNotEmpty(states)) {
                if (leaky) clearTimeout(leaky)
                if (not(unsub)) leaky = setTimeout(() => push(ms, leaky), ms)
            }
        }
        push(2 * 1000)
    }
}


