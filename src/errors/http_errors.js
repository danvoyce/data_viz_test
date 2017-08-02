import { ExtendableErrors } from './index';

export class HTTPError extends ExtendableErrors {
  constructor(status, errors, message) {
    super();
    this.message = message || 'HTTP Error';
    this.status = parseInt(status, 10) || 500;
    this.name = this.constructor.name;
    ExtendableErrors.captureStackTrace(this, this.constructor.name);

    if (ExtendableErrors.captureStackTrace) {
      ExtendableErrors.captureStackTrace(this, this.constructor.name);
    } else {
      this.stack = (new ExtendableErrors()).stack;
    }

    const errs = errors || {};
    this.errors = errs;
  }
}

export class BadRequestError extends HTTPError {
  constructor(errors, message = 'Bad Request') {
    super(400, errors, message);
  }
}

export class UnauthorizedError extends HTTPError {
  constructor(errors, message = 'Unauthorized') {
    super(401, errors, message);
  }
}

export class UnhandledHTTPCodeError extends HTTPError {
  constructor(errors, message = 'Unhandled HTTP Code') {
    super(-1, errors, message);
  }
}
