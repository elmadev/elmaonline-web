import { Tab, Tabs } from '@material-ui/core';
import TimeTable from '../TimeTable';
import StatsTable from '../StatsTable';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Paper } from 'components/Paper';
import Loading from 'components/Loading';
import { useStoreState } from 'easy-peasy';
import LeaderHistory from 'components/LeaderHistory';
import { nickId } from 'utils/nick';

import {
  CrippledTimes,
  CrippledPersonal,
  CrippledTimeStats,
  useQueryAlt,
} from 'api';
import CrippledSelect from './CrippledSelect.jsx';
import BestTimesTab from './tabs/BestTimesTab.jsx';
import AllTimesTab from './tabs/AllTimesTab.jsx';
import PersonalStatsTab from './tabs/PersonalStatsTab.jsx';
import LeaderHistoryTab from './tabs/LeaderHistoryTab';
import EolTimesTab from './tabs/EolTimesTab.jsx';

const LevelTimes = ({ LevelIndex, openReplay }) => {
  const [tab, setTab] = useState(0);
  const [cripple, setCripple] = useState('');

  const loggedIn = nickId() > 0;
  const kuskiIndex = nickId();

  const { level, loading } = useStoreState(state => state.Level);

  // crippled best times, all times, leader history
  const { data: crippledTimesData, isLoading: crippledTimesDataLoading } =
    useQueryAlt(
      ['CrippledTimes', LevelIndex, cripple],
      async () => CrippledTimes(LevelIndex, cripple, 1000, 1, 10000),
      { enabled: cripple !== '' && tab !== 2, retry: 0 },
    );

  const {
    allTimes: crippledAllTimes,
    bestTimes: crippledBestTimes,
    leaderHistory: crippledLeaderHistory,
  } = crippledTimesData || {};

  // crippled personal times and record history
  const { data: crippledPersonalData, isLoading: crippledPersonalDataLoading } =
    useQueryAlt(
      ['CrippledPersonal', LevelIndex, kuskiIndex, cripple],
      async () => CrippledPersonal(LevelIndex, kuskiIndex, cripple, 1000),
      { enabled: cripple !== '' && kuskiIndex > 0 && tab === 2, retry: 0 },
    );

  const {
    kuskiTimes: crippledKuskiTimes,
    kuskiLeaderHistory: crippledKuskiLeaderHistory,
  } = crippledPersonalData || {};

  // crippled personal stats table data
  const {
    data: crippledKuskiTimeStats,
    isLoading: crippledKuskiTimeStatsLoading,
  } = useQueryAlt(
    ['CrippledTimeStats', LevelIndex, kuskiIndex, cripple],
    async () => CrippledTimeStats(LevelIndex, kuskiIndex, cripple),
    { enabled: cripple !== '' && kuskiIndex > 0 && tab === 2, retry: 0 },
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <CrippledSelect
        level={level}
        cripple={cripple}
        setCripple={setCripple}
        tab={tab}
        setTab={setTab}
      />
      <Paper>
        <StyledTabs
          variant="scrollable"
          scrollButtons="auto"
          value={tab}
          onChange={(e, value) => setTab(value)}
        >
          <Tab label="Best times" />
          <Tab label="All times" />
          <Tab label="Personal stats" />
          <Tab label="Leaders" />
          {!cripple && level.Legacy && <Tab label="EOL times" />}
        </StyledTabs>

        {tab === 2 && !loggedIn && (
          <Container>Log in to see personal stats.</Container>
        )}

        {!cripple && (
          <>
            {tab === 0 && <BestTimesTab LevelIndex={LevelIndex} />}
            {tab === 1 && <AllTimesTab LevelIndex={LevelIndex} />}
            {tab === 2 && (
              <PersonalStatsTab
                LevelIndex={LevelIndex}
                openReplay={openReplay}
              />
            )}
            {tab === 3 && <LeaderHistoryTab LevelIndex={LevelIndex} />}
            {tab === 4 && <EolTimesTab LevelIndex={LevelIndex} />}
          </>
        )}

        {cripple && (
          <>
            {tab === 0 && (
              <TimeTable
                data={crippledBestTimes}
                loading={crippledTimesDataLoading}
              />
            )}

            {tab === 1 && (
              <TimeTable
                data={crippledAllTimes}
                loading={crippledTimesDataLoading}
              />
            )}

            {tab === 2 && loggedIn && (
              <>
                <StatsTable
                  data={crippledKuskiTimeStats}
                  loading={crippledKuskiTimeStatsLoading}
                />
                <LeaderHistory
                  allFinished={crippledKuskiLeaderHistory}
                  loading={crippledPersonalDataLoading}
                />
                <TimeTable
                  data={crippledKuskiTimes}
                  loading={crippledPersonalDataLoading}
                  height={376}
                />
              </>
            )}

            {tab === 3 && (
              <LeaderHistory
                allFinished={crippledLeaderHistory}
                loading={crippledTimesDataLoading}
              />
            )}
          </>
        )}
      </Paper>
    </>
  );
};

const StyledTabs = styled(Tabs)`
  .MuiTab-root {
    min-width: 125px;
    @media screen and (max-width: 1440px) {
      min-width: 100px;
    }
  }
`;

const Container = styled.div`
  padding: 20px;
`;

export default LevelTimes;
