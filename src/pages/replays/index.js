import React, { useState } from 'react';
import { Grid, Box, Tab, Tabs } from '@material-ui/core';
import ReplayList from 'features/ReplayList';
import ReplayListBattle from 'features/ReplayListBattle';
import Upload from 'features/Upload';
import Layout from 'components/Layout';
import { Paper } from 'components/Paper';

export default function Replays() {
  const [list, setList] = useState(0);
  return (
    <Layout t="Replays">
      <Grid container>
        <Grid item xs={12} sm={8}>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={list}
            onChange={(_e, t) => setList(t)}
          >
            <Tab label="Recently uploaded" />
            <Tab label="Battle replays" />
          </Tabs>
          <Grid container>
            {list === 0 && (
              <Grid item xs={12} sm={12}>
                <Paper>
                  <ReplayList showPagination showTags />
                </Paper>
              </Grid>
            )}
            {list === 1 && (
              <Grid item xs={12} sm={12}>
                <ReplayListBattle showPagination />
              </Grid>
            )}
          </Grid>
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
