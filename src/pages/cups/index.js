import React, { useEffect, Fragment } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import Link from 'components/Link';
import AddCup from 'components/AddCup';
import Header from 'components/Header';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
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
                  <Fragment key={c.ShortName}>
                    <Link to={`/cup/${c.ShortName}`}>
                      <CupName>{c.CupName}</CupName>
                    </Link>
                    <Description
                      dangerouslySetInnerHTML={{ __html: c.Description }}
                    />
                  </Fragment>
                ))}
            </Paper>
            <Paper padding top>
              <Header h1>Finished Cups</Header>
              {cupList
                .filter(c => c.Finished === 1)
                .map(c => (
                  <Fragment key={c.ShortName}>
                    <Link to={`/cup/${c.ShortName}`}>
                      <CupName>{c.CupName}</CupName>
                    </Link>
                    <Description
                      dangerouslySetInnerHTML={{ __html: c.Description }}
                    />
                  </Fragment>
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

const CupName = styled.div`
  font-weight: 500;
  color: ${p => p.theme.linkColor};
`;

const Description = styled.div`
  font-size: 13px;
  padding-bottom: 12px;
`;

export default Cups;
