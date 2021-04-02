import React from 'react';

import { Paper } from 'components/Paper';

export default {
  title: 'Layout/Paper',
  component: Paper,
};

const Template = args => <Paper {...args}>Content</Paper>;

export const Normal = Template.bind({});
Normal.args = {
  padding: true,
};

export const Highlight = Template.bind({});
Highlight.args = {
  padding: true,
  highlight: true,
};
