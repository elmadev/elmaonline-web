import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';
import Time from 'components/Time';
import Loading from 'components/Loading';

const KuskiHeader = ({ KuskiIndex }) => {
  const { ranking, intTotalTime: tt } = useStoreState(state => state.Kuski);
  const { getRanking, getIntTotalTime } = useStoreActions(
    actions => actions.Kuski,
  );

  useEffect(() => {
    getRanking(KuskiIndex);
    getIntTotalTime(KuskiIndex);
  }, [KuskiIndex]);
  let playedAll = 0;
  let winsAll = 0;
  if (ranking) {
    if (ranking[0]) {
      playedAll = ranking[0].PlayedAll;
      winsAll = ranking[0].WinsAll;
    }
  }
  return (
    <Container>
      <StatsContainer>
        <div>
          {tt === false ? (
            <Loading />
          ) : (
            <>
              {tt.allFinished && <Time time={tt.timeSum} />}
              {!tt.allFinished && (
                <Time
                  time={{
                    unfinished: true,
                    finished: tt.finishCount || '0',
                    levs: tt.levelCount,
                  }}
                />
              )}
            </>
          )}
        </div>
        <StatsTitle>Int total time</StatsTitle>
      </StatsContainer>
      <StatsContainer>
        {!ranking ? <Loading /> : <div>{playedAll}</div>}
        <StatsTitle>battles played</StatsTitle>
      </StatsContainer>
      <StatsContainer>
        {!ranking ? <Loading /> : <div>{winsAll}</div>}
        <StatsTitle>battles won</StatsTitle>
      </StatsContainer>
    </Container>
  );
};

KuskiHeader.propTypes = {
  KuskiIndex: PropTypes.number.isRequired,
};

const Container = styled.div`
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
`;

const StatsTitle = styled.div`
  color: #c3c3c3;
  font-size: 16px;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatsContainer = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 30px;
  font-weight: 500;
  color: ${p => p.theme.primary};
  min-width: 150px;
  flex-basis: auto;
  flex-grow: 1;
  text-align: center;
`;

export default KuskiHeader;
