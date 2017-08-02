import { expect } from 'chai';

import * as httpErrors from './http_errors';

describe('Http Errors', () => {
  const errors = {
    foo: { bar: 'aaa' },
    fizz: { message: 'buzz' },
    blah: { name: 'bleh' },
  };

  describe('HTTPError', () => {
    let err;
    let expected;

    beforeEach(() => {
      err = new httpErrors.HTTPError('400', errors, 'Bad Request');

      expected = {
        errors,
        message: 'Bad Request',
        name: 'HTTPError',
        status: 400,
      };
    });

    it('assigns all the properties passed', () => {
      expect(err.errors).to.eql(errors);
      expect(err.name).to.equal('HTTPError');
      expect(err.message).to.equal('Bad Request');
      expect(err.status).to.equal(400);
    });

    it('has a nice toJson method', () => {
      const str = JSON.stringify(err);
      const obj = JSON.parse(str);

      expect(obj).to.eql(expected);
    });
  });

  describe('BadRequestError', () => {
    let err;
    let expected;

    beforeEach(() => {
      err = new httpErrors.BadRequestError(errors);

      expected = {
        errors,
        message: 'Bad Request',
        name: 'BadRequestError',
        status: 400,
      };
    });

    it('should assign all the properties passed', () => {
      expect(err.errors).to.eql(errors);
      expect(err.name).to.equal('BadRequestError');
      expect(err.message).to.equal('Bad Request');
      expect(err.status).to.equal(400);
    });

    it('should have a nice toJSON method', () => {
      const str = JSON.stringify(err);
      const obj = JSON.parse(str);

      expect(obj).to.eql(expected);
    });
  });
});
