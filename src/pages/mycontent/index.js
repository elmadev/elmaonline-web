import React from 'react';
import Layout, { Content } from 'components/Layout';
// import { useStoreState, useStoreActions } from 'easy-peasy';
import { Tabs, Tab } from '@material-ui/core';
import { useNavigate } from '@reach/router';
import { Paper } from 'components/Paper';

const MyContent = ({ tab }) => {
  const navigate = useNavigate();
  // const { data } = useStoreState(state => state.MyContent);
  // const { getData } = useStoreActions(actions => actions.MyContent);

  return (
    <Layout edge t="My Content">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => {
          navigate(['/mycontent', value].filter(Boolean).join('/'));
        }}
      >
        <Tab label="Times & Replays" value="" />
        <Tab label="Uploaded Replays" value="replays" />
        <Tab label="Uploaded Files" value="files" />
      </Tabs>
      <Content>
        <Paper padding>{tab}</Paper>
      </Content>
    </Layout>
  );
};

export default MyContent;
