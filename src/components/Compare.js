import React from 'react';
import styled from 'styled-components';
import Time from 'components/Time';
import Crown from 'images/crown.svg';

const Compare = ({ time, compareTime }) => {
  if (!time || !compareTime) {
    return null;
  }
  if (compareTime.Time === time.Time) {
    return (
      <span>
        <Image src={Crown} alt="Crown" title="You have the record!" />
      </span>
    );
  }
  return (
    <Color bettertime={compareTime.Time > time.Time}>
      {compareTime.Time &&
        time.Time &&
        (compareTime.Time > time.Time ? '-' : '+')}
      {compareTime.Time && time.Time && (
        <Time time={Math.abs(compareTime.Time - time.Time)} />
      )}
    </Color>
  );
};

const Color = styled.span`
  && {
    color: ${p => (p.bettertime ? p.theme.linkColor : '#da0000')};
  }
`;

const Image = styled.img`
  height: 19px;
  width: 19px;
`;

export default Compare;
