import React from 'react';
import { useStoreState } from 'easy-peasy';
import Loading from 'components/Loading';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';

const Kinglist = ({ highlight, highlightWeeks }) => {
  const { kinglist, recordsLoading } = useStoreState(state => state.LevelPack);

  return (
    <>
      <h2>Kinglist</h2>
      <ListContainer>
        <ListHeader>
          <ListCell width={70}>#</ListCell>
          <ListCell width={320}>Player</ListCell>
          <ListCell width={200}>Points</ListCell>
          <ListCell />
        </ListHeader>
        {recordsLoading && <Loading />}
        {kinglist.length > 0 && (
          <>
            {kinglist
              .sort((a, b) => b.points - a.points)
              .map((r, no) => (
                <ListRow key={r.KuskiIndex}>
                  <ListCell width={70}>{no + 1}</ListCell>
                  <ListCell width={320}>{r.KuskiData.Kuski}</ListCell>
                  <ListCell
                    width={180}
                    highlight={r.TimeIndex >= highlight[highlightWeeks]}
                  >
                    {r.points}
                  </ListCell>
                  <ListCell />
                </ListRow>
              ))}
          </>
        )}
      </ListContainer>
    </>
  );
};

export default Kinglist;
