[![Build Status](https://travis-ci.org/whapky/monadic-progress.svg?branch=master)](https://travis-ci.org/whapky/monadic-progress)
[![Coverage Status](https://coveralls.io/repos/github/whapky/monadic-progress/badge.svg)](https://coveralls.io/github/whapky/monadic-progress)
[![bitHound Code](https://www.bithound.io/github/whapky/monadic-progress/badges/code.svg)](https://www.bithound.io/github/whapky/monadic-progress)
[![bitHound Overall Score](https://www.bithound.io/github/whapky/monadic-progress/badges/score.svg)](https://www.bithound.io/github/whapky/monadic-progress)
## **Monadic-progress**

A tiny library designed to simplify common progress tracking tasks (i.e. worker-based background processing, busy waiting, interval-based http calls) and assure value safety by 'swallowing' unsafe values and automating comparisons across subsequent chain calls. Makes heavy use of [Ramda](http://ramdajs.com/) and [Ramda-adjunct](https://github.com/char0n/ramda-adjunct), written in a functional manner.

#### Installation:
```sh
npm i -s monadic-progress
```

#### Example usage:

Import one of the default factories
```JavaScript
const { array: Progress } = require('monadic-progress')
const progress = Progress.of([42])
//or
const { value: Progress } = require('monadic-progress')
const progress = Progress.of(42)
```
or the basic ```Progress``` factory function (keep in mind, that unlike factories, this one requires some configuration):
```JavaScript
const Progress = require('monadic-progress/src/Progress')
const progress = Progress.({ options }, 42)
```

The Default ```array``` factory expects ```chain``` (aka bind) and ```map``` input to be wrapped in an array (non-array types are considered unsafe and ignored). This is because it runs Ramda's ['difference'](http://ramdajs.com/docs/#difference) against last two values. The following code will evaluate to 'None' for that reason:

```javascript
const progress = Progress.of(["initial state"])
  .chain(prev => Progress.of(prev, ["some other state"]))
  .chain(() => undefined)
  .chain(() => Progress.of(["some other state"]))
  .chain(() => Progress.of(null)
  .chain(() => Progress.of(["different state"]))
  .chain(() => 5))

console.log(progress.flatten()) //prints 'None {}'
```
This snippet will print '[42]' though:

```javascript
const progress = Progress.of(["initial state"])
  .chain(prev => Progress.of(prev, ["some other state"]))
  .chain(() => undefined)
  .chain(() => Progress.of(["some other state"]))
  .chain(() => Progress.of(null)
  .chain(() => Progress.of(["different state"]))
  .chain(() => [42]))

console.log(progress.flatten()) //prints [42]
```

This behaviour is configurable via ```opts``` argument of the ```Progress``` factory function. Default factories preconfigure it with a set of 3 functions, the process of customising the configuration is as simple as defining a new set and passing it to the aforementioned ```Progress``` factory function.

Expected functions are:

``` valueSafe -> boolean ```
Run against all the values known to ```Progress``` instance. Comparison (flatten / join) will return 'None' if any value evaluates to false. Defaults to ['F'](http://ramdajs.com/docs/#F).
```Array``` factory uses ['isArray'](https://char0n.github.io/ramda-adjunct/2.6.0/RA.html#.isArray) and ```value``` factory defaults to ['isNotNil'](https://char0n.github.io/ramda-adjunct/2.6.0/RA.html#.isNotNil).

``` compare -> any ```
Run against last two values in **reversed** order, defaults to 'None', ```Array``` factory uses ['difference'](http://ramdajs.com/docs/#difference) and ```value``` factory defaults to negated ['equals'](http://ramdajs.com/docs/#equals).

``` differs -> boolean ```
Run against comparison result to determine whether it should be considered a match, 'None' is returned in other case. Defaults to false. ```Array``` factory uses ['isNotEmpty'](https://char0n.github.io/ramda-adjunct/2.6.0/RA.html#.isNotEmpty) and ```value``` factory defaults to ['isNotNil'](https://char0n.github.io/ramda-adjunct/2.6.0/RA.html#.isNotNil).

Check 'demo' for alternative configuration examples.

#### Build

Powered by ['Rollup'](https://rollupjs.org/guide/en) and ['Runjs'](https://github.com/pawelgalazka/runjs) 

Run ``` npx run build ``` or use the command defined under the ```build``` task in 'runfile.js'.

By default, Rollup will build umd, Commonjs and ES6 compatible bundles, adjustment can be achieved by changing the contents of 'formats' array inside the rollup.config.js file.

#### Test
 
Run ``` npx run test ``` or use the command defined under the 'test' task in the 'runfile.js'.

#### Demo

Run ```npx run demo``` for an example of Progress run against a fake http server with ```array``` factory. Accepts two arguments ```--method=[pull|push]``` (defaults to 'push') and ```--type=[default|int-equals|int-subtract]``` (surprisingly, defaults to ```default```). The ```type``` argument is used by the demo artifacts to build the ```require``` path for the subfolder where ```data``` and ```options``` files are kept.

### API 

To create an instance of ```Progress``` monad run:
```JavaScript
const { array: Progress } = require('monadic-progress')
const progress = Progress.of([value])
```
or 
```JavaScript
const Progress = require('monadic-progress/src/Progress')
const progress = Progress({ options }, 42)
```

Functor-like mapping:

```JavaScript
const { array: Progress } = require('monadic-progress')

const progress = Progress.of([42]).map(x => [...x, 5])
console.log(progress.join()) //prints [5] 
```

Flat mapping ( aka bind / chain ):

```JavaScript
const { array: Progress } = require('monadic-progress')

//implicit value lift
const progress = Progress.of([42]).fmap(x => [...x, 5])
console.log(progress.join()) //prints [5]

//explicit value lift
const progress = Progress.of([42]).fmap(x => Progress.of(x, [5]))
console.log(progress.join()) //prints [5]
```

Flatten (aka join / value):
```JavaScript
const { array: Progress } = require('monadic-progress')

const progress = Progress.of([42]).fmap(x => Progress.of(x, [5]))
const value = progress.join()
console.log(value) //prints [5]
```

Peek (aka log):
```JavaScript
const { array: Progress } = require('monadic-progress')

const progress = Progress.of([42]).fmap(x => Progress.of(x, [5]))
const entries = progress.peek()
console.log(entries) //prints [[42],[5]]
```

#### The ```None``` type

The default value returned by the ```join / flatten``` method if no difference is found across subsequent calls or one of the last two values evaluates to unsafe. Exposes static ```spec``` method for convenience.
