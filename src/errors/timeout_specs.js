import { expect } from 'chai';

import { RequestTimeoutError } from './timeout';

describe('Request Timeout Error', () => {
  const errors = {
    foo: {
      bar: 'aaa',
    },
    fizz: {
      message: 'buzz',
    },
    blah: {
      name: 'bleh',
    },
  };

  describe('RequestTimeoutError', () => {
    let err;
    let expected;

    beforeEach(() => {
      err = new RequestTimeoutError(errors);

      expected = {
        errors,
        message: 'Request Client Timeout Error',
        name: 'RequestTimeoutError',
        status: 'client_timeout',
      };
    });

    it('should assign all the properties passed', () => {
      expect(err.errors).to.eql(errors);
      expect(err.name).to.equal('RequestTimeoutError');
      expect(err.message).to.equal('Request Client Timeout Error');
      expect(err.status).to.equal('client_timeout');
    });

    it('should have a nice toJSON method', () => {
      const str = JSON.stringify(err);
      const obj = JSON.parse(str);

      expect(obj).to.eql(expected);
    });
  });
});
