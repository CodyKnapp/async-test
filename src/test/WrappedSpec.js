const ThingToWrap = require('../ThingToWrap').ThingToWrap;
const Wrapper = require('../Wrapper').Wrapper;
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

describe('Wrapped ThingToWrap', () => {
    let aService = {
        doStuff: sinon.stub()
    };

    let subject;

    beforeEach(() => {
        subject = new ThingToWrap(aService);
    });

    it('passes for a successful call', () => {
        aService.doStuff.resolves('A thing happened');

        return Wrapper.wrap(subject.handleEvent, subject)
            .run('A thing', 'halp')
            .then(result => {
                expect(result).to.be.undefined;
                expect(aService.doStuff).to.have.been.called;
            });
    });

    it('reports a good error on failure', () => {
        aService.doStuff.rejects('A bad thing happened');

        return Wrapper.wrap(subject.handleEvent, subject)
            .run('a thing', 'onoez')
            .catch(error => expect(error.name).to.equal('A bad thing happened'));
    })
});