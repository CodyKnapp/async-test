class AsyncWrapper {
    constructor(context, methodName) {
        this.context = context;
        if (context[methodName] !== undefined) {
            this.methodName = methodName;
        } else {
            throw new Error(`${methodName} does not exist on object`);
        }
    }

    run(...args) {
        this.args = args;
        return this;
    }

    assert(assertion) {
        return this.executeMethod().then(assertion);
    }

    assertError(assertion) {
        return this.executeMethod().catch(assertion);
    }

    executeMethod() {
        return new Promise((resolve, reject) => {
            this.context[this.methodName](...this.args, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });
    }
}

exports.AsyncWrapper = AsyncWrapper;
exports.prepare = (context, methodName) => new AsyncWrapper(context, methodName);