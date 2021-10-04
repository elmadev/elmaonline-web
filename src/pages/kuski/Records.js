import React, { useState } from 'react';
import { useQueryAlt, PlayerRecords } from 'api';
import { ListContainer, ListHeader, ListRow, ListCell } from 'components/List';
import { formatLevel } from 'components/Names';
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
import { formatPct, formatTimeSpent, formatAttempts } from 'utils/format';
import { useNavigate } from '@reach/router';

// records tab content
const Records = ({ kuski, sort, recordCount }) => {
  const KuskiIndex = kuski.KuskiIndex;

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  const { isSuccess: recordsSuccess, data: records } = useQueryAlt(
    ['PlayerRecords', KuskiIndex, sort, page, pageSize],
    async () =>
      PlayerRecords(KuskiIndex, {
        sort: sort === 'TimeAsc' || sort === 'TimeDesc' ? 'Time' : sort,
        offset: page * pageSize,
        limit: pageSize,
        reverse: sort === 'TimeDesc' ? '1' : '',
      }),
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
        <table>
          <tbody>
            <tr>
              <TablePagination
                count={
                  records.length < pageSize
                    ? page * pageSize + records.length
                    : -1
                }
                rowsPerPageOptions={[25, 50, 100, 200, 500]}
                rowsPerPage={pageSize}
                page={page}
                onChangePage={(e, value) => setPage(value)}
                onChangeRowsPerPage={e => {
                  setPage(0);
                  setPageSize(e.target.value);
                }}
              />
            </tr>
          </tbody>
        </table>
        <StyledFormControl>
          <InputLabel id="records-sort">Sort By</InputLabel>
          <Select
            id="records-sort"
            value={sort}
            onChange={e => {
              navigate(`/kuskis/${kuski.Kuski}/records/${e.target.value}`);
            }}
          >
            <MenuItem value="TimeAll">Playtime (All Kuski's)</MenuItem>
            <MenuItem value="AttemptsAll">Attempts (All Kuski's)</MenuItem>
            <MenuItem value="KuskiCountAll"># Kuski's Played</MenuItem>
            <MenuItem value="LeaderCount">Leader Count</MenuItem>
            <MenuItem value="Driven">Driven</MenuItem>
            <MenuItem value="TimeDesc">Time (High)</MenuItem>
            <MenuItem value="TimeAsc">Time (Low)</MenuItem>
          </Select>
        </StyledFormControl>
      </Controls>
      <ListContainer>
        <ListHeader>
          <ListCell>Level</ListCell>
          <ListCell>Long Name</ListCell>
          <ListCell>Time</ListCell>
          <ListCell>
            Playtime <br />
            (All Kuski's)
          </ListCell>
          <ListCell>
            Attempts <br />
            (All Kuski's)
          </ListCell>
          <ListCell title="Number of kuski's that attempted the level">
            # Kuski's Played <br />
            (% Finished)
          </ListCell>
          <ListCell title="Size of the leader history">Leader Count</ListCell>
          <ListCell>Driven</ListCell>
        </ListHeader>

        {records.map(record => (
          <Record key={record.TimeIndex} record={record} />
        ))}
      </ListContainer>
    </>
  );
};

// ie. table row
const Record = ({ record }) => {
  const stats = record.LevelStatsData || {};
  const level = record.LevelData || {};

  return (
    <ListRow key={record.TimeIndex}>
      <ListCell>
        <Link to={`/levels/${level.LevelIndex}`}>
          {formatLevel(level.LevelName)}
        </Link>
      </ListCell>
      <ListCell>{level.LongName}</ListCell>
      <ListCell>
        <Time time={record.Time} />
      </ListCell>
      <ListCell>{formatTimeSpent(stats.TimeAll)}</ListCell>
      <ListCell>{formatAttempts(stats.AttemptsAll)}</ListCell>
      <ListCell>
        {stats.KuskiCountAll} (
        {formatPct(stats.KuskiCountF, stats.KuskiCountAll, 0)}%)
      </ListCell>
      <ListCell>{stats.LeaderCount}</ListCell>
      <ListCell>
        <LocalTime
          date={record.Driven}
          format="ddd D MMM YYYY HH:mm"
          parse="X"
        />
      </ListCell>
    </ListRow>
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
