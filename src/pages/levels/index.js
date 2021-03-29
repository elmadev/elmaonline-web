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

const promote = 'Int';

const Levels = ({ tab }) => {
  const navigate = useNavigate();
  const [packs, setPacks] = useState([]);

  const { levelpacks, favs, collections } = useStoreState(
    state => state.Levels,
  );
  const { loggedIn } = useStoreState(state => state.Login);
  const {
    getLevelpacks,
    addFav,
    removeFav,
    getFavs,
    getCollections,
  } = useStoreActions(actions => actions.Levels);

  useEffect(() => {
    getLevelpacks();
    if (loggedIn) {
      getFavs();
    }
  }, []);

  useEffect(() => {
    if (tab === 'collections') {
      getCollections();
    }
  }, [tab]);

  useEffect(() => {
    if (levelpacks.length > 0) {
      if (loggedIn) {
        setPacks(
          levelpacks.map(lp => {
            if (loggedIn && favs) {
              if (
                favs.findIndex(f => f.LevelPackIndex === lp.LevelPackIndex) > -1
              ) {
                return { ...lp, Fav: true };
              }
            }
            return { ...lp, Fav: false };
          }),
        );
      } else {
        setPacks(levelpacks);
      }
    }
  }, [favs, levelpacks]);

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
            {packs.length > 0 &&
              packs
                .sort((a, b) => {
                  if (a.LevelPackName === promote) return -1;
                  if (b.LevelPackName === promote) return 1;
                  if (a.Fav !== b.Fav) {
                    if (a.Fav) return -1;
                    if (b.Fav) return 1;
                  }
                  return a.LevelPackName.toLowerCase().localeCompare(
                    b.LevelPackName.toLowerCase(),
                  );
                })
                .map(p => (
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
  padding-bottom: 50px;
  overflow: hidden;
`;

export default Levels;
