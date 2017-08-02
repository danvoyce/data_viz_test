
export function getTotal(data, key) {
  return data.reduce((prev, curr) => prev + curr.get(key), 0);
}

// Am using a reduce and not a filter here as need to modify the outputted value
// and dont want to do this loop twice, i.e filter, then map ;)
export function getFilteredActivityTotal(item, filters) {
  return item.reduce((prev, curr, key) => {
    let value = prev;
    if (filters.indexOf(key) > -1) {
      value = prev + curr;
    }
    return value;
  }, 0);
}

export function scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
  const allowedDiff = maxAllowed - minAllowed;
  const valueDiff = unscaledNum - min;
  const rangeDiff = max - min;
  const rangeDiffPlusMin = rangeDiff + minAllowed;
  let newValue = unscaledNum;

  if (rangeDiffPlusMin) {
    newValue = allowedDiff * valueDiff / rangeDiffPlusMin;
  } else {
    console.warn('You`re trying to divide by 0! Check you`re min and max values are different'); // eslint-disable-line
  }

  if (unscaledNum > max || unscaledNum < min) {
    console.warn('Your unscaled number is less or greater than the min/max specified!'); // eslint-disable-line
  }

  return newValue;
}

export function getFormattedData(data, filters) {
  const xTotal = getTotal(data, 'bmi');
  const yValues = data.map((item) => {
    return getFilteredActivityTotal(item.get('intensityTotals'), filters);
  });
  const yMin = yValues.min();
  const yMax = yValues.max();

  return data.map((item) => {
    const xValue = item.get('bmi');
    const yValue =
      getFilteredActivityTotal(item.get('intensityTotals'), filters);

    return {
      info: {
        id: item.get('id'),
        name: item.get('name'),
      },
      x: {
        key: 'bmi',
        value: xValue,
        percent: xValue / xTotal || 0,
      },
      y: {
        key: 'activity',
        scaledValue: scaleBetween(yValue, 2, 200, yMin, yMax),
        value: yValue,
      },
    };
  });
}
