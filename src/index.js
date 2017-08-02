/**
 * To avoid issue with react-hot loader, do not iclude the babel-polyfill in
 * this file. Read more about the babel-polyfill in the `docs` folder.
 */

// TODO: Exclude the following block from the build. Use the
// [feature flags](https://github.com/petehunt/webpack-howto#6-feature-flags)
import 'isomorphic-fetch';
import Immutable from 'immutable';

const installDevTools = require('immutable-devtools');
installDevTools(Immutable);

import init from './core/init';

init();
