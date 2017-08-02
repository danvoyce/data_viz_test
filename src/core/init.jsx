import React from 'react';
import { Router, Route, IndexRoute, hashHistory }
  from 'react-router';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';

import makeStore from './store';
import { DevTools } from './../utils/dev_tools.jsx';

import { App } from './app';
import HomeScreen from '../screens/home/home.jsx';

function start(store) {
  // TODO: Exclude the following block from the build. Use the
  // [feature flags](https://github.com/petehunt/webpack-howto#6-feature-flags)

  const router = (
    <Router history={hashHistory}>
      <Route path="/" component={ App }>
        <IndexRoute component={HomeScreen} />
      </Route>
    </Router>
  );

  const devTools = __DEV__ ? <DevTools /> : null;

  const app = (
    <Provider store={store}>
      <div>
        { router }
        { devTools }
      </div>
    </Provider>
  );

  ReactDOM.render(app, document.getElementById('app'));
}

export default () => {
  const store = makeStore(hashHistory);
  start(store);
};
