
export const SET_LOADING_STATE = 'SET_LOADING_STATE';
export const SET_LOADING_FAILED_STATE = 'SET_LOADING_FAILED_STATE';
export const SET_UPDATING_STATE = 'SET_UPDATING_STATE';
export const SET_UPDATING_FAILED_STATE = 'SET_UPDATING_FAILED_STATE';

export function setLoadingState(inProgress, reset) {
  return { type: SET_LOADING_STATE, inProgress, reset };
}

export function setLoadingFailedState(failedRegion) {
  return (hasFailed, errorCode, msg) => {
    const type = SET_LOADING_FAILED_STATE;
    return { type, hasFailed, errorCode, msg, failedRegion };
  };
}
