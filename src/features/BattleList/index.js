import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import styled from 'styled-components';
import { BattleType } from 'components/Names';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { sortResults, battleStatus, battleStatusBgColor } from 'utils/battle';
import { toServerTime } from 'utils/time';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';

const BattleList = ({ start, end, limit = 250, condensed }) => {
  const { battles } = useStoreState(state => state.BattleList);
  const { getBattles } = useStoreActions(actions => actions.BattleList);
  useEffect(() => {
    getBattles({
      start: toServerTime(start).format(),
      end: toServerTime(end).format(),
      limit,
    });
  }, [start, end]);
  return (
    <Container>
      <ListContainer>
        <ListHeader>
          <ListCell width={100}>Type</ListCell>
          <ListCell width={150}>Designer</ListCell>
          <ListCell width={100}>Level</ListCell>
          <ListCell width={150}>Winner</ListCell>
          <ListCell width={60}>Time</ListCell>
          <ListCell width={80}>Started</ListCell>
          {!condensed && <ListCell>Players</ListCell>}
        </ListHeader>
        {battles.length > 0 && (
          <>
            {battles.map(b => {
              const sorted = [...b.Results].sort(sortResults(b.BattleType));
              return (
                <ListRow key={b.BattleIndex} bg={battleStatusBgColor(b)}>
                  {condensed ? (
                    <ListCell width={100} to={`/battles/${b.BattleIndex}`}>
                      <CondensedCon>
                        <div>{b.Duration} min</div>
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
                    {b.LevelData && b.LevelData.LevelName}
                  </ListCell>
                  <ListCell width={150}>
                    {b.Finished === 1 && b.Results.length > 0 ? (
                      <Kuski kuskiData={sorted[0].KuskiData} team flag />
                    ) : (
                      battleStatus(b)
                    )}
                  </ListCell>
                  <ListCell width={60}>
                    {b.Results.length > 0 && (
                      <Time time={sorted[0].Time} apples={sorted[0].Apples} />
                    )}
                  </ListCell>
                  <ListCell width={80} to={`/battles/${b.BattleIndex}`}>
                    <LocalTime date={b.Started} format="HH:mm" parse="X" />
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
  background: ${p => (p.bar ? '#219653' : 'transparent')};
`;

const Container = styled.div`
  display: block;
  max-width: 100%;
  overflow: auto;
  a {
    color: black;
    :hover {
      color: #219653;
    }
  }
`;

const CondensedCon = styled.div`
  position: absolute;
  top: 2px;
  bottom: 2px;
`;

const CondensedType = styled.div`
  position: absolute;
  bottom: 1px;
`;

BattleList.propTypes = {
  start: PropTypes.shape({}).isRequired,
  end: PropTypes.shape({}).isRequired,
};

export default BattleList;
