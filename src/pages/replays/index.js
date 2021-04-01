import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import ReplayList from 'features/ReplayList';
import ReplayListBattle from 'features/ReplayListBattle';
import Upload from 'features/Upload';
import Layout from 'components/Layout';
import styled from 'styled-components';
import { Router, navigate } from '@reach/router';
import Admin from './Admin';
import { mod } from 'utils/nick';

export default function Replays(props) {
  const [tab, setTab] = useState('');

  useEffect(() => {
    setTab(props['*']);
  }, [props]);

  return (
    <Layout edge t="Replays">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(_e, value) =>
          navigate(['/replays', value].filter(Boolean).join('/'))
        }
      >
        <Tab label="Recently uploaded" value="" />
        <Tab label="Battle replays" value="battle" />
        <Tab label="Upload" value="upload" />
        {mod() > 0 && <Tab label="Admin" value="admin" />}
      </Tabs>
      <Container>
        <Router primary={false}>
          <ReplayList default defaultPageSize={10000} showPagination showTags />
          <ReplayListBattle path="battle" showPagination />
          <Upload path="upload" filetype=".rec" />
          <Admin path="admin" />
        </Router>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
  font-size: 14px;
`;
