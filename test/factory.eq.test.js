const { of, opts } = require('./../src/factory.eq')
const { spec } = require('./../src/funcy')
const { None } = require('./../src/None')
const tester = require('./tester')
const valueSafe = opts.valueSafe

tester(of, '"of" returns new Progress', spec)

tester.truthy(valueSafe, '"valueSafe" returns true when provided with object', {})
tester.truthy(valueSafe, '"valueSafe" returns true when provided with array', [])
tester.truthy(valueSafe, '"valueSafe" returns true when provided with string', '42')
tester.truthy(valueSafe, '"valueSafe" returns true when provided with function', function(){})
tester.falsy(valueSafe, '"valueSafe" returns false when provided with null', null)
tester.falsy(valueSafe, '"valueSafe" returns false when provided with undefined', undefined)

tester(of, '"unit (of)" creates monadic object', spec)

tester(of(3, 'a', {}).log, '"log" returns whatever lift is provided with', [3, 'a', {}])

tester(of(3, 'a').chain(prev => of(prev, 42, {})).log, '"log" called on chained monad returns values from last two lifts', ['a', 42, {}])

tester(of(42).flatten, '"flatten" returns None if less than two values are provided', None.spec)

tester(of(undefined, null, 42).flatten, '"flatten" returns None if less than two safe values were provided', None.spec)

tester(of(undefined, null, 42).flatten, '"flatten" returns None if not all values provided are safe', None.spec)

tester(of('42', 42).flatten, '"flatten" returns diff according to difference strategy configured if all the values provided are found safe', 42)

tester(of(42, 42).flatten, '"flatten" returns None if all the values provided are equivalent according to difference strategy configured', None.spec)

tester(of(10).chain('42').log, '"chain" falls back to the last value if value provided to subsequent chain call is not a function', [10])

tester(of(42).chain(() => undefined).chain(() => 1).chain(() => 2).join, 'unsafe values are omitted', 2)

tester(of(42).chain(x => x + 5).join, 'functions passed to chain method are automatically lifted', 47)