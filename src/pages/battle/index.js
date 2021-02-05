import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import { groupBy, mapValues, sumBy, filter } from 'lodash';
import Layout from 'components/Layout';
import styled from 'styled-components';
import { battleStatus } from 'utils/battle';
import RecView from './RecView';
import RightBarContainer from './RightBarContainer';
import LevelStatsContainer from './LevelStatsContainer';

const runData = runs => {
  if (runs.multi === 0) {
    const kuskiRuns = groupBy(runs.rows, 'KuskiIndex');
    const runStats = mapValues(kuskiRuns, (value, key) => {
      return {
        KuskiIndex: key,
        Apples: sumBy(value, 'Apples'),
        Finishes: filter(value, { Finished: 'F' }).length,
        PlayTime: sumBy(value, 'Time'),
      };
    });

    if (runs.rows[0]) runStats.BattleIndex = runs.rows[0].BattleIndex;
    return runStats;
  }
  const kuskiRuns = groupBy(runs.rows, 'KuskiIndex1');
  const runStats = mapValues(kuskiRuns, (value, key) => {
    return {
      KuskiIndex: key,
      Apples: sumBy(value, 'Apples'),
      Finishes: filter(value, { Finished: 'F' }).length,
      PlayTime: sumBy(value, 'Time'),
    };
  });
  if (runs.rows[0]) runStats.BattleIndex = runs.rows[0].BattleIndex;
  return runStats;
};

const Battle = props => {
  let runStats = null;
  const { BattleIndex } = props;
  const {
    allBattleTimes,
    battle,
    rankingHistory,
    allBattleRuns,
  } = useStoreState(state => state.Battle);
  const {
    getAllBattleTimes,
    getBattle,
    getRankingHistoryByBattle,
    getAllBattleRuns,
  } = useStoreActions(state => state.Battle);

  useEffect(() => {
    runStats = null;
    getAllBattleTimes(BattleIndex);
    getAllBattleRuns(BattleIndex);
    getBattle(BattleIndex);
    getRankingHistoryByBattle(BattleIndex);
  }, [BattleIndex]);

  if (allBattleRuns !== null) runStats = runData(allBattleRuns);

  const isWindow = typeof window !== 'undefined';

  return (
    <Layout>
      <MainContainer>
        {battle ? (
          <RecView
            isWindow={isWindow}
            BattleIndex={BattleIndex}
            levelIndex={battle.LevelIndex}
            battleStatus={battleStatus(battle)}
          />
        ) : (
          <div />
        )}
        {battle && allBattleTimes ? (
          <RightBarContainer
            battle={battle}
            allBattleTimes={allBattleTimes}
            aborted={battle.Aborted}
          />
        ) : (
          <div />
        )}
        {battle && rankingHistory && runStats ? (
          <LevelStatsContainer
            battle={battle}
            rankingHistory={rankingHistory}
            runStats={runStats}
          />
        ) : (
          <div>
            <span>loading...</span>
          </div>
        )}
      </MainContainer>
    </Layout>
  );
};

Battle.propTypes = {
  BattleIndex: PropTypes.number.isRequired,
};

const MainContainer = styled.div`
  display: inline-block;
  width: 100%;
`;

export default Battle;
