import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';
import { forEach } from 'lodash';
import { Paper } from 'components/Paper';
import { Row } from 'components/Containers';
import { orderBy } from 'lodash';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@material-ui/core';
import { parseTime } from 'utils/recTime';
import formatDuration from 'date-fns/formatDuration';

const formatTimeSpent = time => {
  const hours = Number(time / 36000).toFixed(0);

  const h = Number(hours).toLocaleString();

  return `${h}`;
};

const formatAttempts = num => {
  if (num > 1000000) {
    return '' + Number.parseFloat(num / 1000000).toFixed(1) + 'M';
  }

  if (num > 10000) {
    return '' + Number.parseFloat(Math.floor(num / 1000)).toFixed(0) + 'k';
  }

  return num.toLocaleString();
};

const toPct = (num, precision = 2) => {
  return Number.parseFloat(num * 100).toFixed(precision);
};

const sortPacks = (packs, sort) => {
  console.log('sort packs', 1);
  if (!sort) {
    return packs;
  }

  console.log('sort packs', 2);

  const ret = JSON.parse(JSON.stringify(packs));

  return ret;

  if (sort === '') {
  }
};

const LevelpacksDetailed = ({ levelpacks, stats }) => {
  const [sort, setSort] = useState('');

  const sorted = useMemo(() => sortPacks(levelpacks, sort), [
    sort,
    JSON.stringify(levelpacks),
  ]);

  return (
    <Root>
      <Grid container justify="flex-end" className="controls">
        <FormControl style={{ minWidth: 175 }}>
          <InputLabel id="levelpack-sort">Sort By</InputLabel>
          <Select
            id="levelpack-sort"
            value={sort}
            onChange={e => {
              setSort(e.target.value);
            }}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="levels"># Levels</MenuItem>
            <MenuItem value="attempts"># Attempts</MenuItem>
            <MenuItem value="time">Time Spent</MenuItem>
            <MenuItem value="timePctF">Time % Finished</MenuItem>
            <MenuItem value="timePctE">Time % Escaped</MenuItem>
            <MenuItem value="timePctD">Time % Dead</MenuItem>
            <MenuItem value="lengthMin">Shortest Level</MenuItem>
            <MenuItem value="lengthAvg">Average Level Time</MenuItem>
            <MenuItem value="lengthMax">Longest Level</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Table>
        <ListHeader>
          <ListCell>Pack</ListCell>
          <ListCell>
            <NewLineWrapper>Attempts</NewLineWrapper>
            <NewLineWrapper>Time Spent (hours)</NewLineWrapper>
          </ListCell>
          <ListCell>
            Time %
            <br />
            (Dead/Esc/Finished)
          </ListCell>
          <ListCell>Most Records</ListCell>
          <ListCell>
            <NewLineWrapper>Min/Max Time</NewLineWrapper>
            <NewLineWrapper>Avg. Level Time</NewLineWrapper>
          </ListCell>
        </ListHeader>
        {sorted.map(p => {
          const st = (stats && stats[p.LevelPackIndex]) || null;

          const url = `/levels/packs/${p.LevelPackName}`;

          const countUnfinished = st
            ? st.CountLevels - st.CountLevelsFinished
            : 0;

          return (
            <ListRow>
              <ListCell to={url}>
                {p.LevelPackName}
                <br />
                {p.LevelPackLongName}
                {st && (
                  <>
                    <NewLineWrapper>
                      {st.CountLevels || 0} Levels
                    </NewLineWrapper>
                    {countUnfinished > 0 && (
                      <NewLineWrapper>
                        ({countUnfinished} Unfinished)
                      </NewLineWrapper>
                    )}
                  </>
                )}
                {!st && (
                  <NewLineWrapper>Level stats not available.</NewLineWrapper>
                )}
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
                    ['D', st.TimeAll > 0 ? toPct(st.TimeD / st.TimeAll) : 0],
                    ['E', st.TimeAll > 0 ? toPct(st.TimeE / st.TimeAll) : 0],
                    ['F', st.TimeAll > 0 ? toPct(st.TimeF / st.TimeAll) : 0],
                  ];

                  const TopRecordPct =
                    st.CountLevels > 0 ? st.TopWrCount / st.CountLevels : 0;

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
                        {timesPct[0][1]}
                        {` / `}
                        {timesPct[1][1]}
                        {` / `}
                        {timesPct[2][1]}
                      </ListCell>
                      <ListCell>
                        {st.TopWrKuskis &&
                          st.TopWrKuskis.map(k => (
                            <NewLineWrapper>
                              <Kuski kuskiData={k} flag={true} />
                              {` `}({st.TopWrCount}){` `}(
                              {toPct(TopRecordPct, 0)}
                              %)
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

export default LevelpacksDetailed;
