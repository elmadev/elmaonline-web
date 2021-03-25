import React from 'react';
import styled from 'styled-components';

export const Row = ({ children, center, ai, jc, t, b, l, r }) => {
  return (
    <FlexRow ai={ai} jc={jc} center={center} t={t} b={b} l={l} r={r}>
      {children}
    </FlexRow>
  );
};

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  ${p => p.center && `justify-content: center; align-items: center;`}
  ${p => p.ai && `align-items: ${p.ai};`}
  ${p => p.jc && `justify-content: ${p.jc};`}
  ${p => p.t && `margin-top ${p.theme[`pad${p.t}`]};`}
  ${p => p.b && `margin-bottom ${p.theme[`pad${p.b}`]};`}
  ${p => p.l && `margin-left ${p.theme[`pad${p.l}`]};`}
  ${p => p.r && `margin-right ${p.theme[`pad${p.r}`]};`}
`;

export const Column = ({ children, center, ai, jc, t, b, l, r }) => {
  return (
    <FlexColumn ai={ai} jc={jc} center={center} t={t} b={b} l={l} r={r}>
      {children}
    </FlexColumn>
  );
};

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  ${p => p.center && `justify-content: center; align-items: center;`}
  ${p => p.ai && `align-items: ${p.ai};`}
  ${p => p.jc && `justify-content: ${p.jc};`}
  ${p => p.t && `margin-top ${p.theme[`pad${p.t}`]};`}
  ${p => p.b && `margin-bottom ${p.theme[`pad${p.b}`]};`}
  ${p => p.l && `margin-left ${p.theme[`pad${p.l}`]};`}
  ${p => p.r && `margin-right ${p.theme[`pad${p.r}`]};`}
`;

export const Text = styled.div`
  padding-bottom: 16px;
  color: ${p => (p.light ? p.theme.lightTextColor : p.theme.fontColor)};
  font-size: ${p => p.theme.fontSize};
`;
