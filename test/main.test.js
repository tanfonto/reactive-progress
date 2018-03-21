const { of } = require('./../src/main')
const { spec } = require('./../src/funcy')
const tester = require('./tester')

tester(of, '"of" returns new Progress', spec)