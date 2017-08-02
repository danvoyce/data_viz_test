import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';

import mainReducer from './reducer';
import { DevTools } from './../utils/dev_tools.jsx';

export default function makeStore() {
  let finalCreateStore;

  if (__DEV__) {
    finalCreateStore = compose(
      applyMiddleware(thunk),
      DevTools.instrument()
    )(createStore);
  } else {
    finalCreateStore = compose(
      applyMiddleware(thunk)
    )(createStore);
  }

  const store = finalCreateStore(mainReducer);
  return store;
}
