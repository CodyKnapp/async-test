const {ExampleThingToWrap} = require('../ExampleThingToWrap');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const {prepare} = require("../../AsyncWrapper");
chai.use(sinonChai);
const expect = chai.expect;

describe('Wrapped ThingToWrap', () => {
    let aService = {
        doStuff: sinon.stub()
    };

    let subject;

    beforeEach(() => {
        subject = new ExampleThingToWrap(aService);
    });

    it('passes for a successful call', () => {
        aService.doStuff.resolves('A thing happened');

        return prepare(subject, 'handleEvent')
            .withArgs('A thing', 'halp')
            .assert(result => {
                expect(result).to.be.undefined;
                expect(aService.doStuff).to.have.been.called;
            });
    });

    it('reports a good error on failure', () => {
        aService.doStuff.rejects('A bad thing happened');

        return prepare(subject, 'handleEvent')
            .withArgs('a thing', 'onoez')
            .assertError(error => {
                expect(error.name).to.equal('A bad thing happened');
            });
    });
});