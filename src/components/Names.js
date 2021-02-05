import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const formatLevel = level => {
  if (
    level.substring(0, 6) === 'QWQUU0' &&
    parseInt(level.substring(6, 8), 10) <= 55
  ) {
    return `Internal ${level.substring(6, 8)}`;
  }
  return level;
};

const Level = ({ long, LevelData }) => {
  return (
    <>
      {long && LevelData && LevelData.LongName}
      {!long && LevelData && formatLevel(LevelData.LevelName)}
      {!LevelData && 'Unknown'}
    </>
  );
};

Level.propTypes = {
  long: PropTypes.bool,
  LevelData: PropTypes.shape({
    LevelName: PropTypes.string,
    LongName: PropTypes.string,
  }),
};

Level.defaultProps = {
  long: false,
  LevelData: null,
};

class BattleType extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    lower: PropTypes.bool,
    small: PropTypes.bool,
    upper: PropTypes.bool,
  };

  static defaultProps = {
    lower: false,
    small: false,
    upper: false,
  };

  render() {
    const types = {
      NM: 'Normal',
      FF: 'First Finish',
      OL: 'One Life',
      SL: 'Slowness',
      SR: 'Survivor',
      FT: 'Flag Tag',
      AP: 'Apple',
      SP: 'Speed',
      LC: 'Last Counts',
      FC: 'Finish Count',
      HT: '1 Hour TT',
    };

    const { type, lower, small, upper } = this.props;
    return (
      <TypeSpan small={small} lower={lower} upper={upper}>
        {types[type]}
      </TypeSpan>
    );
  }
}

const TypeSpan = styled.span`
  text-transform: ${p =>
    p.upper ? 'uppercase' : p.lower ? 'lowercase' : 'none'};
  font-size: ${p => (p.small ? '10px' : 'inherit')};
`;

export { Level, BattleType };
