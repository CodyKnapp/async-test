class Wrapper {
    constructor(methodRef) {
        this.methodRef = methodRef;
    }

    run(...args) {
        return new Promise((resolve, reject) => {
            this.methodRef(...args, (err, data) => {
                err ? reject(err) : resolve(data);
            })
        });
    }
}

exports.Wrapper = Wrapper;
exports.wrap = (methodRef, context) => new Wrapper(methodRef.bind(context));