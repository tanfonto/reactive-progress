const test = require('tape')
const axioms = require('./axioms')
const Progress = require('./../src/Progress')
const { of, opts } = require('./../src/factory.array')
const { None } = require('./../src/None')

test('"Progress" satisfies functor axioms', t => {
    const functor = of
    
    axioms.functor(functor, 42, x => x + 2, x => x, t.deepEqual)

    t.end()
})

test('"Progress" satisfies monad axioms', t => {
    const unit = of
    const x = [2]
    const f = x => of(x, [3])
    const g = x => of(x, [4])

    axioms.monad(unit, x, f, g, t.deepEqual)

    t.end()
})    

const configTest = (t, opts) => {
    const progress = Progress({ opts }, [3]).map(() => [3, 4]).map(() => [4, 5])
    const value = progress.join() 
    t.ok(None.spec(value))
    t.end()
}

test('"Flatten" will return None if "valueSafe" predicate is not provided', t => {
    configTest(t, { compare: opts.compare, differs: opts.differs })
})

test('"Flatten" will return None if "compare" method is not provided', t => {
    configTest(t, { valueSafe: opts.valueSafe, differs: opts.differs })
})

test('"Flatten" will return None if "differs" method is not provided', t => {
    configTest(t, { valueSafe: opts.valueSafe, compare: opts.compare })
})