import { Tab, Tabs, TextField } from '@material-ui/core';
import TimeTable from '../TimeTable';
import StatsTable from '../StatsTable';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Paper } from 'components/Paper';
import Loading from 'components/Loading';
import { useStoreActions, useStoreState } from 'easy-peasy';
import LeaderHistory from 'components/LeaderHistory';
import { nickId } from 'utils/nick';
import { Row } from 'components/Containers';
import Button from 'components/Buttons';

import {
  CrippledTimes,
  CrippledPersonal,
  CrippledTimeStats,
  useQueryAlt,
} from 'api';
import CrippledSelect from '../CrippledSelect.jsx';

const LevelTimes = ({ LevelIndex }) => {
  const [tab, setTab] = useState(0);
  const [cripple, setCripple] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const loggedIn = nickId() > 0;
  const kuskiIndex = nickId();

  const {
    besttimes,
    besttimesLoading,
    level,
    battlesForLevel,
    loading,
    allfinished,
    allLoading,
    eoltimes,
    eolLoading,
    timeStats,
    statsLoading,
    personalLeaderHistory,
    personalLeaderHistoryLoading,
    leaderHistory,
    leaderHistoryLoading,
  } = useStoreState(state => state.Level);

  const {
    getBesttimes,
    getAllfinished,
    getEoltimes,
    getTimeStats,
    getPersonalLeaderHistory,
    getLeaderHistory,
  } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    getBesttimes({ levelId: LevelIndex, limit: 10000, eolOnly: 0 });
  }, []);

  const onTabClick = (e, value) => {
    setTab(value);
    if (
      value === 1 &&
      (allfinished.length === 0 || allLoading !== LevelIndex)
    ) {
      getAllfinished(LevelIndex);
    }
    if (
      value === 2 &&
      (timeStats.length === 0 || statsLoading !== LevelIndex)
    ) {
      fetchPersonalStats();
    }
    if (
      value === 3 &&
      (leaderHistory.length === 0 || leaderHistoryLoading !== LevelIndex)
    ) {
      getLeaderHistory({ LevelIndex });
    }
    if (value === 4 && (eoltimes.length === 0 || eolLoading !== LevelIndex)) {
      getEoltimes({ levelId: LevelIndex, limit: 10000, eolOnly: 1 });
    }
  };

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

  const fetchPersonalStats = () => {
    getTimeStats({ LevelIndex, from, to });
    if (nickId() > 0) {
      getPersonalLeaderHistory({
        LevelIndex,
        KuskiIndex: nickId(),
        from: from ? new Date(from).getTime() / 1000 : '',
        to: to ? new Date(to).getTime() / 1000 + 86400 : '',
      });
    }
  };

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
          onChange={(e, value) => onTabClick(e, value)}
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
            {tab === 0 && (
              <TimeTable
                loading={besttimesLoading}
                data={besttimes}
                latestBattle={battlesForLevel[0]}
              />
            )}

            {tab === 1 && (
              <TimeTable
                loading={allLoading !== LevelIndex}
                data={allfinished}
                latestBattle={battlesForLevel[0]}
              />
            )}

            {tab === 2 && loggedIn && (
              <>
                <Row ai="self-end" m="Large">
                  <RangeField
                    id="date-from"
                    label="From"
                    type="date"
                    defaultValue={from}
                    onChange={event => setFrom(event.target?.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0],
                    }}
                  />

                  <RangeField
                    id="date-to"
                    label="To"
                    type="date"
                    defaultValue={to}
                    onChange={event => setTo(event.target?.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: new Date().toISOString().split('T')[0],
                    }}
                  />
                  <Button
                    secondary
                    onClick={() => fetchPersonalStats()}
                    disabled={!to || !from}
                  >
                    Submit
                  </Button>
                </Row>
                <StatsTable
                  data={timeStats}
                  loading={statsLoading !== LevelIndex}
                />
                <LeaderHistory
                  allFinished={personalLeaderHistory}
                  loading={personalLeaderHistoryLoading !== LevelIndex}
                  openReplay={time =>
                    setPreviewRec({
                      ...time,
                      LevelIndex,
                      LevelData: level,
                    })
                  }
                />
              </>
            )}

            {tab === 3 && (
              <LeaderHistory
                allFinished={leaderHistory}
                loading={leaderHistoryLoading !== LevelIndex}
              />
            )}

            {tab === 4 && (
              <TimeTable
                loading={eolLoading !== LevelIndex}
                data={eoltimes}
                latestBattle={battlesForLevel[0]}
              />
            )}
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

const RangeField = styled(TextField)`
  margin-right: 16px !important;
`;

export default LevelTimes;
