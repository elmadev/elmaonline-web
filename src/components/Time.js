import React from 'react';
import PropTypes from 'prop-types';
import {
  parseTimeHundreds,
  parseTimeThousands,
  parsedTimeToString,
} from '../utils/recTime';

class Time extends React.Component {
  static propTypes = {
    time: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({})])
      .isRequired,
    apples: PropTypes.number,
    thousands: PropTypes.bool,
  };

  static defaultProps = {
    thousands: false,
    apples: 0,
  };

  static formatTime = (time, apples, thousands) => {
    // for cup results
    if (apples === -1) {
      if (time === 9999100) {
        return '0 apples';
      }
      if (time >= 999900 && time <= 999999) {
        return `${1000000 - time} apple${1000000 - time !== 1 ? `s` : ``}`;
      }
      if (time >= 9999000 && time <= 9999999) {
        return `${10000000 - time} apple${10000000 - time !== 1 ? `s` : ``}`;
      }
    }
    if (time === 0) {
      return `${apples} apple${apples !== 1 ? `s` : ``}`;
    }

    if (thousands) {
      return parsedTimeToString(parseTimeThousands(time), true);
    } else {
      return parsedTimeToString(parseTimeHundreds(time), false);
    }
  };

  render() {
    const { time, apples, thousands } = this.props;
    if (!time && !apples) {
      return <span />;
    }
    if (typeof time === 'object') {
      if (time.unfinished) {
        return (
          <span>
            {time.finished} / {time.levs}
          </span>
        );
      }
      return <span>{Time.formatTime(time.tt, apples, thousands)}</span>;
    }
    return <span>{Time.formatTime(time || 0, apples, thousands)}</span>;
  }
}

export default Time;
