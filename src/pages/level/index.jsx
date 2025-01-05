import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Grid,
} from '@material-ui/core';
import styled from '@emotion/styled';
import { Row } from 'components/Containers';
import Layout from 'components/Layout';
import { ExpandMore } from '@material-ui/icons';
import { Paper } from 'components/Paper';
import { useStoreState, useStoreActions } from 'easy-peasy';
import RecList from 'features/RecList';
import Header from 'components/Header';
import Loading from 'components/Loading';
import UpdateForm from 'pages/level/UpdateForm';
import { useParams } from '@tanstack/react-router';
import TimeTable from './TimeTable';
import StatsTable from './StatsTable';
import LevelInfoLevelStats from './LevelInfoLevelStats';
import { nickId, mod } from 'utils/nick';
import LeaderHistory from 'components/LeaderHistory';
import {
  CrippledTimes,
  CrippledPersonal,
  CrippledTimeStats,
  useQueryAlt,
} from 'api';
import Button from 'components/Buttons';
import Preview from '../kuski/Preview';
import LevelInfo from './LevelInfo.jsx';
import LevelBattles from './LevelBattles.jsx';
import LevelPlayer from './LevelPlayer.jsx';

const Level = () => {
  const { LevelId } = useParams({ strict: false });
  const LevelIndex = parseInt(LevelId, 10);
  const [tab, setTab] = useState(0);
  const [cripple, setCripple] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [previewRec, setPreviewRec] = useState(null);

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
    levelpacks,
    cups,
    statsLoading,
    personalLeaderHistory,
    personalLeaderHistoryLoading,
    leaderHistory,
    leaderHistoryLoading,
  } = useStoreState(state => state.Level);

  const {
    getBesttimes,
    getLevel,
    getAllfinished,
    getEoltimes,
    getTimeStats,
    getPersonalLeaderHistory,
    getLeaderHistory,
  } = useStoreActions(actions => actions.Level);

  const { userid } = useStoreState(state => state.Login);

  useEffect(() => {
    getBesttimes({ levelId: LevelIndex, limit: 10000, eolOnly: 0 });
    getLevel(LevelIndex);
  }, []);

  const kuskiIndex = nickId();

  // crippled best times, all times, leader history
  const { data: crippledTimesData, isLoading: crippledTimesDataLoading } =
    useQueryAlt(
      ['CrippledTimes', LevelId, cripple],
      async () => CrippledTimes(LevelId, cripple, 1000, 1, 10000),
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
      ['CrippledPersonal', LevelId, kuskiIndex, cripple],
      async () => CrippledPersonal(LevelId, kuskiIndex, cripple, 1000),
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
    ['CrippledTimeStats', LevelId, kuskiIndex, cripple],
    async () => CrippledTimeStats(LevelId, kuskiIndex, cripple),
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

  const loggedIn = nickId() > 0;

  return (
    <Layout t={`Level - ${level.LevelName}.lev`}>
      <Grid container spacing={2}>
        <Grid container item xs={12} md={7} alignContent="flex-start">
          <Grid item xs={12}>
            <LevelPlayer
              level={level}
              battles={battlesForLevel}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12}>
            <CrippledSelectWrapper topMargin={level.Locked}>
              <FormControl>
                <InputLabel id="cripple">Crippled Condition</InputLabel>
                <Select
                  id="cripple"
                  value={cripple || 'none'}
                  onChange={e => {
                    setCripple(e.target.value === 'none' ? '' : e.target.value);

                    if (tab === 4 && e.target.value) {
                      setTab(0);
                    }
                  }}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="noVolt">No Volt</MenuItem>
                  <MenuItem value="noTurn">No Turn</MenuItem>
                  <MenuItem value="oneTurn">One Turn</MenuItem>
                  <MenuItem value="noBrake">No Brake</MenuItem>
                  <MenuItem value="noThrottle">No Throttle</MenuItem>
                  <MenuItem value="alwaysThrottle">Always Throttle</MenuItem>
                  <MenuItem value="oneWheel">One Wheel</MenuItem>
                  <MenuItem value="drunk">Drunk</MenuItem>
                </Select>
              </FormControl>
            </CrippledSelectWrapper>
          </Grid>
          <Grid item xs={12}>
            <Paper>
              {loading && <Loading />}
              {!loading && (
                <>
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
                            loading={
                              personalLeaderHistoryLoading !== LevelIndex
                            }
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
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={12} md={5}>
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Level info</Header>
              </AccordionSummary>
              <AccordionDetails>
                <LevelInfo level={level} levelpacks={levelpacks} cups={cups} />
              </AccordionDetails>
            </Accordion>
            {(parseInt(userid, 10) === level.AddedBy || mod() === 1) && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Header h3>Edit tags</Header>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: 'column' }}>
                  <UpdateForm />
                </AccordionDetails>
              </Accordion>
            )}
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Play stats</Header>
              </AccordionSummary>
              <LevelStatsAccordion>
                <LevelInfoLevelStats level={level} />
              </LevelStatsAccordion>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Battles in level</Header>
              </AccordionSummary>
              <AccordionBattles>
                <LevelBattles battles={battlesForLevel} loading={loading} />
              </AccordionBattles>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Replays in level</Header>
              </AccordionSummary>
              <AccordionReplays>
                <RecList
                  LevelIndex={LevelIndex}
                  columns={['Replay', 'Time', 'By', 'Tags']}
                  horizontalMargin={-16}
                />
              </AccordionReplays>
            </Accordion>
          </Grid>
        </Grid>
      </Grid>
      {previewRec && (
        <Preview previewRec={previewRec} setPreviewRec={setPreviewRec} />
      )}
    </Layout>
  );
};

const AccordionReplays = styled(AccordionDetails)`
  max-height: 400px;
  overflow-y: auto;
  & {
    flex-direction: column;
  }
`;

const AccordionBattles = styled(AccordionDetails)`
  && {
    padding-left: 0;
    padding-right: 0;
    overflow-y: auto;
    max-height: 250px;
  }
`;

const StyledTabs = styled(Tabs)`
  .MuiTab-root {
    min-width: 125px;
    @media screen and (max-width: 1440px) {
      min-width: 100px;
    }
  }
`;

const CrippledSelectWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${p => (p.topMargin ? '-12px' : '-22px')};
  margin-bottom: 12px;
  .MuiFormControl-root {
    min-width: 180px;
  }
  @media screen and (max-width: 1100px) {
    margin-top: 0;
  }
`;

const Container = styled.div`
  padding: 20px;
`;

const LevelStatsAccordion = styled(AccordionDetails)`
  && {
    margin-top: -7px;
    padding-left: 0;
    padding-right: 0;
  }
`;

const RangeField = styled(TextField)`
  margin-right: 16px !important;
`;

export default Level;
