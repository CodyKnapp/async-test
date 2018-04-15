
const injectedService = {};

class ExampleThingToWrap {
    constructor(service) {
        this.someService = service;
    }

    handleEvent(event, context, callback) {
        this.someService.doStuff()
            .then(result => {
                callback();
            }, callback);
    }
}

exports.ExampleThingToWrap = ExampleThingToWrap;
exports.handler = (event, context, callback) => {
    const handler = new ExampleThingToWrap(injectedService);
    handler.handleEvent(event, context, callback);
};