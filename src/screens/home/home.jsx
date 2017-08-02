import React, { Component } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import PieChart from '../../components/pie_chart/pie_chart.jsx';

import { getFormattedData } from '../../utils/data_helpers';

import classes from './home.css';

const INTENSITIES = Object.freeze(['low', 'moderate', 'vigorous']);

export default class Screen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // clone this otherwise it will ref and modify the original
      // filters: INTENSITIES.slice(0),
      // No wait... Object.freeze();
      filters: INTENSITIES,
    };
  }

  handleOnClickCheckbox(key) {
    // this is wrong! Splice mutates the original array
    // const filters = this.state.filters.splice(0);

    // clone so we don't manipulate the state directly
    const filters = this.state.filters.slice(0);
    const index = filters.indexOf(key);

    if (index > -1) {
      filters.splice(index, 1);
    } else {
      filters.push(key);
    }

    this.setState({ filters });
  }

  renderCheckboxes() {
    return (
      <div className={ classes.filters }>
        { INTENSITIES.map((key) => {
          return (
            <div key={ key } >
              <label htmlFor={ `check-${key}` } >{ key }</label>
              <input
                id={ `check-${key}` }
                type="checkbox"
                defaultChecked={ this.state.filters.indexOf(key) > -1 }
                onClick={ () => this.handleOnClickCheckbox(key) }
              />
            </div>
          );
        }) }
      </div>
    );
  }

  render() {
    const { filters } = this.state;
    const formattedData = getFormattedData(this.props.data, filters);
    return (
      <main className={ classes.main }>
        <h1 className={ classes.heading }>Patients activity visualisation</h1>
        { this.renderCheckboxes() }
        <PieChart data={ formattedData } />
        <div className={ classes.key }>
          <p><strong>KEY:</strong></p>
          <p>BMI is represented by the width / circumference of the segment</p>
          <p>Activity is represented by the height / radius of the segment</p>
          <p>Click a segment to lock it. Click it again to unlock it.</p>
        </div>
      </main>
    );
  }
}

Screen.propTypes = {
  data: ImmutablePropTypes.list,
};
