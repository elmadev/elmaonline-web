import React from 'react';
import { useStoreState } from 'easy-peasy';
import styled from 'styled-components';

import Time from 'components/Time';
import Loading from 'components/Loading';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

const TotalTimes = ({ highlight, highlightWeeks }) => {
  const { totaltimes, recordsLoading } = useStoreState(
    state => state.LevelPack,
  );

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
        {recordsLoading && <Loading />}
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
