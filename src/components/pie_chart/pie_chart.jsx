/* global TweenMax, Elastic */
import React, { Component, PropTypes } from 'react';
import 'gsap';
import 'gsap-react-plugin';

import svgUtils from '../../utils/svg_helper';
import classes from './pie_chart.css';

export default class PieChart extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    const data = nextProps.data;
    if (!this.state.widths && data && data.size) {
      this.resetWidths(data);
    } else if (data.size) {
      this.transitionWidth(data);
    }
  }

  handleOnMouseOver(id) {
    const activeID = id ? id : this.state.lockedActiveID;
    this.setState({ activeID });
  }

  handleOnClick(activeID) {
    const lockedActiveID =
      activeID === this.state.lockedActiveID ? undefined : activeID;
    this.setState({ activeID, lockedActiveID });
  }

  resetWidths(data) {
    const widths = Array(data.size).fill(0);
    this.setState({ widths });
  }

  transitionWidth(data) {
    const currentPosition = Object.assign({}, this.state.widths);
    const nextPosition =
      Object.assign({}, data.map((item) => item.y.scaledValue || 1).toJS());

    this.setState({
      widths: nextPosition,
    });

    nextPosition.onUpdate = () => {
      this.setState({
        widths: currentPosition,
      });
    };

    nextPosition.ease = Elastic.easeInOut.config(1, 0.7);

    TweenMax.to(currentPosition, 0.5, nextPosition);
  }

  renderArcs() {
    const { data } = this.props;
    const { activeID, lockedActiveID } = this.state;
    let startAngle = -90;
    return (
      data.map((item, i) => {
        const angleSize = 360 * item.x.percent; // size of the curve
        const id = item.info.id;
        const width = this.state.widths[i];
        const path = svgUtils.segment({
          cx: 425,
          cy: 425,
          radius: 200 + width,
          width: width || 0,
          startAngle: startAngle + angleSize,
          endAngle: startAngle,
          sweepFlag: 0,
        });

        startAngle += angleSize;

        return (
          <path
            className={ classes.arc }
            key={ id }
            onClick={ () => this.handleOnClick(id) }
            onMouseOver={ () => this.handleOnMouseOver(id) }
            onMouseOut={ () => this.handleOnMouseOver() }
            fill="none"
            d={ path }
            stroke="#fff"
            strokeWidth="1"
            fill="#ff5722"
            opacity={
              activeID && activeID === id || lockedActiveID === id ? 1 : 0.5
            }
          />
        );
      })
    );
  }

  renderInfo() {
    const { data } = this.props;
    return (
      <div className={ classes.infoArea }>
        {
          data.map((item) => {
            const id = item.info.id;
            return (
              <div
                key={ id }
                className={ classes.infoBlock }
                style={{
                  opacity: this.state.activeID === id ? 1 : 0,
                }}
              >
                <h2 className={ classes.name }>{ item.info.name }</h2>
                <h3 className={ classes.bmi }>BMI: { item.x.value }</h3>
                <h3 className={ classes.activity }>
                  Activity (mins): { item.y.value }
                </h3>
              </div>
            );
          })
        }
      </div>
    );
  }

  render() {
    const { width, height } = this.props;
    const viewBox = `0 0 ${width} ${height}`;
    const attributes = {
      className: classes.svg,
      width,
      height,
      viewBox,
    };

    return (
      <div className={ classes.circleViz }>
        <svg {...attributes} >
          { this.renderArcs() }
        </svg>
        { this.renderInfo() }
      </div>
    );
  }
}

PieChart.defaultProps = {
  height: 850,
  width: 850,
  data: [
    {
      info: {
        name: 'bob',
      },
      x: {
        key: 'bmi',
        value: 1,
        percent: 0.1,
      },
      y: {
        age: 30,
        value: 1,
        percent: 0.1,
      },
    },
  ],
};

PieChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  data: PropTypes.object,
};
