const tester = require('./tester')
const { valueSafe } = require('./../src/options')

tester.truthy(valueSafe, '"valueSafe" returns true when provided with array', [])
tester.falsy(valueSafe, '"valueSafe" returns false when provided with null', null)
tester.falsy(valueSafe, '"valueSafe" returns false when provided with undefined', undefined)
tester.falsy(valueSafe, '"valueSafe" returns false when provided with null', undefined)
tester.falsy(valueSafe, '"valueSafe" returns false when provided with function', function(){})