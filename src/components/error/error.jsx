import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import classes from './error.css';

import { fetchSiteData } from '../../data/action_creators.js';
import {
  setLoadingState,
} from '../../loading/action_creators';

export class ErrorComponent extends Component {

  handleRetry() {
    const region = this.props.failedRegion;
    this.props.fetchSiteData(region);
  }

  handleCancel() {
    const { failedRegion, currentDataRegion } = this.props;

    this.props.setLoadingState(false, true);

    if (currentDataRegion !== failedRegion) {
      hashHistory.goBack();
    }
  }

  render() {
    const className = this.props.show ? classes.error : classes.errorHidden;
    return (
      <div className={ className }>
        <h3 className={ classes.errorText }>
          Error!<br/>
          <span>{ this.props.msg }</span>
        </h3>

        <div className={ classes.buttons }>
          <button onClick={ () => this.handleRetry() }>Retry!</button>
          <button onClick={ () => this.handleCancel() }>Go back!</button>
        </div>
      </div>
    );
  }
}

ErrorComponent.propTypes = {
  currentDataRegion: PropTypes.string,
  fetchSiteData: PropTypes.func,
  failedRegion: PropTypes.string,
  msg: PropTypes.string,
  setLoadingState: PropTypes.func,
  show: PropTypes.bool,
};

function mapStateToProps(state) {
  const loading = state.appStates.get('loading');
  const failedRegion = loading.get('failedRegion');
  const currentDataRegion = state.siteData.get('currentRegion');
  return {
    failedRegion,
    currentDataRegion,
  };
}

export const ErrorComponentWrapper = connect(
  (state) => mapStateToProps(state),
  { setLoadingState, fetchSiteData }
)(ErrorComponent);
