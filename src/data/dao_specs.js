// import { expect } from 'chai';
// import nock from 'nock';
// import sinon from 'sinon';
// import config from '../core/config';

// import { getData, getConfig } from './dao';

// const REGION = 'uk';
// const DATA_SAMPLE = {
//   products: [
//     {
//       name: 'Twix',
//       fundamentals: [],
//       guardweb: [],
//     },
//   ],
// };

// describe('getData() DAO', () => {
//   let clock;
//   let now;

//   beforeEach(() => {
//     clock = sinon.useFakeTimers(now);
//   });

//   it('fetches the correct JSON file', (done) => {
//     nock(config.apiBaseUrl)
//        .get(`/data/data_${REGION}.json`)
//        .query({ _ts: new Date().getTime() })
//        .reply(200, { data: DATA_SAMPLE });

//     getData(REGION).then((obj) => {
//       expect(obj).to.eql({ data: DATA_SAMPLE });
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });

//   afterEach(() => {
//     clock.restore();
//   });
// });

// describe('getConfig() DAO', () => {
//   let clock;
//   let now;

//   beforeEach(() => {
//     clock = sinon.useFakeTimers(now);
//   });

//   it('fetches the correct JSON file', (done) => {
//     nock(config.apiBaseUrl)
//        .get('/data/config.json')
//        .query({ _ts: new Date().getTime() })
//        .reply(200, { data: DATA_SAMPLE });

//     getConfig().then((obj) => {
//       expect(obj).to.eql({ data: DATA_SAMPLE });
//       done();
//     }).catch((err) => {
//       done(err);
//     });
//   });

//   afterEach(() => {
//     clock.restore();
//   });
// });
