import React from 'react';
import { Grid, Box } from '@material-ui/core';
import ReplayList from 'features/ReplayList';
import Upload from 'features/Upload';
import Layout from 'components/Layout';

export default function Replays() {
  return (
    <Layout>
      <Grid container>
        <Grid item xs={12} sm={8}>
          <ReplayList showPagination />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box p={2}>
            <Upload filetype=".rec" />
          </Box>
        </Grid>
      </Grid>
    </Layout>
  );
}
