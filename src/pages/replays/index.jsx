import React from 'react';
import { Tab, Tabs } from '@material-ui/core';
import ReplayList from 'features/ReplayList';
import ReplayListBattle from 'features/ReplayListBattle';
import ReplayCommentArchive from 'features/ReplayCommentArchive';
import Upload from 'features/Upload';
import Layout from 'components/Layout';
import styled from 'styled-components';
import { useNavigate, useParams } from '@tanstack/react-router';
import Mod from './Mod';
import { mod } from 'utils/nick';

export default function Replays() {
  const navigate = useNavigate();
  const { tab } = useParams({ strict: false });

  return (
    <Layout edge t="Replays">
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab || ''}
        onChange={(_e, value) =>
          navigate({ to: ['/replays', value].filter(Boolean).join('/') })
        }
      >
        <Tab label="Recently uploaded" value="" />
        <Tab label="Battle replays" value="battle" />
        <Tab label="Upload" value="upload" />
        <Tab label="Comments" value="comments" />
        {mod() > 0 && <Tab label="Mod" value="mod" />}
      </Tabs>
      <Container>
        {!tab ? <ReplayList persist="recentlyUploaded" uploadFab /> : null}
        {tab === 'battle' ? <ReplayListBattle showPagination /> : null}
        {tab === 'upload' ? <Upload filetype=".rec" /> : null}
        {tab === 'comments' ? <ReplayCommentArchive /> : null}
        {tab === 'mod' ? <Mod /> : null}
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  min-height: 100%;
  box-sizing: border-box;
  font-size: 14px;
`;
