const { not, any } = require('ramda')
const { lift } = require('./Factory')
const { type } = require('./args')
const { done } = require(`./${type + '/'}options`)
const http = require('./server')
const print = console.log

const pull = async (done, ms, leaky) => {
    const isDone = await done()
    if (not(isDone)) {
        if (leaky) clearTimeout(leaky)
        leaky = setTimeout(() => pull(done, ms, leaky), ms)
    }
}   

let progress = lift([])

pull(async () => {
    const feed = await http.fetch()
    progress = progress.chain(prev => lift(prev, feed))
    print(progress.flatten())
    return any(done)(progress.peek())
}, 2 * 1000)
