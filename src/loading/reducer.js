import { Map, fromJS } from 'immutable';

import {
  SET_LOADING_STATE,
  SET_LOADING_FAILED_STATE,
  SET_UPDATING_STATE,
  SET_UPDATING_FAILED_STATE,
} from './action_creators';

const getInitialState = function getInitialState() {
  const stateKeys = [
    'loading',
    'updating',
  ];
  const loadingInitialObject = fromJS({
    inProgress: false,
    hasFailed: false,
    errorCode: '',
    msg: '',
  });
  let initailState = new Map();
  stateKeys.forEach((key) => {
    initailState = initailState.set(key, loadingInitialObject);
  });
  return initailState;
};

const setLoadingState = function setLoadingState(key, state, value, reset) {
  const inProgress = reset ? false : value || false;
  const hasFailed = inProgress || reset ? false :
    state.getIn([key, 'hasFailed']);
  const errorCode = inProgress || reset ? '' : state.getIn([key, 'errorCode']);
  const msg = inProgress || reset ? '' : state.getIn([key, 'msg']);
  const failedRegion = reset ? '' : state.getIn([key, 'failedRegion']);

  return state.set(key,
    fromJS({ inProgress, hasFailed, errorCode, msg, failedRegion }));
};

const setFailedState = function setFailedState(key, state, action) {
  const inProgress = action.hasFailed ?
    false : state.getIn([key, 'inProgress']);
  return state.set(key, fromJS({
    inProgress,
    hasFailed: action.hasFailed,
    errorCode: action.hasFailed ? action.errorCode : '',
    msg: action.hasFailed ? action.msg : '',
    failedRegion: action.failedRegion,
  }));
};

export default function(state = getInitialState(), action) {
  const { inProgress, reset } = action;
  switch (action.type) {
    case SET_LOADING_STATE:
      return setLoadingState('loading', state, inProgress, reset);
    case SET_LOADING_FAILED_STATE:
      return setFailedState('loading', state, action);
    case SET_UPDATING_STATE:
      return setLoadingState('updating', state, inProgress);
    case SET_UPDATING_FAILED_STATE:
      return setFailedState('updating', state, action);
    default:
      return state;
  }
}
