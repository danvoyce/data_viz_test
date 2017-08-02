import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';

import {
  fetchPatientsData,
  fetchActivityDefinitions,
} from '../data/action_creators.js';

import { Loading } from '../components/loading/loading.jsx';

import './css/reset';
import './css/global';
import './app.css';

export class AppComponent extends Component {

  constructor(props) {
    super(props);

    // Ensure we have the definitions first...
    props.fetchActivityDefinitions().then(() => props.fetchPatientsData());
  }

  render() {
    const {
      children,
      loadingInProgress,
      data,
    } = this.props;

    const childrenWithProps = React.Children.map(children,
     (child) => cloneElement(child, { data })
    );

    return (
      <div>
        { childrenWithProps }
        <Loading show={ loadingInProgress } />
      </div>
    );
  }
}

AppComponent.propTypes = {
  children: PropTypes.object,
  loadingInProgress: PropTypes.bool,
  fetchPatientsData: PropTypes.func,
  fetchActivityDefinitions: PropTypes.func,
  data: ImmutablePropTypes.list,
};

function mapStateToProps(state) {
  const loading = state.appStates.get('loading');
  const loadingInProgress = loading.get('inProgress');
  const data = state.siteData.get('merged');
  return {
    loadingInProgress,
    data,
  };
}

export const App = connect(
  (state) => mapStateToProps(state),
  { fetchPatientsData, fetchActivityDefinitions }
)(AppComponent);
