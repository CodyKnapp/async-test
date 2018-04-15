const {prepare, AsyncWrapper} = require('../AsyncWrapper');
const expect = require('chai').expect;

describe('AsyncWrapper', () => {
    let testObject;

    describe('prepare', () => {
        it('should throw an error if the prepared method is not present', () => {
            testObject = {};

            try {
                prepare(testObject, 'testMethod');
            } catch (e) {
                expect(e.message).to.equal('testMethod does not exist on object');
            }
        });

        it('should return a AsyncWrapper instance with context and method set', () => {
            testObject = {
                testMethod: () => 'Success'
            };

            let result = prepare(testObject, 'testMethod');
            expect(result instanceof AsyncWrapper).to.be.true;
            expect(result.context).to.equal(testObject);
            expect(result.methodName).to.equal('testMethod');
        });
    });

    it('withArgs returns a AsyncWrapper with args set', () => {
        testObject = {
            testMethod: (arg1, arg2) => 'Success'
        };

        let result = prepare(testObject, 'testMethod')
            .withArgs('This', 'works');

        expect(result instanceof AsyncWrapper).to.be.true;
        expect(result.args).to.deep.equal(['This', 'works']);
    });

    it('allows the promise to resolve if withArgs is not called', () => {
        testObject = {
            testMethod: (callback) => {callback(null, 'Success')}
        };

        return prepare(testObject, 'testMethod')
            .assert();
    });

    it('allows the promise to resolve if no args or assertions are passed', () => {
        testObject = {
            testMethod: (callback) => {callback(null, 'Success')}
        };

        return prepare(testObject, 'testMethod')
            .withArgs()
            .assert();
    });

    it('assert properly receives the callback data and asserts', () => {
        testObject = {
            testMethod: (callback) => {
                callback(null, 'Success');
            }
        };

        return prepare(testObject, 'testMethod')
            .withArgs()
            .assert(result => {
                expect(result).to.equal('Success')
            });
    });

    it('assertError properly receives the error data and asserts', () => {
        testObject = {
            testMethod: (callback) => {
                callback('Fail');
            }
        };

        return prepare(testObject, 'testMethod')
            .withArgs()
            .assertError(error => {
                expect(error).to.equal('Fail')
            });
    });
});