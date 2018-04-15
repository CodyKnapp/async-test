const {ExampleThingToWrap} = require('../ExampleThingToWrap');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

describe('ThingToWrap', () => {
    let aService = {
        doStuff: sinon.stub()
    };

    let subject;
    beforeEach(() => {
        subject = new ExampleThingToWrap(aService);
    });

    it('passes for a successful call', (done) => {
        let aService = {
            doStuff: sinon.stub()
        };
        aService.doStuff.resolves('A thing happened');

        let subject = new ExampleThingToWrap(aService);

        const callback = (error) => {
            expect(error).to.be.undefined;
            expect(aService.doStuff).to.have.been.called;
            done();
        };

        subject.handleEvent('A thing', 'halp', callback);
    });

    it('passes for a failed call', (done) => {
        aService.doStuff.rejects('A bad thing happened');

        const callback = (error) => {
            expect(error.name).to.equal('A bad thing happened');
            expect(aService.doStuff).to.have.been.called;
            done();
        };

        subject.handleEvent('A thing', 'halp', callback);
    })
});