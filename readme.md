## **Monadic-progress**

A tiny library designed to simplify and assure value safety for common progress tracking tasks (i.e. worker-based background processing, http polling) by 'swallowing' unsafe values and automating comparisons across subsequent chain calls.  
Makes heavy use of [Ramda](http://ramdajs.com/) and [Ramda-adjunct](https://github.com/char0n/ramda-adjunct), written in a (mostly) functional manner.

#### Installation:
TBD, once npm package is published.

#### Example usage:
Default configuration expects chain / bind / map input to be wrapped in an array. This is because it runs Ramda's ['difference'](http://ramdajs.com/docs/#difference) against last two values, therefore the following code will evaluate to 'None':

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

    console.log(progress.flatten()) //prints ['5']
```

This behaviour is amendable with 'opts' argument of 'Progress' factory function. The default factory preconfigures 
it with a set of functions defined in the 'options' file, custom configuration is as simple as defining a new set and passing it to the aforementioned 'Progress' factory function.

Expected functions are:

``` valueSafe -> boolean ```

Run against all the values participating in comparison. Comparison (flatten / join) will return 'None' if any value evaluates to false. Defaults to 
['F'](http://ramdajs.com/docs/#F), or ['isArray'](https://char0n.github.io/ramda-adjunct/2.6.0/RA.html#.isArray/#isArray) if created using the default factory;

``` compare -> any ```

Run against last two values (arguments order is **reversed**), defaults to 'None', or ['difference'](http://ramdajs.com/docs/#difference) if created using the default factory; 

``` differs -> boolean ```
 
 Run against comparison result to determine whether it should be considered a match, 'None' is returned in other case. Defaults to false;

Check 'demo' for alternative configuration examples.

#### Build

Handled by ['Rollup'](https://rollupjs.org/guide/en) and ['Runjs'](https://github.com/pawelgalazka/runjs). Run 


Run ``` npx run build ``` or use the command defined under the 'build' task in 'runfile.js'  

By default, Rollup will build umd and common.js compatible bundles, customizing it is as simple as changing the contents of 'formats' array inside the rollup.config.js file.

#### Test
 
Run ``` npx run test ``` or use the command defined under the 'test' task in 'runfile.js'  


+ Demo
+ Gotchas 
  * None type
  * Nil ignorance
  * Last two
  * Peek / log
  * Function aliases