const { join, propOr } = require('ramda')
const { run, options } = require('runjs')
const dargs = require('dargs')

const cli = (cmd, opts) => {
    const args = dargs(opts)
    run(`${cmd} ${join(' ', args)}`)
}

function lint () {
    cli('eslint **/*.js', options(this))
}   

function bundle () {
    cli('rollup -c', options(this))
}   

function test() {
    run("nyc --reporter=text --reporter=html tape test/*.test.js")
}

function build () {
    lint()
    test()
    bundle()
}       

function demo() {
    const opts = options(this)
    const method = propOr('push', 'method', opts)
    cli(`node ./demo/http-${method}.js`, opts)
}

module.exports = { lint, bundle, build, test, demo }
  