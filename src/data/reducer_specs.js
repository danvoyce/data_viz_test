import { expect } from 'chai';
import createHistory from 'history/lib/createHashHistory';
import makeStore from '../core/store';
import { fromJS, List, Map } from 'immutable';

import {
  REQUEST_PATIENTS_DATA,
  RECEIVE_PATIENTS_DATA,
  REQUEST_PATIENTS_SUMMARIES,
  RECEIVE_PATIENTS_SUMMARIES,
  MERGE_PATIENT_DATA,
} from './action_creators';

const defaultState = fromJS({
  unformatted: Map({
    patients: List(),
    summaries: Map(),
    definitions: List(),
  }),
  merged: List(),
});

const SAMPLE_PATIENT_DATA = [
  {
    id: 1,
    name: 'Gregor van Vloten',
    gender: 'male',
    birthDate: '1986-05-09',
    heightCm: 193,
    weightKg: 69.6,
    bmi: 18.6,
  },
  {
    id: 2,
    name: 'Susanne Marcil',
    gender: 'female',
    birthDate: '1984-11-18',
    heightCm: 159,
    weightKg: 102.8,
    bmi: 40.6,
  },
];

const SAMPLE_ACTIVITY_DATA = [
  {
    activity: 'sleeping',
    minutes: 540,
  },
  {
    activity: 'walking',
    minutes: 75,
  },
  {
    activity: 'stationary-awake',
    minutes: 765,
  },
  {
    activity: 'swimming',
    minutes: 60,
  },
];

describe('Data Reducers', () => {
  it('handles REQUEST_PATIENTS_DATA', () => {
    const store = makeStore(createHistory());
    const action = { type: REQUEST_PATIENTS_DATA };
    store.dispatch(action);
    const newState = store.getState();

    expect(newState.siteData).to.eql(defaultState);
  });

  it('handles RECEIVE_PATIENTS_DATA', () => {
    const store = makeStore(createHistory());
    const action = { type: RECEIVE_PATIENTS_DATA, data: SAMPLE_PATIENT_DATA };
    store.dispatch(action);
    const newState = store.getState();
    const actualPatientsData = SAMPLE_PATIENT_DATA;
    const expectedPatientsData =
      newState.siteData.getIn(['unformatted', 'patients']);

    expect(expectedPatientsData).to.eql(actualPatientsData);
  });

  it('handles REQUEST_PATIENTS_SUMMARIES', () => {
    const store = makeStore(createHistory());
    const action = { type: REQUEST_PATIENTS_SUMMARIES };
    store.dispatch(action);
    const newState = store.getState();

    expect(newState.siteData).to.eql(defaultState);
  });

  it('handles RECEIVE_PATIENTS_SUMMARIES', () => {
    const store = makeStore(createHistory());
    const action =
      { type: RECEIVE_PATIENTS_SUMMARIES, data: SAMPLE_ACTIVITY_DATA, id: 1 };
    store.dispatch(action);
    const newState = store.getState();
    const actualPatientsData = SAMPLE_ACTIVITY_DATA;
    const expectedPatientsData =
      newState.siteData.getIn(['unformatted', 'summaries', 1]);

    expect(expectedPatientsData).to.eql(fromJS(actualPatientsData));
  });
});
