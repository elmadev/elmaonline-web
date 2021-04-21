import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from '@material-ui/core';
import ReplayList from 'features/ReplayList';
import ReplayListBattle from 'features/ReplayListBattle';
import ReplayCommentArchive from 'features/ReplayCommentArchive';
import Upload from 'features/Upload';
import Layout from 'components/Layout';
import styled from 'styled-components';
import { Router, navigate } from '@reach/router';
import Mod from './Mod';
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
        <Tab label="Comments" value="comments" />
        {mod() > 0 && <Tab label="Mod" value="mod" />}
      </Tabs>
      <Container>
        <Router primary={false}>
          <ReplayList default />
          <ReplayListBattle path="battle" showPagination />
          <Upload path="upload" filetype=".rec" />
          <ReplayCommentArchive path="comments" />
          <Mod path="mod" />
        </Router>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  min-height: 100%;
  box-sizing: border-box;
  font-size: 14px;
`;
