
const injectedService = {};

class ThingToWrap {
    constructor(service) {
        this.someService = service;
    }

    handleEvent(event, context, callback) {
        this.someService.doStuff()
            .then(result => {
                callback(null);
            }, callback);
    }
}

exports.ThingToWrap = ThingToWrap;
exports.handler = (event, context, callback) => {
    const handler = new ThingToWrap(injectedService);
    handler.handleEvent(event, context, callback);
};