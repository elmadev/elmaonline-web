import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import { groupBy, mapValues, sumBy, filter } from 'lodash';
import Layout from 'components/Layout';
import SidebarPage from 'components/SidebarPage';
import VSpaceChildren from 'components/VSpaceChildren';
import { battleStatus } from 'utils/battle';
import RecView from './RecView';
import RightBarContainer from './RightBarContainer';
import LevelStatsContainer from './LevelStatsContainer';

const runData = runs => {
  if (runs.count === 0) {
    return null;
  }
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

const Battle = ({ BattleId }) => {
  const BattleIndex = parseInt(BattleId, 10);
  let runStats = null;
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

  const levName =
    (battle && battle.LevelData && battle.LevelData.LevelName) || '?';

  return (
    <Layout t={`Battle - ${levName}`}>
      <SidebarPage stackWhen="(max-width: 900px)" rightSm responsive>
        <VSpaceChildren>
          {battle && (
            <RecView
              isWindow={isWindow}
              BattleIndex={BattleIndex}
              levelIndex={battle.LevelIndex}
              battleStatus={battleStatus(battle)}
            />
          )}
          {battle && rankingHistory && (
            <LevelStatsContainer
              battle={battle}
              rankingHistory={rankingHistory}
              runStats={runStats}
            />
          )}
        </VSpaceChildren>
        {battle && allBattleTimes && (
          <RightBarContainer
            battle={battle}
            allBattleTimes={allBattleTimes}
            aborted={battle.Aborted}
          />
        )}
      </SidebarPage>
    </Layout>
  );
};

Battle.propTypes = {
  BattleId: PropTypes.string,
};

Battle.defaultProps = {
  BattleId: '0',
};

export default Battle;
