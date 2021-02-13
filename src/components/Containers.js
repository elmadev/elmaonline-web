import React from 'react';
import styled from 'styled-components';

export const Row = ({ children, center }) => {
  return <FlexRow center={center}>{children}</FlexRow>;
};

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  ${p => p.center && `justify-content: center; align-items: center;`};
`;

export const Column = ({ children, center }) => {
  return <FlexColumn center={center}>{children}</FlexColumn>;
};

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  ${p => p.center && `justify-content: center; align-items: center;`};
`;

export const Text = styled.div`
  padding-bottom: 16px;
`;
