const { F, empty, ifElse, defaultTo, complement, memoize, and, all, not, when, always, isNil, reject, takeLast, identity, reverse, head } = require('ramda')
const { isFunction, isNotEmpty } = require('ramda-adjunct')
const { atLeast } = require('./funcy')
const None = require('./None').None.produce

function Progress(opts, ...state) {

    const { valueSafe = F, compare = always(None()), differs = always(false) } = opts

    function map(f)  {
        return Progress(opts, previous(), f(previous())) 
    }
    
    function chain (f) {
        return isFunction(f) ? f(previous()) : Progress(opts, ...state)
    }  
    
    function join() {
        if (not(and(atLeast(2, values()), all(valueSafe)(values())))) return None()
        const difference = compare(...reverse(takeLast(identity(2), values()))) 
        return when(complement(differs), None)(difference)
    }
    
    function previous() {
        return head(takeLast(identity(1), log()))
    }
    
    function values() {
        return memoize(ifElse(isNotEmpty, reject(isNil), empty([])))(state)
    }

    function log() {
        return defaultTo([], state)
    }

    return {
        log: log,
        peek: log,
        map: map,
        flatMap: chain,
        chain: chain,
        join: join,
        flatten: join,
        value: join,
    }
}

module.exports = Progress