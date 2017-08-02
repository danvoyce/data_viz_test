import { expect } from 'chai';

import { NetworkError } from './network';

describe('Network errors', () => {
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

  describe('NetworkError', () => {
    let err;
    let expected;

    beforeEach(() => {
      err = new NetworkError(errors);

      expected = {
        errors,
        message: 'Network Error',
        name: 'NetworkError',
      };
    });

    it('should assign all the properties passed', () => {
      expect(err.errors).to.eql(errors);
      expect(err.name).to.equal('NetworkError');
      expect(err.message).to.equal('Network Error');
    });

    it('should have a nice toJSON method', () => {
      const str = JSON.stringify(err);
      const obj = JSON.parse(str);

      expect(obj).to.eql(expected);
    });
  });
});
