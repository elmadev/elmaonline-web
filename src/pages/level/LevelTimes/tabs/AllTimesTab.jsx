import TimeTable from '../../TimeTable';
import React, { useEffect } from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

const AllTimesTab = ({ LevelIndex }) => {
  const { allLoading, allfinished, battlesForLevel } = useStoreState(
    state => state.Level,
  );

  const { getAllfinished } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    if (allfinished.length === 0 || allLoading !== LevelIndex) {
      getAllfinished(LevelIndex);
    }
  }, []);

  return (
    <TimeTable
      loading={allLoading !== LevelIndex}
      data={allfinished}
      latestBattle={battlesForLevel[0]}
    />
  );
};

export default AllTimesTab;
