import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { TablePagination } from '@material-ui/core';
import RecListItem from 'components/RecListItem';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';

export default function Replays({
  defaultPage = 0,
  defaultPageSize = 25,
  showPagination,
  showTags,
}) {
  const [page, setPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { replays } = useStoreState(state => state.ReplayList);
  const { getReplays } = useStoreActions(actions => actions.ReplayList);

  const columns = ['Uploaded', 'Replay', 'Level', 'Time', 'By'];
  if (showTags) {
    columns.push('Tags');
  }

  useEffect(() => {
    getReplays({ page, pageSize });
  }, [page, pageSize]);

  const handleChangeRowsPerPage = event => {
    setPage(0);
    setPageSize(event.target.value);
  };

  if (!replays) {
    return null;
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListCell>Uploaded</ListCell>
          <ListCell>Replay</ListCell>
          <ListCell>Level</ListCell>
          <ListCell right>Time</ListCell>
          <ListCell>By</ListCell>
          {showTags && <ListCell>Tags</ListCell>}
        </ListHeader>
        {!replays ? (
          <ListRow>
            <ListCell />
          </ListRow>
        ) : (
          replays.rows.map(i => (
            <RecListItem key={i.ReplayIndex} replay={i} columns={columns} />
          ))
        )}
      </ListContainer>
      {showPagination && (
        <TablePagination
          style={{ width: '600px' }}
          component="div"
          count={replays.count}
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
