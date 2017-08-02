import { daoFetch, formatUrl } from '../utils/dao_helpers';

export function getPatientSummary(id) {
  const url = formatUrl(`/data/patients/${id}/summary.json`);

  return daoFetch(url).then((obj) => {
    return obj;
  });
}

export function getPatientsInfo() {
  const url = formatUrl('/data/patients.json');
  return daoFetch(url).then((obj) => {
    return obj;
  });
}

export function getActivityDefinitions() {
  const url = formatUrl('/data/definitions/activities.json');
  return daoFetch(url).then((obj) => {
    return obj;
  });
}
