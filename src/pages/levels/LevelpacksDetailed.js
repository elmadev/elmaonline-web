import React from 'react';
import styled from 'styled-components';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import { FixedSizeList as List } from 'react-window';
import useElementSize from 'utils/useWindowSize';
import FavStar from './FavStar';
import { formatTimeSpent, formatAttempts, formatPct } from 'utils/format';

const LevelpacksDetailed = ({
  levelpacksSorted,
  stats,
  loggedIn,
  addFav,
  removeFav,
}) => {
  const windowSize = useElementSize();
  const listHeight = windowSize.height - 264;
  return (
    <Root>
      <Table flex direction="column">
        <ListHeader>
          <ListCell>
            <NewLineWrapper>Pack</NewLineWrapper>
            <NewLineWrapper>Long Name</NewLineWrapper>
          </ListCell>
          <ListCell>
            <NewLineWrapper>Favorite</NewLineWrapper>
          </ListCell>
          <ListCell>
            <NewLineWrapper># Attempts</NewLineWrapper>
            <NewLineWrapper>Total Time Played</NewLineWrapper>
          </ListCell>
          <ListCell>
            <NewLineWrapper>Attempts %</NewLineWrapper>
            <NewLineWrapper>Time %</NewLineWrapper>
            <NewLineWrapper>(Dead/Esc/Finished)</NewLineWrapper>
          </ListCell>
          <ListCell>
            <NewLineWrapper># Finished / # Levels</NewLineWrapper>
            <NewLineWrapper title="The average number of kuski's that played each level. A good measure of overall popularity.">
              (Avg. Kuski Count)
            </NewLineWrapper>
            <NewLineWrapper>Top Record Holder(s)</NewLineWrapper>
          </ListCell>
          <ListCell>
            <NewLineWrapper title="The shortest and longest record time for levels in the pack.">
              Shortest - Longest Record
            </NewLineWrapper>
            <NewLineWrapper title="The average time of first place finished for all levels in the pack.">
              Avg. Record Time
            </NewLineWrapper>
          </ListCell>
        </ListHeader>
        <List
          height={listHeight}
          itemCount={levelpacksSorted.length}
          itemSize={63}
        >
          {({ index, style }) => {
            const p = levelpacksSorted[index];
            const st = (stats && stats[p.LevelPackIndex]) || null;

            const url = `/levels/packs/${p.LevelPackName}`;

            const topRecordPct =
              st && formatPct(st.TopRecordCount, st.LevelCountAll, 0);

            return (
              <div style={style} key={p.LevelPackIndex}>
                <Row>
                  <ListCell to={url}>
                    <ShortName>{p.LevelPackName}</ShortName>
                    <LongName>{p.LevelPackLongName}</LongName>
                  </ListCell>
                  <ListCell>
                    <FavStar pack={p} {...{ loggedIn, addFav, removeFav }} />
                  </ListCell>

                  {!st && (
                    <>
                      <ListCell />
                      <ListCell>
                        <NewLineWrapper>
                          Level stats not available.
                        </NewLineWrapper>
                      </ListCell>
                      <ListCell />
                      <ListCell />
                    </>
                  )}

                  {st &&
                    (() => {
                      const timesPct = [
                        ['D', formatPct(st.TimeD, st.TimeAll)],
                        ['E', formatPct(st.TimeE, st.TimeAll)],
                        ['F', formatPct(st.TimeF, st.TimeAll)],
                      ];

                      const attemptsPct = [
                        ['D', formatPct(st.AttemptsD, st.AttemptsAll)],
                        ['E', formatPct(st.AttemptsE, st.AttemptsAll)],
                        ['F', formatPct(st.AttemptsF, st.AttemptsAll)],
                      ];

                      return (
                        <>
                          <ListCell to={url}>
                            <NewLineWrapper>
                              <span title={st.AttemptsAll.toLocaleString()}>
                                {formatAttempts(st.AttemptsAll)}
                              </span>
                            </NewLineWrapper>
                            <NewLineWrapper>
                              {formatTimeSpent(st.TimeAll)}
                            </NewLineWrapper>
                          </ListCell>
                          <ListCell to={url}>
                            <NewLineWrapper>
                              {attemptsPct[0][1]}
                              {` / `}
                              {attemptsPct[1][1]}
                              {` / `}
                              {attemptsPct[2][1]}
                            </NewLineWrapper>
                            <NewLineWrapper>
                              {timesPct[0][1]}
                              {` / `}
                              {timesPct[1][1]}
                              {` / `}
                              {timesPct[2][1]}
                            </NewLineWrapper>
                          </ListCell>
                          <ListCell>
                            <NewLineWrapper>
                              {st.LevelCountF || 0}
                              {`/`}
                              {st.LevelCountAll || 0}
                              {` `}({Number(st.AvgKuskiPerLevel).toFixed(2)})
                            </NewLineWrapper>
                            {st.TopRecordKuskis && (
                              <NewLineWrapper>
                                {st.TopRecordKuskis.map(k => (
                                  <>
                                    <Kuski
                                      key={k.KuskiIndex}
                                      kuskiData={k}
                                      flag={true}
                                    />{' '}
                                  </>
                                ))}
                                {` (${st.TopRecordCount}) (${topRecordPct}%)`}
                              </NewLineWrapper>
                            )}
                          </ListCell>
                          <ListCell to={url}>
                            {st.MinRecordTime && (
                              <Time time={st.MinRecordTime} />
                            )}
                            {` - `}
                            {st.MaxRecordTime && (
                              <Time time={st.MaxRecordTime} />
                            )}
                            <NewLineWrapper>
                              {st.AvgRecordTime && (
                                <Time time={st.AvgRecordTime} />
                              )}
                            </NewLineWrapper>
                          </ListCell>
                        </>
                      );
                    })()}
                </Row>
              </div>
            );
          }}
        </List>
      </Table>
    </Root>
  );
};

const Root = styled.div``;

const Table = styled(ListContainer)`
  margin-top: 10px;
  background: ${p => p.theme.paperBackground};
`;

const Row = styled(ListRow)`
  height: 63px;
  overflow-y: hidden;
  :hover {
    height: auto;
    overflow-y: visible;
    z-index: 10;
    position: relative;
  }
`;

const NewLineWrapper = styled.div`
  margin-bottom: 3px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ShortName = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${p => p.theme.linkColor};
`;

const LongName = styled.div`
  font-size: 13px;
`;

export default LevelpacksDetailed;
