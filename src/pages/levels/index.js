import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Fab } from '@material-ui/core';
import { Add as AddIcon } from '@material-ui/icons';
import { Tabs, Tab } from '@material-ui/core';
import { useNavigate, useLocation } from '@reach/router';
import { parse } from 'query-string';
import Layout from 'components/Layout';
import GridItem from 'components/GridItem';
import Popularity from 'components/Popularity';
import LevelpacksDetailed from './LevelpacksDetailed';
import Controls from './Controls';
import FavStar from './FavStar';

const promote = 'Int';

const Levels = ({ tab, detailed }) => {
  const navigate = useNavigate();

  const { levelpacksSorted, stats, collections } = useStoreState(
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
                  levelpacksSorted.map(p => {
                    const s = stats[p.LevelPackIndex] ?? {};

                    const widthPct = (s.NormalizedPopularity || 0) * 100;
                    const avg = (s.AvgKuskiPerLevel || 0).toFixed(1);
                    const count = s.LevelCountAll || 0;

                    return (
                      <GridItem2
                        promote={p.LevelPackName === promote}
                        key={p.LevelPackIndex}
                        to={`/levels/packs/${p.LevelPackName}`}
                        name={p.LevelPackName}
                        longname={p.LevelPackLongName}
                        afterName={` (${count} levels)`}
                        afterLongname={
                          <Popularity2
                            title={`Avg. number of kuski's played per level: ${avg}`}
                            widthPct={widthPct}
                            after={<span>{avg}</span>}
                          />
                        }
                      >
                        <StarCon>
                          <FavStar
                            pack={p}
                            {...{ loggedIn, addFav, removeFav }}
                          />
                        </StarCon>
                      </GridItem2>
                    );
                  })}
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

const GridItem2 = styled(GridItem)`
  &:hover {
    .pop-bar-1 {
      background: ${p => p.theme.paperBackground};
    }
  }
`;

const Popularity2 = styled(Popularity)`
  margin-top: 20px;
  width: 100%;
  max-width: 320px;
  .pop-after {
    min-width: 24px;
    span {
      font-size: 12px;
    }
  }
`;

const StarCon = styled.div`
  cursor: pointer;
  position: absolute;
  top: 12px;
  right: 13px;
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
