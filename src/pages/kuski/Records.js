import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { parseResponse, PlayerRecords } from '../../api';
import { ListContainer, ListHeader, ListRow, ListCell } from 'components/List';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
} from '@material-ui/core';
import styled from 'styled-components';
import Loading from '../../components/Loading';
import Time from '../../components/Time';
import Link from '../../components/Link';
import LocalTime from '../../components/LocalTime';

// todo: refactor copy/pasted fn from levelpack archive (when merged)
const formatTimeSpent = time => {
  const hours = Math.round(time / 360000);

  if (hours < 1) {
    return '<1h';
  }

  return hours.toLocaleString() + 'h';
};

const Records = ({ KuskiIndex, recordCount }) => {
  const [sort, setSort] = useState('Driven');

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { isSuccess: recordsSuccess, data: records } = useQuery(
    ['PlayerRecords', KuskiIndex, sort, page, pageSize],
    parseResponse(
      PlayerRecords(KuskiIndex, {
        sort,
        offset: page * pageSize,
        limit: pageSize,
      }),
    ),
    {
      enabled: !!KuskiIndex,
    },
  );

  if (!recordsSuccess) {
    return <Loading />;
  }

  return (
    <>
      <Controls>
        <TablePagination
          count={recordCount}
          rowsPerPageOptions={[25, 50, 100, 200, 500]}
          rowsPerPage={pageSize}
          page={page}
          onChangePage={(e, value) => setPage(value)}
          onChangeRowsPerPage={e => {
            setPage(0);
            setPageSize(e.target.value);
          }}
        />
        <FormControl style={{ minWidth: 200 }}>
          <InputLabel id="records-sort">Sort By</InputLabel>
          <Select
            id="records-sort"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <MenuItem value="Driven">Driven</MenuItem>
            <MenuItem value="KuskiCountAll"># Kuski's Played</MenuItem>
            <MenuItem value="LeaderCount">Leader Count</MenuItem>
            <MenuItem value="TimeAll">Time Played</MenuItem>
          </Select>
        </FormControl>
      </Controls>
      <ListContainer>
        <ListHeader>
          <ListCell>Level</ListCell>
          <ListCell>Long Name</ListCell>
          <ListCell title="Number of kuski's that attempted the level">
            # Kuski's Finished/Played
          </ListCell>
          <ListCell title="Size of the leader history">Leader Count</ListCell>
          <ListCell>Time Played (All Kuski's)</ListCell>
          <ListCell>Driven</ListCell>
          <ListCell>Time</ListCell>
        </ListHeader>

        {records.map(record => {
          const stats = record.LevelStatsData || {};
          const level = record.LevelData || {};

          return (
            <ListRow key={record.TimeIndex}>
              <ListCell>
                <Link to={`/levels/${level.LevelIndex}`}>
                  {level.LevelName}
                </Link>
              </ListCell>
              <ListCell>{level.LongName}</ListCell>
              <ListCell>
                {stats.KuskiCountF}
                {`/`}
                {stats.KuskiCountAll}
              </ListCell>
              <ListCell>{stats.LeaderCount}</ListCell>
              <ListCell>{formatTimeSpent(stats.TimeAll)}</ListCell>
              <ListCell>
                <LocalTime
                  date={new Date(record.Driven * 1000)}
                  format="ddd D MMM YYYY HH:mm:ss"
                  parse={undefined}
                />
              </ListCell>
              <ListCell>
                <Time time={record.Time} />
              </ListCell>
            </ListRow>
          );
        })}
      </ListContainer>
    </>
  );
};

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 20px 10px;
  > * {
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
  .MuiTablePagination-root {
    padding: 0;
  }
`;

export default Records;
