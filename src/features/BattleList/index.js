import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
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
}) => {
  const theme = useContext(ThemeContext);
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
  return (
    <Container>
      <ListContainer>
        <ListHeader>
          <ListCell width={80}>Started</ListCell>
          <ListCell width={100}>Type</ListCell>
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
                  <ListCell width={80} to={`/battles/${b.BattleIndex}`}>
                    <LocalTime date={b.Started} format="HH:mm" parse="X" />
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
                      <Time time={sorted[0].Time} apples={sorted[0].Apples} />
                    )}
                  </ListCell>
                  {!condensed && (
                    <ListCell>
                      <Popularity>
                        <Popularity
                          bar
                          title={b.Results.length}
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
    </Container>
  );
};

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
