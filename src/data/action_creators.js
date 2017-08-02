import * as dao from './dao';

import {
  setLoadingState,
  setLoadingFailedState,
} from '../loading/action_creators';

import {
  timeoutErrorHandler,
  otherErrorsHandler,
  networkErrorHandler,
  errorHandler,
} from '../errors/error_handlers';

export const REQUEST_ACTIVITY_DEFINITIONS = 'REQUEST_ACTIVITY_DEFINITIONS';
export const RECEIVE_ACTIVITY_DEFINITIONS = 'RECEIVE_ACTIVITY_DEFINITIONS';
export const REQUEST_PATIENTS_DATA = 'REQUEST_PATIENTS_DATA';
export const RECEIVE_PATIENTS_DATA = 'RECEIVE_PATIENTS_DATA';
export const REQUEST_PATIENTS_SUMMARIES = 'REQUEST_PATIENTS_SUMMARIES';
export const RECEIVE_PATIENTS_SUMMARIES = 'RECEIVE_PATIENTS_SUMMARIES';
export const MERGE_PATIENT_DATA = 'MERGE_PATIENT_DATA';

let ITEM_COUNTER = 0;

function requestActivityDefinitions() {
  return { type: REQUEST_ACTIVITY_DEFINITIONS };
}

function receiveActivityDefinitionsdata(data) {
  return {
    type: RECEIVE_ACTIVITY_DEFINITIONS,
    data,
  };
}

function requestPatientsData() {
  return { type: REQUEST_PATIENTS_DATA };
}

function receivePatientsData(data) {
  return {
    type: RECEIVE_PATIENTS_DATA,
    data,
  };
}

function requestPatientSummaries() {
  return { type: REQUEST_PATIENTS_SUMMARIES };
}

function receivePatientSummaries(data, id) {
  return {
    type: RECEIVE_PATIENTS_SUMMARIES,
    data,
    id,
  };
}

function mergePatientData() {
  return { type: MERGE_PATIENT_DATA };
}

export function fetchPatientSummaries(data) {
  const patient = data[ITEM_COUNTER];
  const id = patient && patient.id || 1;
  return (dispatch) => {
    dispatch(requestPatientSummaries());
    return dao.getPatientSummary(id)
      .then((summaryData) => {
        // This isn't pretty or robust, but does the job for this demo
        if (ITEM_COUNTER < data.length) {
          ITEM_COUNTER++;
          dispatch(fetchPatientSummaries(data));
        } else {
          // Once we have them all we can merge the data
          dispatch(mergePatientData());
          dispatch(setLoadingState(false));
        }
        return dispatch(receivePatientSummaries(summaryData, id));
      }).catch((err) => {
        const actionCreator = setLoadingFailedState('data!');
        return errorHandler(
          timeoutErrorHandler,
          networkErrorHandler,
          otherErrorsHandler
        )(dispatch, actionCreator, err);
      });
  };
}

export function fetchPatientsData() {
  return (dispatch) => {
    dispatch(setLoadingState(true));
    dispatch(requestPatientsData());
    return dao.getPatientsInfo()
      .then((data) => {
        dispatch(fetchPatientSummaries(data));
        return dispatch(receivePatientsData(data));
      }).catch((err) => {
        const actionCreator = setLoadingFailedState('data!');
        return errorHandler(
          timeoutErrorHandler,
          networkErrorHandler,
          otherErrorsHandler
        )(dispatch, actionCreator, err);
      });
  };
}

export function fetchActivityDefinitions() {
  return (dispatch) => {
    dispatch(setLoadingState(true));
    dispatch(requestActivityDefinitions());
    return dao.getActivityDefinitions()
      .then((data) => {
        return dispatch(receiveActivityDefinitionsdata(data));
      }).catch((err) => {
        const actionCreator = setLoadingFailedState('data!');
        return errorHandler(
          timeoutErrorHandler,
          networkErrorHandler,
          otherErrorsHandler
        )(dispatch, actionCreator, err);
      });
  };
}
