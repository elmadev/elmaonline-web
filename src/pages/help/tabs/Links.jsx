import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import Header from 'components/Header';

const Links = () => {
  return (
    <Text>
      <Header h2>Community links</Header>
      <Grid>
        <Grid>
          <a href="https://mopolauta.moposite.com/">mopolauta.moposite.com</a>{' '}
          The community forums.
        </Grid>
        <Grid>
          <a href="https://discord.gg/j5WMFC6">Elma discord</a> Elma community
          discord.
        </Grid>
        <Grid>
          <a href="http://wiki.elmaonline.net/">Elma wiki</a> Elma wiki.
        </Grid>
        <Grid>
          <a href="https://moposite.com/records_elma_wrs.php">
            World record table
          </a>{' '}
          Current official internal world records.
        </Grid>
        <Grid>
          <a href="https://moposite.com/">Moposite</a> The heart of the
          community when it comes to web sites since 1998.
        </Grid>
        <Grid>
          <a href="http://stats.sshoyer.net/">Elmastats</a> A site made by
          jonsykkel dedicated to keep the community up to date with internal
          times, total times etc. You can also restore your old state.dat, find
          replays and much more.
        </Grid>
        <Grid>
          <a href="http://kopasite.net/up">Kopasite.net/up</a> A file uploading
          service hosted by Kopaka, if you ever need to upload an elma-related
          item to share with others.
        </Grid>
      </Grid>
    </Text>
  );
};

const Text = styled.div`
  padding-left: 8px;
  max-width: 900px;
`;

export default Links;
