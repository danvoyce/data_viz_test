/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';

import {
  setLoadingState,
  setLoadingFailedState,
} from './action_creators';

describe('Loading Action Creators', () => {
  describe('setLoadingState', () => {
    it('dipatches correct action with correct user data', () => {
      let result = setLoadingState(true);
      expect(result).to.eql({
        type: 'SET_LOADING_STATE',
        inProgress: true,
        reset: undefined,
      });

      result = setLoadingState(false);
      expect(result).to.eql({
        type: 'SET_LOADING_STATE',
        inProgress: false,
        reset: undefined,
      });
    });
  });

  describe('setLoadingFailedState', () => {
    it('dipatches correct action with correst user data', () => {
      let result = setLoadingFailedState()(
        true,
        'errCode',
        'msg'
      );
      expect(result).to.eql({
        type: 'SET_LOADING_FAILED_STATE',
        hasFailed: true,
        errorCode: 'errCode',
        failedRegion: undefined,
        msg: 'msg',
      });
      result = setLoadingFailedState()(
        false,
        'errCode',
        'msg'
      );
      expect(result).to.eql({
        type: 'SET_LOADING_FAILED_STATE',
        hasFailed: false,
        errorCode: 'errCode',
        failedRegion: undefined,
        msg: 'msg',
      });
    });
  });
});
