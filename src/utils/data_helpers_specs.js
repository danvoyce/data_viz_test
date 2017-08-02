import { expect } from 'chai';
import { fromJS, Map } from 'immutable';

import {
  scaleBetween,
  getTotal,
  getFilteredActivityTotal,
} from './data_helpers';

describe('Data Helpers', () => {
  describe('scaleBetween() scales a number between a specified min and max value and the min and max in the array', () => { // eslint-disable-line
    it('handles min and max number being the same and returns the same number if we try and divide by 0', () => { // eslint-disable-line
      const minAllowed = 0;
      const maxAllowed = 100;
      let result = scaleBetween(40, minAllowed, maxAllowed, 50, 50);
      expect(result).to.equal(40);

      result = scaleBetween(50, minAllowed, maxAllowed, 50, 50);
      expect(result).to.equal(50);
    });

    it('scales numbers correctly', () => {
      const minAllowed = 0;
      const maxAllowed = 150;
      let result = scaleBetween(25, minAllowed, maxAllowed, 25, 75);
      expect(result).to.equal(0);

      result = scaleBetween(50, minAllowed, maxAllowed, 25, 75);
      expect(result).to.equal(75);

      result = scaleBetween(75, minAllowed, maxAllowed, 25, 75);
      expect(result).to.equal(150);
    });
  });

  describe('getTotal() gets the summed total from an immutable List of Maps', () => { // eslint-disable-line
    it('adds the numbers correctly', () => {
      const data = [
        {
          num: 1,
        },
        {
          num: 2,
        },
        {
          num: 3,
        },
        {
          num: 4,
        },
      ];
      const key = 'num';
      const total = getTotal(fromJS(data), key);
      expect(total).to.equal(10);
    });
  });

  describe('getFilteredActivityTotal() sums the activity time based on the selected filters', () => { // eslint-disable-line
    const item = Map({
      low: 20,
      medium: 40,
      high: 60,
    });
    let filters = ['low', 'medium', 'high'];
    let total = getFilteredActivityTotal(item, filters);
    expect(total).to.equal(120);

    filters = ['medium', 'high'];
    total = getFilteredActivityTotal(item, filters);
    expect(total).to.equal(100);
  });
});
