const { is } = require('ramda')
const { None } = require('./../src/None')
const tester = require('./tester')

tester(None.produce, '"produce" returns instance of None', is(None))

tester(None.spec, '"spec" returns true if provided with instance of None', true, new None())
tester(None.spec, '"spec" returns false if provided with null', false, null)
tester(None.spec, '"spec" returns false if provided with undefined', false, undefined)
tester(None.spec, '"spec" returns false if provided with function', false, function() {})
tester(None.spec, '"spec" returns false if provided with arbitrary object', false, {})

tester(None.produce().toString, '"toString" returns "None"', "None")
