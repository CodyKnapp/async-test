const ThingToWrap = require('../ThingToWrap').ThingToWrap;
const expect = require('chai').expect;
const sinon = require('sinon');

describe('Wrapper', () => {
    let aService = {
        doStuff: sinon.stub()
    };

    it('passes for a successful call', (done) => {
        aService.doStuff.resolves('A thing happened');

        let something = new ThingToWrap(aService);

        const callback = (error) => {
            expect(error).to.be.null;
            expect(aService.doStuff).to.have.been.called;
        };

        something.handleEvent('A thing', 'halp', done);
    });
});