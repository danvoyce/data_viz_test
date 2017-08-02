import config from '../core/config';
import { getQueryString } from '../utils/query_parameters';

import { RequestTimeoutError } from '../errors/timeout';
import { NetworkError } from '../errors/network';
import { UnhandledHTTPCodeError } from '../errors/http_errors';

export const TIMEOUT_TIME = 15000;
const FETCH_DEFAULT_OPTS = {
  headers: {
    'Content-type': 'application/json',
    Accept: 'application/json',
  },
};

export function formatUrl(endpoint, id, params = {}) {
  let url = `${config.apiBaseUrl}${endpoint}`;
  if (id) {
    url += `/${id}`;
  }

  // add _ts=new Date(); in params object as default
  // call the query parameters stringify method on params
  params._ts = (new Date()).getTime(); // eslint-disable-line
  url += getQueryString(params);

  return url;
}

export function daoFetch(url, opts) {
  const options = Object.assign({}, FETCH_DEFAULT_OPTS, opts);
  options.headers = options.headers || {};

  if (options.body) {
    options.body = JSON.stringify(options.body);
  }
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      return reject(new RequestTimeoutError());
    }, TIMEOUT_TIME);
  });

  const fetchPromise = fetch(url, options).then((res) => {
    // parse the json body
    return res.json()
      .then((obj) => obj, () => null) // err
      .then((obj) => {
        const isUnhandledStatus = res.status !== 200;
        if (isUnhandledStatus) {
          throw new UnhandledHTTPCodeError(obj);
        }
        return obj;
      });
  }, (err) => {
    throw new NetworkError(err);
  });
  return Promise.race([fetchPromise, timeoutPromise]);
}
