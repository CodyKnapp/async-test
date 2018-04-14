
const injectedService = {};

class ThingToWrap {
    constructor(service) {
        this.someService = service;
    }

    handleEvent(event, context, callback) {
        return this.someService.doStuff()
            .then(result => {
                callback();
            }, callback);
    }
}

exports.ThingToWrap = ThingToWrap;
exports.handler = (event, context, callback) => {
    const handler = new ThingToWrap(injectedService);
    handler.handleEvent(event, context, callback);
};