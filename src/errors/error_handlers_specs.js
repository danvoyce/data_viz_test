import { expect } from 'chai';
import sinon from 'sinon';

import {
  timeoutErrorHandler,
  badRequestErrorHandler,
  unauthorizedErrorHandler,
  networkErrorHandler,
  otherErrorsHandler,
  errorHandler,
} from './error_handlers';

import {
  BadRequestError,
  UnauthorizedError,
} from './http_errors';
import { RequestTimeoutError } from './timeout';
import { NetworkError } from './network';


describe('Error Handlers', () => {
  const dispatch = sinon.spy();
  const actionCreator = sinon.spy();

  afterEach(() => {
    dispatch.reset();
    actionCreator.reset();
  });

  describe('timeoutErrorHandler', () => {
    it('dipatches action and returns true when RequestTimeoutError', () => {
      const error = new RequestTimeoutError();
      const result = timeoutErrorHandler(dispatch, actionCreator, error);
      expect(dispatch.calledOnce).to.equal(true);
      expect(actionCreator.calledOnce).to.equal(true);
      expect(dispatch.calledWith(actionCreator())).to.equal(true);
      expect(result).to.equal(true);
    });

    it(`does not dipatches action and returns false when not
    RequestTimeoutError`, () => {
      const error = new Error();
      const result = timeoutErrorHandler(dispatch, actionCreator, error);

      expect(dispatch.called).to.equal(false);
      expect(actionCreator.called).to.equal(false);
      expect(result).to.equal(false);
    });
  });

  describe('networkErrorHandler', () => {
    it('dipatches action and returns true when NetworkError', () => {
      const error = new NetworkError();
      const result = networkErrorHandler(dispatch, actionCreator, error);
      expect(dispatch.calledOnce).to.equal(true);
      expect(actionCreator.calledOnce).to.equal(true);
      expect(dispatch.calledWith(actionCreator())).to.equal(true);
      expect(result).to.equal(true);
    });

    it(`does not dipatches action and returns false when not
    NetworkError`, () => {
      const error = new Error();
      const result = networkErrorHandler(dispatch, actionCreator, error);

      expect(dispatch.called).to.equal(false);
      expect(actionCreator.called).to.equal(false);
      expect(result).to.equal(false);
    });
  });

  describe('badRequestErrorHandler', () => {
    it('dipatches action and returns true when BadRequestError', () => {
      const error = new BadRequestError();
      const result = badRequestErrorHandler(dispatch, actionCreator, error);

      expect(dispatch.calledOnce).to.equal(true);
      expect(actionCreator.calledOnce).to.equal(true);
      expect(dispatch.calledWith(actionCreator())).to.equal(true);
      expect(result).to.equal(true);
    });

    it(`does not dipatches action and returns false when not
    RequestTimeoutError`, () => {
      const error = new UnauthorizedError();
      const result = badRequestErrorHandler(dispatch, actionCreator, error);

      expect(dispatch.called).to.equal(false);
      expect(actionCreator.called).to.equal(false);
      expect(result).to.equal(false);
    });
  });

  describe('unauthorizedErrorHandler', () => {
    it('dipatches action and returns true when BadRequestError', () => {
      const error = new UnauthorizedError();
      const result = unauthorizedErrorHandler(dispatch, actionCreator, error);

      expect(dispatch.calledOnce).to.equal(true);
      expect(actionCreator.calledOnce).to.equal(true);
      expect(dispatch.calledWith(actionCreator())).to.equal(true);
      expect(result).to.equal(true);
    });

    it(`does not dipatches action and returns false when not
    RequestTimeoutError`, () => {
      const error = new BadRequestError();
      const result = unauthorizedErrorHandler(dispatch, actionCreator, error);

      expect(dispatch.called).to.equal(false);
      expect(actionCreator.called).to.equal(false);
      expect(result).to.equal(false);
    });
  });

  describe('otherErrorsHandler', () => {
    it('dipatches action and returns true when called with Error', () => {
      const error = new Error();
      const result = otherErrorsHandler(dispatch, actionCreator, error);
      expect(dispatch.calledOnce).to.equal(true);
      expect(actionCreator.calledOnce).to.equal(true);
      expect(dispatch.calledWith(actionCreator())).to.equal(true);
      expect(result).to.eql(true);
    });
  });

  describe('errorHandler', () => {
    const timeoutErrorHandlerSpy = sinon.spy(timeoutErrorHandler);
    const badRequestErrorHandlerSpy = sinon.spy(badRequestErrorHandler);
    const unauthorizedErrorHandlerSpy = sinon.spy(unauthorizedErrorHandler);
    const otherErrorsHandlerSpy = sinon.spy(otherErrorsHandler);

    afterEach(() => {
      timeoutErrorHandlerSpy.reset();
      badRequestErrorHandlerSpy.reset();
      unauthorizedErrorHandlerSpy.reset();
      otherErrorsHandlerSpy.reset();
    });

    it('dipatches action and calls timeoutErrorHandler', () => {
      const error = new RequestTimeoutError();
      const result = errorHandler(timeoutErrorHandlerSpy,
        badRequestErrorHandlerSpy,
        unauthorizedErrorHandlerSpy,
        otherErrorsHandlerSpy)(dispatch, actionCreator, error);

      expect(timeoutErrorHandlerSpy.calledOnce).to.equal(true);
      expect(timeoutErrorHandlerSpy.returned(true)).to.equal(true);
      expect(badRequestErrorHandlerSpy.called).to.equal(false);
      expect(unauthorizedErrorHandlerSpy.called).to.equal(false);
      expect(otherErrorsHandlerSpy.called).to.equal(false);
      expect(dispatch.calledOnce).to.equal(true);
      expect(actionCreator.calledOnce).to.equal(true);
      expect(dispatch.calledWith(actionCreator())).to.equal(true);
      expect(result).to.eql({});
    });

    it('dipatches action and calls badRequestErrorHandler', () => {
      const error = new BadRequestError();
      const result = errorHandler(timeoutErrorHandlerSpy,
        badRequestErrorHandlerSpy,
        unauthorizedErrorHandlerSpy,
        otherErrorsHandlerSpy)(dispatch, actionCreator, error);

      expect(timeoutErrorHandlerSpy.calledOnce).to.equal(true);
      expect(timeoutErrorHandlerSpy.returned(false)).to.equal(true);
      expect(badRequestErrorHandlerSpy.calledOnce).to.equal(true);
      expect(badRequestErrorHandlerSpy.returned(true)).to.equal(true);
      expect(unauthorizedErrorHandlerSpy.called).to.equal(false);
      expect(otherErrorsHandlerSpy.called).to.equal(false);
      expect(dispatch.calledOnce).to.equal(true);
      expect(actionCreator.calledOnce).to.equal(true);
      expect(dispatch.calledWith(actionCreator())).to.equal(true);
      expect(result).to.eql({});
    });

    it('dipatches action and calls unauthorizedErrorHandler', () => {
      const error = new UnauthorizedError();
      const result = errorHandler(timeoutErrorHandlerSpy,
        badRequestErrorHandlerSpy,
        unauthorizedErrorHandlerSpy,
        otherErrorsHandlerSpy)(dispatch, actionCreator, error);

      expect(timeoutErrorHandlerSpy.calledOnce).to.equal(true);
      expect(timeoutErrorHandlerSpy.returned(false)).to.equal(true);
      expect(badRequestErrorHandlerSpy.calledOnce).to.equal(true);
      expect(badRequestErrorHandlerSpy.returned(false)).to.equal(true);
      expect(unauthorizedErrorHandlerSpy.calledOnce).to.equal(true);
      expect(unauthorizedErrorHandlerSpy.returned(true)).to.equal(true);
      expect(otherErrorsHandlerSpy.called).to.equal(false);
      expect(dispatch.calledOnce).to.equal(true);
      expect(actionCreator.calledOnce).to.equal(true);
      expect(dispatch.calledWith(actionCreator())).to.equal(true);
      expect(result).to.eql({});
    });

    it('dipatches action and calls otherErrorsHandler', () => {
      const error = new Error();
      const result = errorHandler(timeoutErrorHandlerSpy,
        badRequestErrorHandlerSpy,
        unauthorizedErrorHandlerSpy,
        otherErrorsHandlerSpy)(dispatch, actionCreator, error);

      expect(timeoutErrorHandlerSpy.calledOnce).to.equal(true);
      expect(timeoutErrorHandlerSpy.returned(false)).to.equal(true);
      expect(badRequestErrorHandlerSpy.calledOnce).to.equal(true);
      expect(badRequestErrorHandlerSpy.returned(false)).to.equal(true);
      expect(unauthorizedErrorHandlerSpy.calledOnce).to.equal(true);
      expect(unauthorizedErrorHandlerSpy.returned(false)).to.equal(true);
      expect(otherErrorsHandlerSpy.calledOnce).to.equal(true);
      expect(otherErrorsHandlerSpy.returned(true)).to.equal(true);
      expect(dispatch.calledOnce).to.equal(true);
      expect(actionCreator.calledOnce).to.equal(true);
      expect(dispatch.calledWith(actionCreator())).to.equal(true);
      expect(result).to.eql({});
    });
  });
});
