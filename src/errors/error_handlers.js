import {
  BadRequestError,
  UnauthorizedError,
} from './http_errors';

import { RequestTimeoutError } from './timeout';
import { NetworkError } from './network';

export function timeoutErrorHandler(dispatch, actionCreator, error) {
  if (error instanceof RequestTimeoutError) {
    const action = actionCreator(true, error.status, error.message);
    dispatch(action);
    return true;
  }
  return false;
}

export function badRequestErrorHandler(dispatch, actionCreator, error) {
  if (error instanceof BadRequestError) {
    const action = actionCreator(true, error.status, error.errors.message);
    dispatch(action);
    return true;
  }
  return false;
}

export function unauthorizedErrorHandler(dispatch, actionCreator, error) {
  if (error instanceof UnauthorizedError) {
    const action = actionCreator(true, error.status, error.message);
    dispatch(action);
    return true;
  }
  return false;
}

export function networkErrorHandler(dispatch, actionCreator, error) {
  if (error instanceof NetworkError) {
    const action = actionCreator(true, error.status, error.message);
    dispatch(action);
    return true;
  }
  return false;
}

export function otherErrorsHandler(dispatch, actionCreator, error) {
  const action = actionCreator(true, error.status, 'Something went wrong...');
  dispatch(action);
  return true;
}


/*
 * Main function executing different error handlers
 */
export function errorHandler(...args) {
  return function execute(dispatch, action, err) {
    args.some((func) => func.apply(this, [dispatch, action, err]));

    // return rejected promise so the promise do not recover and not execute
    // resolve function on top level (usually on compoennt level)
    return Promise.reject(err);
  };
}
