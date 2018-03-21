const { argvOr } = require('./../src/funcy')
module.exports = { 
  type: argvOr('type', 'default'),
  method: argvOr('method', 'push') 
}
