const { any } = require('ramda')
const { lift } = require('./Factory')
const { type } = require('./args')
const { done } = require(`./${type + '/'}options`)
const http = require('./server')
const print = console.log

let progress = lift([])

http.subscribe(async feed => {
    const resp = await feed
    progress = progress.chain(prev => lift(prev, resp))
    print(progress.flatten())
    return any(done)(progress.peek())   
})