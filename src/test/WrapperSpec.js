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
            .assert();
    });

    it('assert properly receives the callback data and asserts', () => {
        testObject = {
            testMethod: (callback) => {
                callback(null, 'Success');
            }
        };

        return prepare(testObject, 'testMethod')
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
            .assertError(error => {
                expect(error).to.equal('Fail')
            });
    });

    it('assertError fails if the callback is ok (no error thrown)', () => {
        testObject = {
            testMethod: (callback) => {
                callback();
            }
        };

        return prepare(testObject, 'testMethod')
            .assertError()
            .catch(error => {
                expect(error.message).to.equal('No error was passed from callback when assertError was used');
            });
    });

    it('promise returns the promise when it resolves', () => {
        testObject = {
            testMethod: (callback) => {
                callback(null, 'Success');
            }
        };

        return prepare(testObject, 'testMethod')
            .promise()
            .then(data => {
                expect(data).to.equal('Success');
            });
    });

    it('promise returns the promise when it rejects', () => {
        testObject = {
            testMethod: (callback) => {
                callback('Danger!!');
            }
        };

        return prepare(testObject, 'testMethod')
            .promise()
            .catch(error => {
                expect(error).to.equal('Danger!!');
            });
    });
});