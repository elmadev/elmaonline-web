import React from 'react';

import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

export default {
  title: 'Layout/List',
  component: ListCell,
};

const Template = args => (
  <ListContainer>
    <ListHeader>
      <ListCell>Header</ListCell>
    </ListHeader>
    <ListRow>
      <ListCell {...args} />
    </ListRow>
  </ListContainer>
);

export const Table = Template.bind({});
Table.args = {
  width: 200,
  children: 'children',
};
