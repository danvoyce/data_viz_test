import { ExtendableErrors } from './index';

export class NetworkError extends ExtendableErrors {
  constructor(errors, message = 'Network Error') {
    super();
    this.message = message;
    this.name = this.constructor.name;

    if (ExtendableErrors.captureStackTrace) {
      ExtendableErrors.captureStackTrace(this, this.constructor.name);
    } else {
      this.stack = (new ExtendableErrors()).stack;
    }

    const errs = errors || {};
    this.errors = errs;
  }
}
