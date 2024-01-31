import React, { useEffect, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import LocalTime from 'components/LocalTime';
import { BattleTime } from 'components/Time';
import Kuski from 'components/Kuski';
import styled, { ThemeContext } from 'styled-components';
import { Level, BattleType } from 'components/Names';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';

const BattleList = ({
  start = null,
  end = null,
  limit = 250,
  condensed = false,
  latest = false,
  height = 0,
}) => {
  const { battles } = useStoreState(state => state.BattleList);
  const { getBattles } = useStoreActions(actions => actions.BattleList);
  useEffect(() => {
    if (start || end) {
      getBattles({
        start: start.format(),
        end: end.format(),
        limit,
      });
    }
  }, [start, end]);
  useEffect(() => {
    if (latest) {
      getBattles({
        limit,
        latest,
      });
    }
  }, [latest]);

  const battlesData = useMemo(() => {
    if (battles.length) {
      const inQueue = battles.filter(b => b.InQueue && !b.Aborted);
      if (inQueue.length === 0) {
        return battles;
      }
      const started = battles.filter(b => !b.InQueue && !b.Aborted);
      if (started.length === 0) {
        return battles;
      }
      const battles2 = [...battles];
      const remaining = started[0].Finished
        ? 120 -
          (Math.floor(Date.now() / 1000) -
            (parseInt(started[0].Started) + started[0].Duration * 60))
        : 120 +
          (parseInt(started[0].Started) +
            started[0].Duration * 60 -
            Math.floor(Date.now() / 1000));
      let inQueueTime = 0;
      inQueue.reverse().forEach((b, index) => {
        const ogIndex = inQueue.length - 1 - index;
        battles2[ogIndex] = {
          ...battles2[ogIndex],
          Starts: Math.floor(Date.now() / 1000) + remaining + inQueueTime,
        };
        inQueueTime += 120 + b.Duration * 60 + b.Countdown;
      });
      return battles2;
    }
    return [];
  }, [battles]);

  return (
    <Container>
      <BattleListTable
        battles={battlesData}
        condensed={condensed}
        height={height}
      />
    </Container>
  );
};

// pure component, used outside this file also.
export const BattleListTable = ({
  battles,
  condensed,
  startedFormat = 'HH:mm',
  wideStartedCol = false,
  height = 0,
}) => {
  const theme = useContext(ThemeContext);
  const startedWidth = wideStartedCol ? 160 : 80;

  return (
    <Scroll height={height}>
      <ListContainer>
        <ListHeader>
          <ListCell width={startedWidth}>Started</ListCell>
          <ListCell width={condensed ? 100 : 120}>Type</ListCell>
          <ListCell width={150}>Designer</ListCell>
          <ListCell width={100}>Level</ListCell>
          <ListCell width={150}>Winner</ListCell>
          <ListCell width={60}>Time</ListCell>
          {!condensed && <ListCell>Players</ListCell>}
        </ListHeader>
        {battles.length > 0 && (
          <>
            {battles.map(b => {
              const sorted = [...b.Results].sort(sortResults(b.BattleType));
              return (
                <ListRow key={b.BattleIndex} bg={battleStatusBgColor(b, theme)}>
                  <ListCell
                    width={startedWidth}
                    to={`/battles/${b.BattleIndex}`}
                  >
                    {b.InQueue && !b.Aborted && b.Starts ? (
                      <>
                        Est.{' '}
                        <LocalTime
                          date={b.Starts}
                          format={startedFormat}
                          parse="X"
                        />
                      </>
                    ) : (
                      <LocalTime
                        date={b.Started}
                        format={startedFormat}
                        parse="X"
                      />
                    )}
                  </ListCell>
                  {condensed ? (
                    <ListCell width={100} to={`/battles/${b.BattleIndex}`}>
                      <CondensedCon>
                        <CondensedDuration>{b.Duration} min</CondensedDuration>
                        <CondensedType>
                          <BattleType small upper type={b.BattleType} />
                        </CondensedType>
                      </CondensedCon>
                    </ListCell>
                  ) : (
                    <ListCell width={100} to={`/battles/${b.BattleIndex}`}>
                      {b.Duration} min <BattleType lower type={b.BattleType} />
                    </ListCell>
                  )}
                  <ListCell width={150}>
                    <Kuski kuskiData={b.KuskiData} team flag />
                  </ListCell>
                  <ListCell width={100}>
                    {b.LevelData && (
                      <Level
                        LevelIndex={b.LevelIndex}
                        LevelData={b.LevelData}
                      />
                    )}
                  </ListCell>
                  {b.Finished === 1 && b.Results.length > 0 ? (
                    <ListCell width={150}>
                      <Kuski kuskiData={sorted[0].KuskiData} team flag />
                    </ListCell>
                  ) : (
                    <ListCell width={150} to={`/battles/${b.BattleIndex}`}>
                      {battleStatus(b)}
                    </ListCell>
                  )}
                  <ListCell
                    whiteSpace="nowrap"
                    width={60}
                    to={`/battles/${b.BattleIndex}`}
                  >
                    {b.Results.length > 0 && (
                      <BattleTime
                        time={sorted[0].Time}
                        apples={sorted[0].Apples}
                        battleType={b.BattleType}
                      />
                    )}
                  </ListCell>
                  {!condensed && (
                    <ListCell title={`${b.Results.length} Player(s)`}>
                      <Popularity>
                        <Popularity
                          bar
                          style={{
                            width: `${(b.Results.length / 20) * 100}%`,
                            opacity: b.Results.length / 20 + 0.1,
                          }}
                        />
                      </Popularity>
                    </ListCell>
                  )}
                </ListRow>
              );
            })}
          </>
        )}
      </ListContainer>
    </Scroll>
  );
};

const Scroll = styled.div`
  ${p => (p.height ? `max-height: ${p.height}px;` : '')}
  overflow-y: auto;
`;

const Popularity = styled.div`
  max-width: 150px;
  overflow: hidden;
  height: ${p => (p.bar ? '5px' : 'auto')};
  background: ${p => (p.bar ? p.theme.primary : 'transparent')};
`;

const Container = styled.div`
  display: block;
  max-width: 100%;
  overflow: auto;
`;

const CondensedCon = styled.div`
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 10px;
  right: 10px;
`;

const CondensedType = styled.div`
  position: absolute;
  bottom: 1px;
  white-space: nowrap;
`;

const CondensedDuration = styled.div`
  white-space: nowrap;
`;

BattleList.propTypes = {
  start: PropTypes.shape({}),
  end: PropTypes.shape({}),
};

export default BattleList;
