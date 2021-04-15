/* eslint-disable no-unreachable */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListRow, ListCell, ListContainer } from 'components/List';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Kuski from 'components/Kuski';
import SortableList from 'components/SortableList';
import Loading from 'components/Loading';
import styled from 'styled-components';
import { FixedSizeList as List } from 'react-window';

const RankingTable = ({
  battleType,
  minPlayed,
  period,
  tableIndex,
  periodType,
}) => {
  const { rankingData, loading } = useStoreState(state => state.RankingTable);
  const { getRankingData } = useStoreActions(actions => actions.RankingTable);
  useEffect(() => {
    getRankingData({ period, periodType });
  }, [period, periodType]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sort, setSort] = useState(`Ranking${battleType}`);
  const Points = `Points${battleType}`;
  const Ranking = `Ranking${battleType}`;
  const Wins = `Wins${battleType}`;
  const Designed = `Designed${battleType}`;
  const Played = `Played${battleType}`;
  const Played5 = `Played5${battleType}`;
  const FilteredRanking =
    rankingData.length > 0
      ? rankingData.filter(r => r[Played] > minPlayed)
      : null;
  if (FilteredRanking) {
    FilteredRanking.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sort] - b[sort];
      }
      return b[sort] - a[sort];
    });
  }
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {FilteredRanking && (
        <>
          <SortableList
            headers={[
              { name: '#', sort: false, width: 40 },
              { name: 'Player', sort: false, width: 0 },
              { name: 'Ranking', sort: true, width: 76, right: 1 },
              { name: 'Points', sort: true, width: 76, right: 1 },
              { name: 'Wins', sort: true, width: 76, right: 1 },
              { name: 'Win %', sort: false, width: 76, right: 1 },
              { name: 'Designed', sort: true, width: 76, right: 1 },
              { name: 'Played', sort: true, width: 93, right: 1 },
            ]}
            sort={s => {
              setSortOrder(s.sort);
              setSort(`${s.header}${battleType}`);
            }}
            defaultSort="Ranking"
          />
          <ListContainer flex>
            <List height={400} itemCount={FilteredRanking.length} itemSize={40}>
              {({ index, style }) => {
                const i = FilteredRanking[index];
                return (
                  <div style={style} key={i[tableIndex]}>
                    <ListRow>
                      <ListCell width={40}>{index + 1}.</ListCell>
                      <ListCell>
                        <Kuski kuskiData={i.KuskiData} team flag />
                      </ListCell>
                      <ListCell right width={76}>
                        {parseFloat(i[Ranking]).toFixed(2)}
                      </ListCell>
                      <ListCell right width={76}>
                        {i[Points]}
                      </ListCell>
                      <ListCell right width={76}>
                        {i[Wins]}
                      </ListCell>
                      <ListCell right width={76}>
                        {parseFloat((i[Wins] * 100) / i[Played5]).toFixed(2)}
                      </ListCell>
                      <ListCell right width={76}>
                        {i[Designed]}
                      </ListCell>
                      <ListCell right width={76}>
                        {i[Played]}
                      </ListCell>
                    </ListRow>
                  </div>
                );
              }}
            </List>
            <Amount>Players: {FilteredRanking.length}</Amount>
          </ListContainer>
        </>
      )}
    </>
  );
};

const Amount = styled.div`
  padding: ${p => p.theme.padSmall};
  padding-top: ${p => p.theme.padLarge};
  height: 20px;
`;

RankingTable.propTypes = {
  battleType: PropTypes.string.isRequired,
  minPlayed: PropTypes.number,
  period: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  tableIndex: PropTypes.string.isRequired,
  periodType: PropTypes.string.isRequired,
};

RankingTable.defaultProps = {
  minPlayed: 10,
};

export default RankingTable;
