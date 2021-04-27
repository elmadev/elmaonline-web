import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Tabs, Tab } from '@material-ui/core';
import { useNavigate } from '@reach/router';
import Layout from 'components/Layout';
import { Star, StarBorder } from '@material-ui/icons';
import GridItem from 'components/GridItem';
import LevelpacksDetailed from './LevelpacksDetailed';
import { Switch, FormControlLabel } from '@material-ui/core';

const promote = 'Int';

const Levels = ({ tab, detailed }) => {
  const navigate = useNavigate();

  const { levelpacks, stats, favs, collections } = useStoreState(
    state => state.Levels,
  );

  const { loggedIn } = useStoreState(state => state.Login);
  const {
    getLevelpacks,
    getStats,
    addFav,
    removeFav,
    getFavs,
    getCollections,
  } = useStoreActions(actions => actions.Levels);

  useEffect(() => {
    getLevelpacks();
    getStats();
    if (loggedIn) {
      getFavs();
    }
  }, []);

  useEffect(() => {
    if (tab === 'collections') {
      getCollections();
    }
  }, [tab]);

  return (
    <Layout edge t="Levels">
      <Container>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={tab}
          onChange={(e, value) =>
            navigate(['/levels', value].filter(Boolean).join('/'))
          }
        >
          <Tab label="Packs" value="" />
          <Tab label="Collections" value="collections" />
        </Tabs>
        {!tab && (
          <>
            <SwitchWrapper>
              <FormControlLabel
                control={
                  <Switch
                    checked={detailed}
                    onChange={e =>
                      navigate(
                        e.target.checked ? '/levels/detailed' : '/levels',
                      )
                    }
                    color="primary"
                  />
                }
                label="Detailed View"
              />
            </SwitchWrapper>
            {detailed && (
              <LevelpacksDetailed levelpacks={levelpacks} stats={stats} />
            )}
            {!detailed && (
              <>
                {levelpacks.length > 0 &&
                  levelpacks.map(p => (
                    <GridItem
                      promote={p.LevelPackName === promote}
                      key={p.LevelPackIndex}
                      to={`/levels/packs/${p.LevelPackName}`}
                      name={p.LevelPackName}
                      longname={p.LevelPackLongName}
                    >
                      {loggedIn && (
                        <>
                          {p.Fav ? (
                            <StarCon
                              title="Remove favourite"
                              selected
                              onClick={() =>
                                removeFav({ LevelPackIndex: p.LevelPackIndex })
                              }
                            >
                              <Star />
                            </StarCon>
                          ) : (
                            <StarCon
                              title="Add as favourite"
                              onClick={() =>
                                addFav({ LevelPackIndex: p.LevelPackIndex })
                              }
                            >
                              <StarBorder />
                            </StarCon>
                          )}
                        </>
                      )}
                    </GridItem>
                  ))}
              </>
            )}
            <FabCon>
              <Fab
                color="primary"
                aria-label="Add"
                onClick={() => navigate(`/levels/add`)}
              >
                <AddIcon />
              </Fab>
            </FabCon>
          </>
        )}
        {tab === 'collections' && (
          <>
            {collections && (
              <>
                {collections.length > 0 &&
                  collections.map(c => (
                    <GridItem
                      to={`/levels/collections/${c.CollectionName}`}
                      name={c.CollectionName}
                      longname={c.CollectionLongName}
                      key={c.LevelPackCollectionIndex}
                    />
                  ))}
              </>
            )}
            <FabCon>
              <Fab
                color="primary"
                aria-label="Add"
                onClick={() => navigate(`/levels/collections/add`)}
              >
                <AddIcon />
              </Fab>
            </FabCon>
          </>
        )}
      </Container>
    </Layout>
  );
};

const StarCon = styled.span`
  cursor: pointer;
  position: absolute;
  top: 4px;
  right: 4px;
  svg {
    color: ${p => (p.selected ? '#e4bb24' : '#e6e6e6')};
    &:hover {
      color: ${p => (p.selected ? '#e6e6e6' : '#e4bb24')};
    }
  }
`;

const FabCon = styled.div`
  position: fixed;
  right: 30px;
  bottom: 30px;
`;

const Container = styled.div`
  padding-top: 10px;
  padding-bottom: 50px;
  overflow: hidden;
`;

const SwitchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
`;

export default Levels;
