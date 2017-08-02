/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import sinon from 'sinon';

import * as dao from './dao';

import {
  REQUEST_PATIENTS_DATA,
  RECEIVE_PATIENTS_DATA,
  REQUEST_PATIENTS_SUMMARIES,
  RECEIVE_PATIENTS_SUMMARIES,
  MERGE_PATIENT_DATA,
  fetchPatientsData,
  fetchPatientSummaries,
} from './action_creators';

import {
  SET_LOADING_STATE,
  SET_LOADING_FAILED_STATE,
} from '../loading/action_creators';

import { RequestTimeoutError } from '../errors/timeout';
import { NetworkError } from '../errors/network';

const SAMPLE_DATA = [
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

describe('fetchPatientsData()', () => {
  let infosStub;
  let summariesStub;

  beforeEach(() => {
    infosStub = sinon.stub(dao, 'getPatientsInfo');
    infosStub.returns(Promise.resolve({}));
    summariesStub = sinon.stub(dao, 'getPatientSummary');
    summariesStub.returns(Promise.resolve({}));
  });

  it('is called and sets SET_LOADING_STATE to true', () => {
    const action = fetchPatientsData();
    const spy = sinon.spy();
    action(spy);

    expect(spy.callCount).to.eql(2);
    expect(spy.args[0]).to.eql([{
      reset: undefined,
      inProgress: true,
      type: SET_LOADING_STATE,
    }]);
  });

  it('then dispatches to REQUEST_PATIENTS_DATA', () => {
    const action = fetchPatientsData();
    const spy = sinon.spy();
    action(spy);

    expect(spy.args[1]).to.eql([{
      type: REQUEST_PATIENTS_DATA,
    }]);
  });

  it('then iterates over each patient returned from dao.getPatientSummary() and calls fetchPatientSummaries()', () => { // eslint-disable-line
    const action = fetchPatientSummaries(SAMPLE_DATA);
    const spy = sinon.spy();
    action(spy);

    expect(spy.args[0]).to.eql([{
      type: REQUEST_PATIENTS_SUMMARIES,
    }]);
  });

  it('Once fetchPatientSummaries(data) has all the data, it then calls MERGE_PATIENT_DATA and sets SET_LOADING_STATE to false', () => { // eslint-disable-line
    const action = fetchPatientSummaries(SAMPLE_DATA);
    const spy = sinon.spy();
    action(spy);

    // TODO: test this more throroughly

    return expect(action(spy))
      .to.be.fulfilled
      .then(() => {
        expect(spy.args[4]).to.eql([{
          type: MERGE_PATIENT_DATA,
        }]);
        expect(spy.args[5]).to.eql([{
          type: SET_LOADING_STATE,
          inProgress: false,
          reset: undefined,
        }]);
        expect(spy.args[6]).to.eql([{
          type: RECEIVE_PATIENTS_SUMMARIES,
          data: {},
          id: 2,
        }]);
      });
  });

  it('dispatches each summary data once its been fetched', () => {
    const action = fetchPatientsData();
    const spy = sinon.spy();
    action(spy);

    return expect(action(spy))
      .to.be.fulfilled
      .then(() => {
        expect(spy.args[5]).to.eql([{
          type: RECEIVE_PATIENTS_DATA,
          data: {},
        }]);
      });
  });

  it('dispatches to SET_LOADING_FAILED_STATE if error', () => {
    const action = fetchPatientsData();
    const spy = sinon.spy();
    action(spy);

    // Stub the dao and force it to error...
    infosStub.returns(Promise.reject(new Error()));

    return expect(action(spy))
      .to.be.rejectedWith()
      .then(() => {
        expect(spy.args[6]).to.eql([{
          type: SET_LOADING_FAILED_STATE,
          hasFailed: true,
          errorCode: undefined,
          msg: 'Something went wrong...',
          failedRegion: 'data!',
        }]);
      });
  });

  it('calls timeoutErrorHandler if error is instance of RequestTimeoutError()',
    () => {
      const action = fetchPatientsData();
      const spy = sinon.spy();
      action(spy);
      infosStub.returns(Promise.reject(new RequestTimeoutError()));

      return expect(action(spy))
        .to.be.rejectedWith(RequestTimeoutError)
        .then(() => {
          expect(spy.args[6]).to.eql([{
            type: SET_LOADING_FAILED_STATE,
            hasFailed: true,
            errorCode: 'client_timeout',
            msg: 'Request Client Timeout Error',
            failedRegion: 'data!',
          }]);
        });
    }
  );

  it('calls networkErrorHandler if error is instance of NetworkError()', () => {
    const action = fetchPatientsData();
    const spy = sinon.spy();
    action(spy);

    infosStub.returns(Promise.reject(new NetworkError()));

    return expect(action(spy))
      .to.be.rejectedWith(NetworkError)
      .then(() => {
        expect(spy.args[6]).to.eql([{
          type: SET_LOADING_FAILED_STATE,
          hasFailed: true,
          errorCode: undefined,
          msg: 'Network Error',
          failedRegion: 'data!',
        }]);
      });
  });

  afterEach(() => {
    infosStub.restore();
    summariesStub.restore();
  });
});
