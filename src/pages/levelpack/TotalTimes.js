import React, { useEffect, useRef } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';

import Time from 'components/Time';
import Loading from 'components/Loading';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

const TotalTimes = ({ highlight, highlightWeeks, levelPackIndex }) => {
  const {
    totaltimes,
    totaltimesLoading,
    lastPack,
    settings: { showLegacy },
  } = useStoreState(state => state.LevelPack);
  const { getTotalTimes } = useStoreActions(actions => actions.LevelPack);
  const lastShowLegacy = useRef(showLegacy);

  useEffect(() => {
    if (lastPack !== levelPackIndex) {
      getTotalTimes({ levelPackIndex, eolOnly: showLegacy ? 0 : 1 });
    }
  }, [levelPackIndex]);

  useEffect(() => {
    if (lastShowLegacy.current !== showLegacy) {
      lastShowLegacy.current = showLegacy;
      getTotalTimes({ levelPackIndex, eolOnly: showLegacy ? 0 : 1 });
    }
  }, [showLegacy]);

  return (
    <>
      <h2>Total Times</h2>
      <ListContainer>
        <ListHeader>
          <ListCell width={70}>#</ListCell>
          <ListCell width={320}>Player</ListCell>
          <ListCell width={200}>Total Time</ListCell>
          <ListCell />
        </ListHeader>
        {totaltimesLoading && <Loading />}
        {totaltimes.length > 0 && (
          <>
            {totaltimes
              .sort((a, b) => a.tt - b.tt)
              .map((r, no) => (
                <TimeRow key={r.KuskiIndex}>
                  <ListCell width={70}>{no + 1}</ListCell>
                  <ListCell width={320}>{r.KuskiData.Kuski}</ListCell>
                  <ListCell
                    highlight={r.TimeIndex >= highlight[highlightWeeks]}
                  >
                    <Time time={r.tt} />
                  </ListCell>
                  <ListCell />
                </TimeRow>
              ))}
          </>
        )}
      </ListContainer>
    </>
  );
};

const TimeRow = styled(ListRow)`
  display: table-row;
  color: inherit;
  font-size: 14px;
  padding: 10px;
`;

export default TotalTimes;
