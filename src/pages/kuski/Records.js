import React, { useState } from 'react';
import { useQueryAlt, PlayerRecords } from 'api';
import { ListContainer, ListHeader, ListRow, ListCell } from 'components/List';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
} from '@material-ui/core';
import styled from 'styled-components';
import Loading from 'components/Loading';
import Time from 'components/Time';
import Link from 'components/Link';
import LocalTime from 'components/LocalTime';
import { formatTimeSpent } from '../../utils/format';

// ie. table row
const Record = ({ record }) => {
  const stats = record.LevelStatsData || {};
  const level = record.LevelData || {};

  return (
    <ListRow key={record.TimeIndex}>
      <ListCell>
        <Link to={`/levels/${level.LevelIndex}`}>{level.LevelName}</Link>
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
};

// records tab content
const Records = ({ KuskiIndex, recordCount }) => {
  const [sort, setSort] = useState('Driven');

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { isSuccess: recordsSuccess, data: records } = useQueryAlt(
    ['PlayerRecords', KuskiIndex, sort, page, pageSize],
    async () =>
      PlayerRecords(KuskiIndex, {
        sort,
        offset: page * pageSize,
        limit: pageSize,
      }),
    {
      enabled: !!KuskiIndex,
      staleTime: 60000,
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
        <StyledFormControl>
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
        </StyledFormControl>
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

        {records.map(record => (
          <Record record={record} />
        ))}
      </ListContainer>
    </>
  );
};

const StyledFormControl = styled(FormControl)`
  min-width: 200px !important;
`;

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
