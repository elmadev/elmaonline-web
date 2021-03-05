import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import { groupBy, mapValues, sumBy, filter } from 'lodash';
import Layout from 'components/Layout';
import styled from 'styled-components';
import Time from '../../components/Time';
import Kuski from '../../components/Kuski.js';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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

const getWinnerData = battle => {
  if (battle && battle.Results && battle.Results.length > 0) {
    const r = battle.Results[0];

    return {
      Kuski: r.KuskiData || {},
      Time: r.Time,
      Apples: r.Apples,
    };
  }

  return null;
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

  const winner = getWinnerData(battle);

  const showWinnerTitle = useMediaQuery('(max-width: 1000px)');

  return (
    <Layout
      t={`Battle - ${
        battle ? (battle.LevelData ? battle.LevelData.LevelName : '?') : '?'
      }`}
    >
      <MainContainer>
        {battle && winner && showWinnerTitle && (
          <WinnerTitle>
            <Kuski kuskiData={winner.Kuski} flag={true} team={true} />
            <span>&nbsp;</span>
            <Time time={winner.Time} apples={winner.Apples} />
          </WinnerTitle>
        )}
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
        {battle && rankingHistory ? (
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
  BattleId: PropTypes.string,
};

Battle.defaultProps = {
  BattleId: '0',
};

const MainContainer = styled.div`
  display: inline-block;
  width: 100%;
`;

const WinnerTitle = styled.div`
  padding-left: 7px;
  margin-bottom: 2px;
`;

export default Battle;
