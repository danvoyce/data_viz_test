import { combineReducers } from 'redux';
import siteData from '../data/reducer';
import appStates from '../loading/reducer';

// you can combine all your other reducers under a single namespace like so
export default combineReducers({
  siteData,
  appStates,
});
