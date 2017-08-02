function noop() {
  return null;
}

// you can add whatever you wanna handle
require.extensions['.less'] = noop;
require.extensions['.styl'] = noop;
require.extensions['.css'] = noop;
require.extensions['.png'] = noop;
