## **Monadic-progress**

A tiny library designed to simplify common progress tracking tasks (i.e. worker-based background processing, http polling) and assure value safety by 'swallowing' unsafe values and automating comparisons across subsequent chain calls. Makes heavy use of [Ramda](http://ramdajs.com/) and [Ramda-adjunct](https://github.com/char0n/ramda-adjunct), written in a (mostly) functional manner.

#### Installation:
TBD, once npm package is published.

#### Example usage:
Default configuration expects ```chain``` (aka bind) and ```map``` input to be wrapped in an array (non-array types are considered unsafe and ignored). This is because it runs Ramda's ['difference'](http://ramdajs.com/docs/#difference) against last two values, therefore the following code will evaluate to 'None':

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
... yet, this snippet will print '[5]':

```javascript
    const progress = Progress.of(["initial state"])
      .chain(prev => Progress.of(prev, ["some other state"]))
      .chain(() => undefined)
      .chain(() => Progress.of(["some other state"]))
      .chain(() => Progress.of(null)
      .chain(() => Progress.of(["different state"]))
      .chain(() => [5]))

    console.log(progress.flatten()) //prints [5]
```

This behaviour is amendable with ```opts``` argument of ```Progress``` factory function. The default factory preconfigures 
it with a set of functions defined in the 'options' file, the process of customising the configuration is as simple as defining a new set of functions and passing it to the aforementioned ```Progress``` factory function.

Expected functions are:

``` valueSafe -> boolean ```

Run against all the values known to ```Progress``` instance. Comparison (flatten / join) will return 'None' if any value evaluates to false. Defaults to 
['F'](http://ramdajs.com/docs/#F), or ['isArray'](https://char0n.github.io/ramda-adjunct/2.6.0/RA.html#.isArray/#isArray) if created using the default factory;

``` compare -> any ```

Run against last two values in **reversed** order, defaults to 'None', or ['difference'](http://ramdajs.com/docs/#difference) if created using the default factory; 

``` differs -> boolean ```
 
 Run against comparison result to determine whether it should be considered a match, 'None' is returned in other case. Defaults to false;

Check 'demo' for alternative configuration examples.

#### Build

Handled by ['Rollup'](https://rollupjs.org/guide/en) and ['Runjs'](https://github.com/pawelgalazka/runjs). Run 


Run ``` npx run build ``` or use the command defined under the ```build``` task in 'runfile.js';

By default, Rollup will build umd and Commonjs compatible bundles, adjustment can be achieved by changing the contents of 'formats' array inside the rollup.config.js file;

#### Test
 
Run ``` npx run test ``` or use the command defined under the 'test' task in the 'runfile.js';

#### Demo

Run ```npx run demo``` for an example of Progress run against a fake http server with default configuration. Accepts two arguments ```--method=[pull|push]``` (defaults to 'push') and ```--type=[default|int-equals|int-subtract]``` (surprisingly, defaults to ```default```). The ```type``` argument is used by the demo artifacts to build the ```require``` path for the subfolder where ```data``` and ```options``` files are kept;

### API

To create an instance of ```Progress``` monad run:
```JavaScript
import Progress from 'monadic-progress'

const progress = Progress.of([value])
```
or 
```JavaScript
import Progress from 'monadic-progress/src/Progress'

const progress = Progress({ options }, [value])
```

Functor-like mapping:

```JavaScript
import Progress from 'monadic-progress'

const progress = Progress.of([42]).map(x => [...x, 5])
console.log(progress.join()) //prints [5] 
```

Flat mapping ( aka bind / join ):

```JavaScript
import Progress from 'monadic-progress'

//implicit value lift
const progress = Progress.of([42]).fmap(x => [...x, 5])
console.log(progress.join()) //prints [5]

//explicit value lift
const progress = Progress.of([42]).fmap(x => Progress.of(x, [5]))
console.log(progress.join()) //prints [5]
```

Flatten (aka join / value):
```JavaScript
//explicit value lift
const progress = Progress.of([42]).fmap(x => Progress.of(x, [5]))
const value = progress.join()
console.log(value) //prints [5]
```

Peek (aka log):
```JavaScript
//explicit value lift
const progress = Progress.of([42]).fmap(x => Progress.of(x, [5]))
const entries = progress.peek()
console.log(entries) //prints [[42],[5]]
```

#### The ```None``` type

The default value returned by the ```chain / fmap``` method if no difference is found across subsequent calls or one of the last two values
is evaluated as unsafe.