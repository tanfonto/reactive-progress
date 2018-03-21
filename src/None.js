const { is } = require('ramda')

class None {
    static produce() {
        return new None()
    }
    static spec(obj) {
        return is(None, obj)
    }
    toString() {
        return "None"
    }
}

module.exports = { None }