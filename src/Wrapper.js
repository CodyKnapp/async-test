class Wrapper {
    constructor(methodRef) {
        this.methodRef = methodRef;
    }

    static wrap(methodRef, context) {
        return new Wrapper(methodRef.bind(context));
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