import { List, Map, fromJS } from 'immutable';

import {
  REQUEST_ACTIVITY_DEFINITIONS,
  RECEIVE_ACTIVITY_DEFINITIONS,
  REQUEST_PATIENTS_DATA,
  RECEIVE_PATIENTS_DATA,
  REQUEST_PATIENTS_SUMMARIES,
  RECEIVE_PATIENTS_SUMMARIES,
  MERGE_PATIENT_DATA,
} from './action_creators';

const INTENSITIES = ['low', 'moderate', 'vigorous'];

const defaultState = fromJS({
  unformatted: Map({
    patients: List(),
    summaries: Map(),
    definitions: List(),
  }),
  merged: List(),
});

function calculateAge(dob) {
  const now = new Date().getTime();
  const birthDate = new Date(dob).getTime();
  const minutes = 1000 * 60;
  const hours = minutes * 60;
  const days = hours * 24;
  const years = days * 365;
  return (now - birthDate) / years;
}

function getIntensityTotals(activities, definitions) {
  const totals = {};

  INTENSITIES.forEach((intensity) => {
    let intensityMinutes = 0;

    activities.forEach((item) => {
      const type = item.get('activity');
      const definitionItem = definitions.find((definition) => {
        return definition.activity === type;
      });

      if (definitionItem.intensity === intensity) {
        intensityMinutes += item.get('minutes');
      }
    });

    totals[intensity] = intensityMinutes;
  });

  return totals;
}

function mergeAndFormatPatientData(data, definitions) {
  const merged = data.get('patients').map((patient) => {
    const id = patient.id;
    const activities = data.getIn(['summaries', id]);
    const age = calculateAge(patient.birthDate);
    const intensityTotals = getIntensityTotals(activities, definitions);

    return {
      ...patient,
      age,
      activities,
      intensityTotals,
    };
  });

  return fromJS(merged);
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case MERGE_PATIENT_DATA:
    const definitions = state.getIn(['unformatted', 'definitions']);
      return state.setIn(
        ['merged'],
        mergeAndFormatPatientData(state.get('unformatted'), definitions)
      );
    case REQUEST_PATIENTS_SUMMARIES:
      return state;
    case RECEIVE_PATIENTS_SUMMARIES:
      return state.setIn(
        ['unformatted', 'summaries', action.id],
        fromJS(action.data)
      );
    case REQUEST_PATIENTS_DATA:
      return state;
    case RECEIVE_PATIENTS_DATA:
      return state.setIn(['unformatted', 'patients'], action.data);
    case REQUEST_ACTIVITY_DEFINITIONS:
      return state;
    case RECEIVE_ACTIVITY_DEFINITIONS:
      return state.setIn(['unformatted', 'definitions'], action.data);
    default:
      return state;
  }
}
