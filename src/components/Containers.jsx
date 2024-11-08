import React from 'react';
import styled from '@emotion/styled';

export const Row = ({ children, center, ai, jc, t, b, l, r, width, p }) => {
  return (
    <FlexRow
      ai={ai}
      jc={jc}
      center={center}
      t={t}
      b={b}
      l={l}
      r={r}
      width={width}
      p={p}
    >
      {children}
    </FlexRow>
  );
};

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  ${p => p.center && `justify-content: center; align-items: center;`}
  ${p => p.width && `width: ${p.width};`}  
  ${p => p.ai && `align-items: ${p.ai};`}
  ${p => p.jc && `justify-content: ${p.jc};`}
  ${p => p.t && `margin-top ${p.theme[`pad${p.t}`]};`}
  ${p => p.b && `margin-bottom ${p.theme[`pad${p.b}`]};`}
  ${p => p.l && `margin-left ${p.theme[`pad${p.l}`]};`}
  ${p => p.r && `margin-right ${p.theme[`pad${p.r}`]};`}
  ${p => p.p && `padding: ${p.theme[`pad${p.p}`]};`}
`;

export const Column = ({ children, center, ai, jc, t, b, l, r, p }) => {
  return (
    <FlexColumn ai={ai} jc={jc} center={center} t={t} b={b} l={l} r={r} p={p}>
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
  ${p => p.p && `padding: ${p.theme[`pad${p.p}`]};`}
`;

export const Text = styled.div`
  padding-bottom: ${p => (p.noPad ? 0 : '16px')};
  color: ${p => (p.light ? p.theme.lightTextColor : p.theme.fontColor)};
  font-size: ${p => (p.small ? p.theme.smallFont : p.theme.fontSize)};
  ${p => p.t && `margin-top ${p.theme[`pad${p.t}`]};`}
  ${p => p.b && `margin-bottom ${p.theme[`pad${p.b}`]};`}
  ${p => p.l && `margin-left ${p.theme[`pad${p.l}`]};`}
  ${p => p.r && `margin-right ${p.theme[`pad${p.r}`]};`}
`;
