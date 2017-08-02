import React from 'react';

import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

export const DevTools = __DEV__ ? createDevTools(
  <DockMonitor defaultIsVisible={false}
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q">
    <LogMonitor theme="tomorrow" />
  </DockMonitor>
) : null;
