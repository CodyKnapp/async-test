# ndc-util
[![Build Status](https://travis-ci.org/CodyKnapp/async-test.svg?branch=master)](https://travis-ci.org/CodyKnapp/async-test)
Node don't callback (ndc-util) is a lightweight wrapper to wrap callback-style async functions.  
Using promises with mocha makes testing cleaner than using a callback with the `done` callback parameter.

## Installation
`npm install --save ndc-util`

## Usage
The main function that must be imported from the ndc-util is the prepare function.  This utilizes a builder pattern so other calls may be chained on at will.  The end result is code that returns a promise rather than needing to utilize the callback parameter.
`const {prepare} = require('ndc-util');` will import the prepare function.

When `prepare` is called, it expects to receive an instance of an object that contains the function to be wrapped, as well as the function name.
`prepare(lambda, 'handleEvent')` will return an `AsyncWrapper` instance that has the lambda object and the handleEvent function ready to execute.
If arguments need to be passed to the function, then the `withArgs(...args)` function should be called.
`prepare(lambda, 'handleEvent').withArgs(event, context).promise()` will execute the lambda object's handleEvent method and return a promise that rejected or resolved depending on the error state of the callback.

ndc-util assumes a callback structure of `callback(error, data)` and resolves if error is null or undefined and returns data.  If error is not null or undefined, the callback rejects and returns error.

#### Basic conversion of callback to promise
ndc-util has a `promise()` method that can be used to execute the prepared method and return a promise. Using the same `lambda` example as above, one would use `prepare(lambda, 'handleEvent').withArgs(event, context).promise()`
That could then be the start of a chain or used like any other promise.

#### Basic testing
ndc-util can be used to assist with testing because of its `assert` and `assertError` functions.  These functions combined with mocha's evaluation of a promise by simply returning it make test cases expressive and easy to write.
This illustrates a very basic test case using ndc-util to ensure that a service was called and the result was ok.

```javascript
it('does a thing', () => {
    let aService = {
        doStuff: sinon.stub()
    };
    aService.doStuff.resolves('A thing happened');
    
    let subject = new ExampleThingToWrap(aService);
    
    return prepare(subject, 'handleEvent')
        .withArgs('A thing', 'halp')
        .assert(result => {
            expect(aService.doStuff).to.have.been.called;
        });
});
``` 
Note the use of the `.assert()` function.  It accepts a function as an argument that receives the data returned from a successful callback as its argument.  This allows for easy assertion based on that value if necessary.
`.assertError()` also exists and works in the same fashion.  It is only for rejected promises, however, and will fail if the callback does NOT return an error.

#### Examples
There is an example folder in the source that contains samples of how to use the wrapper.