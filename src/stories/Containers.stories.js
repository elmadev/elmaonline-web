import React from 'react';
import styled from 'styled-components';

import { Row, Column } from 'components/Containers';

export default {
  title: 'Layout/Containers',
  component: Column,
};

const Red = styled.div`
  background-color: red;
  height: 100px;
  width: 100px;
`;

const Blue = styled(Red)`
  background-color: blue;
`;

const Green = styled(Red)`
  background-color: Green;
`;

const TemplateColumn = args => <Column {...args} />;

export const FlexColumn = TemplateColumn.bind({});
FlexColumn.args = {
  children: (
    <>
      <Red />
      <Blue />
      <Green />
    </>
  ),
};

const TemplateRow = args => <Row {...args} />;

export const FlexRow = TemplateRow.bind({});
FlexRow.args = {
  children: (
    <>
      <Red />
      <Blue />
      <Green />
    </>
  ),
};
