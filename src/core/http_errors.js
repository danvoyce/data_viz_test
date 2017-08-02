import { ExtendableBuiltinGen } from '../utils/classes';

const ExtendableErrors = ExtendableBuiltinGen(Error);

export class HTTPError extends ExtendableErrors {
  constructor(status, errors, message) {
    super();
    this.message = message || 'HTTP Error';
    this.status = parseInt(status, 10) || 500;
    this.name = this.constructor.name;
    ExtendableErrors.captureStackTrace(this, this.constructor.name);

    const errs = errors || {};
    this.errors = errs;
  }
}

export class BadRequestError extends HTTPError {
  constructor(errors, message = 'Bad Request') {
    super(400, errors, message);
  }
}
