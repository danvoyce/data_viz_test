/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import nock from 'nock';
import sinon from 'sinon';

import { daoFetch, formatUrl, TIMEOUT_TIME } from './dao_helpers';
import { UnhandledHTTPCodeError } from '../errors/http_errors';
import { NetworkError } from '../errors/network';
import { RequestTimeoutError } from '../errors/timeout';
import config from '../core/config';

describe('Dao Helpers', () => {
  describe('formatUrl', () => {
    let clock;

    beforeEach(() => {
      const date = new Date();
      clock = sinon.useFakeTimers(date.getTime());
    });

    it('formats the url', () => {
      const endpoint = '/foo';
      const ts = (new Date()).getTime();
      let expected = `${config.apiBaseUrl}/foo?_ts=${ts}`;
      expect(formatUrl(endpoint)).to.equal(expected);

      const id = '1234';
      expected = `${config.apiBaseUrl}/foo/1234?_ts=${ts}`;
      expect(formatUrl(endpoint, id)).to.equal(expected);

      const params = { fizz: 'buzz', 'blah bleh': 'meh' };
      expected =
        `${config.apiBaseUrl}/foo/1234?fizz=buzz&blah bleh=meh&_ts=${ts}`;
      expect(formatUrl(endpoint, id, params)).to.equal(expected);

      expected =
        `${config.apiBaseUrl}/foo?fizz=buzz&blah bleh=meh&_ts=${ts}`;
      expect(formatUrl(endpoint, null, params)).to.equal(expected);
    });

    afterEach(() => {
      clock.restore();
    });
  });

  describe('daoFetch', () => {
    describe('before fetch is called', () => {
      let fetchStub;

      beforeEach(() => {
        fetchStub = sinon.stub(global, 'fetch');
        fetchStub.returns(Promise.reject(new Error()));
      });

      it('sets the correct headers and stringify the body', () => {
        const url = formatUrl('/foo');
        const method = 'POST';
        const opts = { body: { foo: 'bar', fizz: 'buzz' }, method };
        const expected = [url, {
          method,
          body: '{"foo":"bar","fizz":"buzz"}',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
          },
        }];
        return expect(daoFetch(url, opts)).to.be.rejected
          .then(() => {
            expect(fetchStub.calledOnce).to.be.true;
            expect(fetchStub.args[0]).to.eql(expected);
          });
      });

      afterEach(() => {
        fetchStub.restore();
      });
    });

    describe('fetch results', () => {
      let clock;

      beforeEach(() => {
        const date = new Date();
        clock = sinon.useFakeTimers(date.getTime());
      });

      it('parses the json string', () => {
        const urlToMock = formatUrl('/foo');
        nock(config.apiBaseUrl)
          .get('/foo')
          .query({ _ts: new Date().getTime() })
          .reply(200, { foo: 'bar', fizz: 'buzz' });

        return daoFetch(urlToMock).then((obj) => {
          expect(obj).to.eql({ foo: 'bar', fizz: 'buzz' });
        });
      });

      it('throws UnhandledHTTPCodeError when not 200', () => {
        const urlToMock = formatUrl('/foo');
        nock(config.apiBaseUrl)
          .get('/foo')
          .query({ _ts: new Date().getTime() })
          .reply(500);

        return expect(daoFetch(urlToMock))
          .to.be.rejectedWith(UnhandledHTTPCodeError);
      });

      it('throws NetworkError when fetch fails', () => {
        const fetchStub = sinon.stub(global, 'fetch');
        fetchStub.returns(Promise.reject());

        return expect(daoFetch('/foo')).to.be.rejectedWith(NetworkError)
          .then(() => {
            fetchStub.restore();
          }, (err) => {
            fetchStub.restore();
            throw err;
          });
      });

      it('throws RequestTimeoutError when it takes to much time', () => {
        const fetchStub = sinon.stub(global, 'fetch');
        fetchStub.returns(new Promise(() => {}));

        const fetchPromise = daoFetch('/foo');
        clock.tick(TIMEOUT_TIME + 100);

        return expect(fetchPromise).to.be.rejectedWith(RequestTimeoutError)
          .then(() => {
            fetchStub.restore();
          }, (err) => {
            fetchStub.restore();
            throw err;
          });
      });

      afterEach(() => {
        clock.restore();
      });
    });
  });
});
