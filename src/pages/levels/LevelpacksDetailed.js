import React from 'react';
import styled from 'styled-components';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import FavStar from './FavStar';

const formatTimeSpent = time => {
  const hours = Math.round(time / 360000);

  if (hours < 1) {
    return '<1h';
  }

  return hours.toLocaleString() + 'h';
};

const formatAttempts = num => {
  return Number(num).toLocaleString();
};

const formatPct = (num, div, precision = 2) => {
  let pct = 0;

  if (div > 0) {
    pct = Number.parseFloat((num * 100) / div);
  }

  return pct.toFixed(precision);
};

const LevelpacksDetailed = ({
  levelpacksSorted,
  stats,
  loggedIn,
  addFav,
  removeFav,
}) => {
  return (
    <Root>
      <Table>
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
        {levelpacksSorted.map(p => {
          const st = (stats && stats[p.LevelPackIndex]) || null;

          const url = `/levels/packs/${p.LevelPackName}`;

          return (
            <ListRow key={p.LevelPackIndex}>
              <ListCell to={url}>
                <ShortName>{p.LevelPackName}</ShortName>
                <LongName>{p.LevelPackLongName}</LongName>
                {!st && (
                  <NewLineWrapper>Level stats not available.</NewLineWrapper>
                )}
              </ListCell>
              <ListCell>
                <FavStar pack={p} {...{ loggedIn, addFav, removeFav }} />
              </ListCell>

              {!st && (
                <>
                  <ListCell />
                  <ListCell />
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
                          {st.CountLevelsFinished || 0}
                          {`/`}
                          {st.CountLevels || 0}
                          {` `}({Number(st.AvgKuskiPerLevel).toFixed(2)})
                        </NewLineWrapper>
                        {st.TopWrKuskis &&
                          st.TopWrKuskis.map(k => (
                            <NewLineWrapper>
                              <Kuski kuskiData={k} flag={true} />
                              {` (${st.TopWrCount}) (${formatPct(
                                st.TopWrCount,
                                st.CountLevels,
                                0,
                              )}%)`}
                            </NewLineWrapper>
                          ))}
                      </ListCell>
                      <ListCell to={url}>
                        {st.ShortestWrTime && <Time time={st.ShortestWrTime} />}
                        {` - `}
                        {st.LongestWrTime && <Time time={st.LongestWrTime} />}
                        <NewLineWrapper>
                          {st.AvgWrTime && <Time time={st.AvgWrTime} />}
                        </NewLineWrapper>
                      </ListCell>
                    </>
                  );
                })()}
            </ListRow>
          );
        })}
      </Table>
    </Root>
  );
};

const Root = styled.div``;

const Table = styled(ListContainer)`
  margin-top: 10px;
  background: white;
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
