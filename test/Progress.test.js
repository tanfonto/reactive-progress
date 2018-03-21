const dopts = require('./../src/options')
const test = require('tape')
const tester = require('./tester')
const axioms = require('./axioms')
const Progress = require('./../src/Progress')
const { of } = require('./../src/main')
const { spec } = require('./../src/funcy')
const { None } = require('./../src/None')

test('"Progress" satisfies functor axioms (values unsafe according to the difference method configured)', t => {
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
    configTest(t, { compare: dopts.compare, differs: dopts.differs })
})

test('"Flatten" will return None if "compare" method is not provided', t => {
    configTest(t, { valueSafe: dopts.valueSafe, differs: dopts.differs })
})

test('"Flatten" will return None if "differs" method is not provided', t => {
    configTest(t, { valueSafe: dopts.valueSafe, compare: dopts.compare })
})

test('"Progress" satisfies functor axioms (values safe according to the difference method configured)', t => {
    const functor = of
    
    axioms.functor(functor, [42], x => [...x, 2], x => [x], t.deepEqual)
    
    t.end()
})

tester(of, '"unit (of)" creates monadic object', spec)

tester(of(3, 'a', {}).log, '"log" returns whatever lift is provided with, wrapped in an array', [3, 'a', {}])

tester(of(3, 'a').chain(prev => of(prev, 42, {})) .log, 
    '"log" called on chained monad returns the last argument of the monad on which chain is called and all the arguments passed to chained lift', 
    ['a', 42, {}])

tester(of(42).flatten, '"flatten" returns None if less than two values were provided', None.spec)

tester(of(undefined, null, 42).flatten, '"flatten" returns None if less than two safe values were provided', None.spec)

tester(of(undefined, null, '42', 42).flatten, '"flatten" returns None if not all values provided are safe', None.spec)

tester(of(['42'], [42]).flatten, 
    `"flatten" returns diff according to difference strategy configured if all the values provided are safe 
    (according to value safety strategy configured)`, [42])

tester(of([42], [42]).flatten, 
    '"flatten" returns None if all the values provided are equivalent according to difference strategy configured', None.spec)

tester(of(10).chain('42').log, 
    '"chain" falls back to current value if map provided is neither a monad nor a function', [10])