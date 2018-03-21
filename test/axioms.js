const { partialRight } = require('ramda')

function monad(unit, x, f, g, eq) {
    const m = () => unit(x)
    const trace = partialRight(equal, [eq])

    trace(unit(x).chain(f), f(x), "left identity satisfied")
    trace(unit(x).chain(f).chain(g), g(f(x).flatten()), "left identity satisfied (double)")
    trace(m().chain(unit), m(), "right identity satisfied")
    trace(m().chain(f).chain(g), m().chain(x => f(x).chain(g)), "associativity satisfied")
}

function functor(functor, val, f, g, eq) {
    equal(functor(val).map(f).map(g), functor(val).map(x => g(f(x))), "composable mapping satisfied", eq)
}

const equal = (x, y, message, eq) => { 
    const valx = x.join()
    const valy = y.join()
    eq(valx, valy, `${message} : ${valx} ==== ${valy}`)
}

module.exports = { monad, functor }