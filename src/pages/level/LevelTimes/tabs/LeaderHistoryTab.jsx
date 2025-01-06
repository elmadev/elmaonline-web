import { useStoreActions, useStoreState } from 'easy-peasy';
import React, { useEffect } from 'react';
import LeaderHistory from 'components/LeaderHistory';

const LeaderHistoryTab = ({ LevelIndex }) => {
  const { leaderHistory, leaderHistoryLoading } = useStoreState(
    state => state.Level,
  );

  const { getLeaderHistory } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    if (leaderHistory.length === 0 || leaderHistoryLoading !== LevelIndex) {
      getLeaderHistory({ LevelIndex });
    }
  }, []);

  return (
    <LeaderHistory
      allFinished={leaderHistory}
      loading={leaderHistoryLoading !== LevelIndex}
    />
  );
};

export default LeaderHistoryTab;
