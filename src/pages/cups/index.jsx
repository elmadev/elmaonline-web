import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Grid } from '@material-ui/core';
import AddCup from 'components/AddCup';
import Header from 'components/Header';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import LinkWithDesc from 'components/LinkWithDesc';
import { Paper } from 'components/Paper';

const Cups = () => {
  const { cupList, addSuccess } = useStoreState(state => state.Cups);
  const { getCups, addCup } = useStoreActions(actions => actions.Cups);

  useEffect(() => {
    getCups();
  }, []);

  return (
    <Layout t="Cups">
      {!cupList ? (
        <Loading />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            <Paper padding>
              <Header h1>Ongoing Cups</Header>
              {cupList
                .filter(c => c.Finished === 0)
                .map(c => (
                  <LinkWithDesc
                    key={c.ShortName}
                    link={`/cup/${c.ShortName}`}
                    name={c.CupName}
                    desc={c.Description}
                  />
                ))}
            </Paper>
            <Paper padding top>
              <Header h1>Finished Cups</Header>
              {cupList
                .filter(c => c.Finished === 1)
                .sort((a, b) => b.CupGroupIndex - a.CupGroupIndex)
                .map(c => (
                  <LinkWithDesc
                    key={c.ShortName}
                    link={`/cup/${c.ShortName}`}
                    name={c.CupName}
                    desc={c.Description}
                  />
                ))}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Paper padding>
              <Header h1>Create new cup</Header>
              {addSuccess === '' ? (
                <AddCup add={data => addCup(data)} />
              ) : (
                <div>Cup {addSuccess} has been created successfully.</div>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default Cups;
