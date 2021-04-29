import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Tabs, Tab } from '@material-ui/core';
import { useNavigate, useLocation } from '@reach/router';
import { parse } from 'query-string';
import Layout from 'components/Layout';
import { Star, StarBorder } from '@material-ui/icons';
import GridItem from 'components/GridItem';
import LevelpacksDetailed from './LevelpacksDetailed';
import Controls from './Controls';
import FavStar from './FavStar';

const promote = 'Int';

const Levels = ({ tab, detailed }) => {
  const navigate = useNavigate();

  const { levelpacks, levelpacksSorted, stats, collections } = useStoreState(
    state => state.Levels,
  );

  const { loggedIn } = useStoreState(state => state.Login);
  const {
    getLevelpacks,
    getStats,
    setSort,
    addFav,
    removeFav,
    getFavs,
    getCollections,
  } = useStoreActions(actions => actions.Levels);

  const location = useLocation();
  const urlArgs = parse(location.search);
  const sort = (urlArgs && urlArgs.sort) || '';

  useEffect(() => {
    setSort(sort);
  }, [sort]);

  useEffect(() => {
    getLevelpacks(false);
    getStats(false);

    if (loggedIn) {
      getFavs(false);
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
            <Controls detailed={detailed} sort={sort} />
            {detailed && (
              <LevelpacksDetailed
                levelpacksSorted={levelpacksSorted}
                stats={stats}
                addFav={addFav}
                removeFav={removeFav}
                loggedIn={loggedIn}
              />
            )}
            {!detailed && (
              <>
                {levelpacksSorted.length > 0 &&
                  levelpacksSorted.map(p => (
                    <GridItem
                      promote={p.LevelPackName === promote}
                      key={p.LevelPackIndex}
                      to={`/levels/packs/${p.LevelPackName}`}
                      name={p.LevelPackName}
                      longname={p.LevelPackLongName}
                    >
                      <StarCon>
                        <FavStar
                          pack={p}
                          {...{ loggedIn, addFav, removeFav }}
                        />
                      </StarCon>
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

const StarCon = styled.div`
  cursor: pointer;
  position: absolute;
  top: 4px;
  right: 4px;
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

export default Levels;
