/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import createHistory from 'history/lib/createHashHistory';
import { fromJS } from 'immutable';

import makeStore from '../core/store';

import {
  SET_LOADING_STATE,
  SET_LOADING_FAILED_STATE,
  SET_UPDATING_STATE,
  SET_UPDATING_FAILED_STATE,
} from './action_creators';

describe('Loading reducer', () => {
  const store = makeStore(createHistory());
  const failedState = fromJS({
    inProgress: false,
    hasFailed: true,
    errorCode: 'errCode',
    failedRegion: undefined,
    msg: 'msg',
  });
  const notInProgressState = fromJS({
    inProgress: false,
    hasFailed: false,
    errorCode: '',
    failedRegion: undefined,
    msg: '',
  });

  const failedStates = [
    {
      actionType: SET_LOADING_FAILED_STATE,
      keyToCheck: 'loading',
    },
    {
      actionType: SET_UPDATING_FAILED_STATE,
      keyToCheck: 'updating',
    },
  ];

  const inProgressState = fromJS({
    inProgress: true,
    hasFailed: false,
    failedRegion: undefined,
    errorCode: '',
    msg: '',
  });

  const loadingStates = [
    {
      actionType: SET_LOADING_STATE,
      keyToCheck: 'loading',
    },
    {
      actionType: SET_UPDATING_STATE,
      keyToCheck: 'updating',
    },
  ];

  // These tests are the same for all actions, just performed
  // on different objects keys, to prevent duplications they are running in loop
  // if you want to add test for different action just add them to both arrays
  // with coresponding key as above
  failedStates.forEach((loadingState) => {
    const description = `handles ${loadingState.actionType}`;
    it(description, () => {
      // failedState
      let action = {
        type: loadingState.actionType,
        hasFailed: true,
        errorCode: 'errCode',
        msg: 'msg',
      };

      store.dispatch(action);
      let newState = store.getState();
      expect(newState.appStates.get(loadingState.keyToCheck))
        .to.eql(failedState);

      // notInProgressState
      action = {
        type: loadingState.actionType,
        hasFailed: false,
        errorCode: 'errCode',
        msg: 'msg',
      };

      store.dispatch(action);
      newState = store.getState();
      expect(newState.appStates.get(loadingState.keyToCheck))
        .to.eql(notInProgressState);
    });
  });

  loadingStates.forEach((loadingState) => {
    const description = `handles ${loadingState.actionType}`;
    it(description, () => {
      // inProgressState
      let action = { type: loadingState.actionType, inProgress: true };
      store.dispatch(action);
      let newState = store.getState();
      expect(newState.appStates.get(loadingState.keyToCheck))
        .to.eql(inProgressState);

      // notInProgressState
      action = { type: loadingState.actionType, inProgress: false };
      store.dispatch(action);
      newState = store.getState();
      expect(newState.appStates.get(loadingState.keyToCheck))
        .to.eql(notInProgressState);
    });
  });
});
