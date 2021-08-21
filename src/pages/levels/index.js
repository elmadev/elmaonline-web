import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Add as AddIcon } from '@material-ui/icons';
import { Tabs, Tab, Fab } from '@material-ui/core';
import { useNavigate, useLocation } from '@reach/router';
import { VariableSizeGrid as Grid } from 'react-window';
import { parse } from 'query-string';
import Layout from 'components/Layout';
import GridItem from 'components/GridItem';
import Popularity from 'components/Popularity';
import useElementSize from 'utils/useWindowSize';
import LevelpacksDetailed from './LevelpacksDetailed';
import Controls from './Controls';
import FavStar from './FavStar';

const Levels = ({ tab, detailed }) => {
  const GridRef = useRef();
  const navigate = useNavigate();
  const windowSize = useElementSize();
  const listHeight = windowSize.height - 160;
  const listWidth = windowSize.width - 250;

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
    if (GridRef?.current) {
      GridRef.current.resetAfterIndices({
        columnIndex: 0,
        rowIndex: 0,
        shouldForceUpdate: true,
      });
    }
  }, [listWidth]);

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
                {levelpacksSorted.length > 0 && (
                  <Grid
                    ref={GridRef}
                    columnCount={5}
                    columnWidth={i => (listWidth - 20) / 5}
                    height={listHeight}
                    rowCount={Math.floor(levelpacksSorted.length / 5) + 1}
                    rowHeight={i => 100}
                    width={listWidth}
                  >
                    {({ columnIndex, rowIndex, style }) => {
                      const index = rowIndex * 5 + (columnIndex + 1) - 1;
                      const p = levelpacksSorted[index];
                      if (!p) {
                        return <GridItem2 full></GridItem2>;
                      }
                      const s = stats[p.LevelPackIndex] ?? {};

                      const widthPct = (s.NormalizedPopularity || 0) * 100;
                      const avg = (s.AvgKuskiPerLevel || 0).toFixed(1);
                      const count = s.LevelCountAll || 0;

                      return (
                        <div style={style} key={p.LevelPackIndex}>
                          <GridItem2
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
                        </div>
                      );
                    }}
                  </Grid>
                )}
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
  width: 100%;
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
  overflow: hidden;
`;

export default Levels;
