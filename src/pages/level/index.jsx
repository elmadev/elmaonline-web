import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  TextField,
} from '@material-ui/core';
import styled from '@emotion/styled';
import { Row } from 'components/Containers';
import { useTheme } from '@emotion/react';
import Layout from 'components/Layout';
import { ExpandMore } from '@material-ui/icons';
import { Paper } from 'components/Paper';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Kuski from 'components/Kuski';
import Download from 'components/Download';
import Recplayer from 'components/Recplayer';
import RecList from 'features/RecList';
import Header from 'components/Header';
import Loading from 'components/Loading';
import Tags from 'components/Tags';
import LevelMap from 'features/LevelMap';
import Link from 'components/Link';
import UpdateForm from 'pages/level/UpdateForm';
import LocalTime from 'components/LocalTime';
import { useNavigate, useParams } from '@tanstack/react-router';
import config from 'config';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import TimeTable from './TimeTable';
import StatsTable from './StatsTable';
import LevelInfoLevelStats from './LevelInfoLevelStats';
import { nickId, mod } from 'utils/nick';
import { pluralize } from 'utils/misc';
import LeaderHistory from 'components/LeaderHistory';
import {
  CrippledTimes,
  CrippledPersonal,
  CrippledTimeStats,
  useQueryAlt,
} from 'api';
import Button from 'components/Buttons';

const Level = () => {
  const { LevelId } = useParams({ strict: false });
  const theme = useTheme();
  const LevelIndex = parseInt(LevelId, 10);
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [cripple, setCripple] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

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
    settings: { fancyMap, showGravityApples },
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
    toggleFancyMap,
    toggleShowGravityApples,
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

  const goToBattle = battleIndex => {
    if (!Number.isNaN(battleIndex)) {
      navigate({ to: `/battles/${battleIndex}` });
    }
  };

  const isWindow = typeof window !== 'undefined';

  const loggedIn = nickId() > 0;

  return (
    <Layout t={`Level - ${level.LevelName}.lev`}>
      <PlayerContainer>
        {loading && <Loading />}
        {!loading && !level.Locked ? (
          <>
            <Player>
              {fancyMap ? (
                <>
                  {isWindow &&
                    (battlesForLevel.length < 1 ||
                      battleStatus(battlesForLevel[0]) !== 'Queued') && (
                      <Recplayer
                        lev={`${config.dlUrl}level/${LevelIndex}`}
                        controls
                      />
                    )}
                </>
              ) : (
                <LevelMap LevelIndex={LevelIndex} />
              )}
            </Player>
            <StyledFormControlLabel
              control={
                <Checkbox
                  onChange={() => toggleFancyMap()}
                  checked={fancyMap}
                  color="primary"
                  size="small"
                />
              }
              label="Fancy map"
            />
            {!fancyMap && (
              <StyledFormControlLabel
                control={
                  <Checkbox
                    onChange={() => toggleShowGravityApples()}
                    checked={showGravityApples}
                    color="primary"
                    size="small"
                  />
                }
                label="Show gravity apples"
              />
            )}
          </>
        ) : null}
      </PlayerContainer>
      <RightBarContainer>
        <ChatContainer>
          {loading && <Loading />}
          {!loading && (
            <>
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Header h3>Level info</Header>
                </AccordionSummary>
                <AccordionDetails>
                  {level.Locked ? (
                    <LevelDescription>{level.LevelName}.lev</LevelDescription>
                  ) : (
                    <LevelDescription>
                      <Download href={`level/${LevelIndex}`}>
                        {level.LevelName}.lev
                      </Download>
                      <LevelFullName>{level.LongName}</LevelFullName>
                      <br />
                      <div>{`Level ID: ${LevelIndex}`}</div>
                      <div>
                        {pluralize(level.Apples, 'apple')},{' '}
                        {pluralize(level.Killers, 'killer')} and{' '}
                        {pluralize(level.Flowers, 'flower')}.
                      </div>
                      {levelpacks.length > 0 && (
                        <div>
                          {`Level Pack: `}
                          {levelpacks.map((pack, index) => [
                            index > 0 && ', ',
                            <Link to={`/levels/packs/${pack.LevelPackName}`}>
                              {pack.LevelPackName}
                            </Link>,
                          ])}
                        </div>
                      )}
                      {cups && cups.length > 0 && (
                        <div>
                          {`Cup: `}
                          {cups.map((cup, index) => [
                            index > 0 && ', ',
                            <Link to={`/cup/${cup.ShortName}/events`}>
                              {cup.CupName}
                            </Link>,
                          ])}
                        </div>
                      )}
                      {level.AcceptBugs !== 0 && (
                        <div>Apple bugs are allowed in this level.</div>
                      )}
                      {level.Legacy !== 0 && (
                        <div>
                          This level has legacy times imported from a third
                          party site.
                        </div>
                      )}
                      <br />
                      {level.Tags && (
                        <Tags tags={level.Tags.map(tag => tag.Name)} />
                      )}
                    </LevelDescription>
                  )}
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
            </>
          )}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Header h3>Battles in level</Header>
            </AccordionSummary>
            <AccordionBattles>
              <BattlesContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Started</TableCell>
                      <TableCell>Designer</TableCell>
                      <TableCell>Winner</TableCell>
                      <TableCell>Battle ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading &&
                      battlesForLevel.map(i => {
                        const sorted = [...i.Results].sort(
                          sortResults(i.BattleType),
                        );
                        return (
                          <BattleRow
                            bg={battleStatusBgColor(i, theme)}
                            hover
                            key={i.BattleIndex}
                            onClick={() => {
                              goToBattle(i.BattleIndex);
                            }}
                          >
                            <TableCell>
                              <Link to={`/battles/${i.BattleIndex}`}>
                                <LocalTime
                                  date={i.Started}
                                  format="dd MMM yyyy HH:mm:ss"
                                  parse="X"
                                />
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Kuski kuskiData={i.KuskiData} team flag />
                            </TableCell>
                            <TableCell>
                              {i.Finished === 1 && sorted.length > 0 ? (
                                <Kuski
                                  kuskiData={sorted[0].KuskiData}
                                  team
                                  flag
                                />
                              ) : (
                                battleStatus(i)
                              )}
                            </TableCell>
                            <TableCell>{i.BattleIndex}</TableCell>
                          </BattleRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </BattlesContainer>
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
        </ChatContainer>
      </RightBarContainer>
      <ResultsContainer>
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
                        loading={personalLeaderHistoryLoading !== LevelIndex}
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
      </ResultsContainer>
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

const BattleRow = styled(TableRow)`
  && {
    cursor: pointer;
    background-color: ${p => p.bg};
  }
`;

const ResultsContainer = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  @media screen and (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const BattlesContainer = styled.div`
  width: 100%;
`;

const LevelFullName = styled.div`
  color: #7d7d7d;
`;

const LevelDescription = styled.div`
  font-size: 14px;
`;

const ChatContainer = styled.div`
  clear: both;
`;

const RightBarContainer = styled.div`
  float: right;
  width: 40%;
  padding: 7px;
  box-sizing: border-box;
  @media screen and (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const PlayerContainer = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  @media screen and (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const Player = styled.div`
  background: ${p => p.theme.pageBackground};
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 640px) {
    height: 350px;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  span {
    font-size: 14px;
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
  margin-top: ${p => (p.topMargin ? '-12px' : '-38px')};
  margin-bottom: 15px;
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
