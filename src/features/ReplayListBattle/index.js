import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { TablePagination } from '@material-ui/core';
import subYears from 'date-fns/subYears';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import { toServerTime } from 'utils/time';
import Kuski from 'components/Kuski';
import { Level, BattleType } from 'components/Names';
import Time from 'components/Time';
import LocalTime from 'components/LocalTime';
import Link from 'components/Link';
import { sortResults } from 'utils/battle';
import { useNavigate } from '@reach/router';

export default function ReplayListBattle({
  defaultPage = 0,
  defaultPageSize = 25,
  showPagination,
}) {
  const navigate = useNavigate();
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { battles } = useStoreState(state => state.ReplayList);
  const { getBattles } = useStoreActions(actions => actions.ReplayList);

  const paginateBattles = (battleList, page, pageSize) => {
    return battleList
      .filter(r => r.RecFileName !== null)
      .slice(page * pageSize, page * pageSize + pageSize);
  };

  const getWinResult = (results, battleType) =>
    results.sort(sortResults(battleType))[0];

  useEffect(() => {
    const start = subYears(new Date(), 1);
    const end = new Date();
    if (!battles)
      getBattles({
        start: toServerTime(start).format(),
        end: toServerTime(end).format(),
        limit: 200,
      });
  }, [page, pageSize]);

  const handleChangeRowsPerPage = event => {
    setPage(0);
    setPageSize(event.target.value);
  };

  if (!battles) {
    return null;
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListCell>Started</ListCell>
          <ListCell>Level</ListCell>
          <ListCell>Type</ListCell>
          <ListCell>Designer</ListCell>
          <ListCell right>Result</ListCell>
          <ListCell>Kuski</ListCell>
        </ListHeader>
        {!battles ? (
          <ListRow>
            <ListCell />
          </ListRow>
        ) : (
          paginateBattles(battles, page, pageSize).map(i => {
            return (
              <ListRow
                onClick={() => {
                  navigate(`/battles/${i.BattleIndex}`);
                }}
              >
                <ListCell width={120}>
                  <Link to={`/battles/${i.BattleIndex}`}>
                    <LocalTime
                      date={i.Started}
                      format={`DD MMM HH:mm`}
                      parse="X"
                    />
                  </Link>
                </ListCell>
                <ListCell width={100}>
                  <Level LevelIndex={i.LevelIndex} LevelData={i.LevelData} />
                </ListCell>
                <ListCell width={100}>
                  <BattleType type={i.BattleType} />
                </ListCell>
                <ListCell width={120}>
                  <Kuski kuskiData={i.KuskiData} />
                </ListCell>
                <ListCell right>
                  <Time
                    apples={getWinResult(i.Results, i.BattleType).Apples}
                    time={getWinResult(i.Results, i.BattleType).Time}
                  />
                </ListCell>
                <ListCell width={100}>
                  <Link to={`/battles/${i.BattleIndex}`}>
                    <Kuski
                      kuskiData={
                        getWinResult(i.Results, i.BattleType).KuskiData
                      }
                    />
                  </Link>
                </ListCell>
              </ListRow>
            );
          })
        )}
      </ListContainer>
      {showPagination && (
        <TablePagination
          style={{ width: '600px' }}
          component="div"
          count={battles.filter(r => r.RecFileName !== null).length}
          rowsPerPage={pageSize}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={(e, newPage) => setPage(newPage)}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </>
  );
}
