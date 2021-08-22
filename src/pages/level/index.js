import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
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
} from '@material-ui/core';
import styled, { ThemeContext } from 'styled-components';
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
import LevelMap from 'features/LevelMap';
import Link from 'components/Link';
import LocalTime from 'components/LocalTime';
import { useNavigate } from '@reach/router';
import config from 'config';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import TimeTable from './TimeTable';
import StatsTable from './StatsTable';
import { nickId } from 'utils/nick';
import { pluralize } from 'utils/misc';
import LeaderHistory from 'components/LeaderHistory';

const Level = ({ LevelId }) => {
  const theme = useContext(ThemeContext);
  const LevelIndex = parseInt(LevelId, 10);
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
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
    statsLoading,
    settings: { fancyMap },
    personalLeaderHistory,
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
    getPersonalLeaderHistory,
    getLeaderHistory,
  } = useStoreActions(actions => actions.Level);

  useEffect(() => {
    getBesttimes({ levelId: LevelIndex, limit: 10000, eolOnly: 0 });
    getLevel(LevelIndex);
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
      getTimeStats(LevelIndex);
      if (nickId() > 0) {
        getPersonalLeaderHistory({ LevelIndex, KuskiIndex: nickId() });
      }
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
      navigate(`/battles/${battleIndex}`);
    }
  };

  const isWindow = typeof window !== 'undefined';

  return (
    <Layout t={`Level - ${level.LevelName}.lev`}>
      <PlayerContainer>
        {loading && <Loading />}
        {!loading && (
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
          </>
        )}
      </PlayerContainer>
      <RightBarContainer>
        <ChatContainer>
          {loading && <Loading />}
          {!loading && (
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Level info</Header>
              </AccordionSummary>
              <AccordionDetails>
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
                  {level.Legacy !== 0 && (
                    <div>
                      This level has legacy times imported from a third party
                      site.
                    </div>
                  )}
                </LevelDescription>
              </AccordionDetails>
            </Accordion>
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
                                  format="DD MMM YYYY HH:mm:ss"
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
                columns={['Replay', 'Time', 'By']}
                horizontalMargin={-16}
              />
            </AccordionReplays>
          </Accordion>
        </ChatContainer>
      </RightBarContainer>
      <ResultsContainer>
        <Paper>
          {loading && <Loading />}
          {!loading && (
            <>
              <Tabs
                variant="scrollable"
                scrollButtons="auto"
                value={tab}
                onChange={(e, value) => onTabClick(e, value)}
              >
                <Tab label="Best times" />
                <Tab label="All times" />
                <Tab label="Personal stats" />
                <Tab label="Leaders" />
                {level.Legacy && <Tab label="EOL times" />}
              </Tabs>
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
              {tab === 2 && (
                <StatsTable
                  data={timeStats}
                  leaderHistory={personalLeaderHistory}
                  loading={statsLoading !== LevelIndex}
                />
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
        </Paper>
      </ResultsContainer>
    </Layout>
  );
};

const AccordionReplays = styled(AccordionDetails)`
  & {
    flex-direction: column;
  }
`;

const AccordionBattles = styled(AccordionDetails)`
  && {
    padding-left: 0;
    padding-right: 0;
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

Level.propTypes = {
  LevelId: PropTypes.string,
};

Level.defaultProps = {
  LevelId: '0',
};

export default Level;
