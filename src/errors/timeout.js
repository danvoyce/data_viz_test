import { ExtendableErrors } from './index';

export class RequestTimeoutError extends ExtendableErrors {
  constructor(errors, message = 'Request Client Timeout Error') {
    super();
    this.message = message;
    this.name = this.constructor.name;

    if (ExtendableErrors.captureStackTrace) {
      ExtendableErrors.captureStackTrace(this, this.constructor.name);
    } else {
      this.stack = (new ExtendableErrors()).stack;
    }

    this.status = 'client_timeout';
    const errs = errors || {};
    this.errors = errs;
  }
}
