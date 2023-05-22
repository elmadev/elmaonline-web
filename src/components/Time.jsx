import React from 'react';
import styled from 'styled-components';
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
    color: PropTypes.string,
  };

  static defaultProps = {
    thousands: false,
    apples: 0,
    color: '',
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
    const { time, apples, thousands, color } = this.props;
    if (!time && !Number.isInteger(apples)) {
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
      return (
        <Span color={color}>{Time.formatTime(time.tt, apples, thousands)}</Span>
      );
    }
    return (
      <Span color={color}>{Time.formatTime(time || 0, apples, thousands)}</Span>
    );
  }
}

const Span = styled.span`
  && {
    ${p => p.color && `color: ${p.color};`}
  }
`;

export default Time;
