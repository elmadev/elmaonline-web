import React from 'react';
import PropTypes from 'prop-types';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import Time from 'components/Time';
import Loading from 'components/Loading';
import { sumBy, round, maxBy, minBy } from 'lodash';
import LocalTime from 'components/LocalTime';
import styled from 'styled-components';

const finishedTypes = {
  B: 'Finished (Apple Bug)',
  D: 'Dead',
  E: 'Escaped',
  F: 'Finished',
  S: 'Spied',
  X: 'Cheated',
};

const StatsTable = ({ data, loading }) => {
  if (data.length === 0) {
    return <Container>You have not played this level yet.</Container>;
  }
  if (loading) return <Loading />;

  const getTotalRunCount = () => {
    return sumBy(data, 'RunCount');
  };

  const getRunCountPercentage = RunCount => {
    return round((RunCount / getTotalRunCount()) * 100, 2);
  };

  const getTotalTimeSum = () => {
    return sumBy(data, row => parseInt(row.TimeSum, 10));
  };

  const getTimeSumPercentage = TimeSum => {
    return round((TimeSum / getTotalTimeSum()) * 100, 2);
  };

  const lastPlayed = () => {
    return maxBy(
      data.filter(f => f.Finished !== 'S'),
      'LastPlayed',
    ).LastPlayed;
  };

  const firstPlayed = () => {
    return minBy(
      data.filter(f => f.Finished !== 'S'),
      'FirstPlayed',
    ).FirstPlayed;
  };

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListCell right width={100}>
            Type
          </ListCell>
          <ListCell right width={200}>
            Total runs
          </ListCell>
          <ListCell right width={200}>
            Time played
          </ListCell>
          <ListCell right width={200}>
            Total runs %
          </ListCell>
          <ListCell right width={200}>
            Time played %
          </ListCell>
        </ListHeader>
        <ListRow>
          <ListCell right width={100}>
            All
          </ListCell>
          <ListCell right width={200}>
            {getTotalRunCount()}
          </ListCell>
          <ListCell right width={200}>
            {getTotalTimeSum() !== 0 && <Time time={getTotalTimeSum()} />}
          </ListCell>
          <ListCell />
          <ListCell />
        </ListRow>
        {data.map(row => {
          return (
            <ListRow>
              <ListCell right width={100}>
                {finishedTypes[row.Finished]}
              </ListCell>
              <ListCell right width={200}>
                {row.RunCount}
              </ListCell>
              <ListCell right width={200}>
                {row.TimeSum !== 0 && <Time time={row.TimeSum} />}
              </ListCell>
              <ListCell right width={200}>
                {getRunCountPercentage(row.RunCount) || null}
              </ListCell>
              <ListCell right width={200}>
                {getTimeSumPercentage(row.TimeSum) || null}
              </ListCell>
            </ListRow>
          );
        })}
      </ListContainer>
      <FirstLast>
        First played:{' '}
        <LocalTime
          date={firstPlayed()}
          format="ddd D MMM YYYY HH:mm:ss"
          parse="YYYY-MM-DDTHH:mm:ss.SSSZ"
        />
      </FirstLast>
      <FirstLast>
        Last played:{' '}
        <LocalTime
          date={lastPlayed()}
          format="ddd D MMM YYYY HH:mm:ss"
          parse="YYYY-MM-DDTHH:mm:ss.SSSZ"
        />
      </FirstLast>
    </>
  );
};

StatsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const Container = styled.div`
  padding: 20px;
`;

const FirstLast = styled.div`
  font-size: 14px;
  padding: 10px;
  padding-bottom: 0;
`;

export default StatsTable;
