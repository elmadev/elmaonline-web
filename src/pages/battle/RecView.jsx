import React, { useState } from 'react';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import { Checkbox, FormControlLabel, useMediaQuery } from '@material-ui/core';
import Recplayer from 'components/Recplayer';
import Play from 'components/Play';
import styled from 'styled-components';
import config from 'config';
import { Row } from 'components/Containers';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import { downloadRec } from 'utils/misc';

const RecView = props => {
  const [play, setPlay] = useState(
    navigator.userAgent.toLowerCase().indexOf('firefox') === -1,
  );

  const isRehydrated = useStoreRehydrated();

  const {
    isWindow,
    BattleIndex,
    levelIndex,
    battleStatus,
    replayUrl,
    player,
    levelName,
  } = props;

  const { toggleRecAutoplay } = useStoreActions(actions => actions.Battle);

  const {
    settings: { autoPlayRecs },
  } = useStoreState(state => state.Battle);

  const isMobile = useMediaQuery('(max-width: 1000px)');

  return (
    <div>
      {!isRehydrated ? null : (
        <PlayerContainer>
          <div className="player">
            {play ? (
              <>
                {isWindow && battleStatus !== 'Queued' && (
                  <Recplayer
                    rec={
                      replayUrl || `${config.dlUrl}battlereplay/${BattleIndex}`
                    }
                    lev={`${config.dlUrl}level/${levelIndex}`}
                    autoPlay={autoPlayRecs ? 'if-visible' : 'no'}
                    controls
                  />
                )}
              </>
            ) : (
              <Play type="replay" onClick={() => setPlay(true)} />
            )}
          </div>
          <Row>
            {player?.Kuski?.Kuski && !isMobile && (
              <PlayerTitle>
                <Kuski kuskiData={player.Kuski} flag={true} team={true} />
                <span>&nbsp;</span>
                <Download
                  onClick={() =>
                    downloadRec(
                      replayUrl || `${config.dlUrl}battlereplay/${BattleIndex}`,
                      levelName,
                      player.Kuski.Kuski,
                      player.Time,
                    )
                  }
                >
                  <Time time={player.Time} apples={player.Apples} />
                </Download>
              </PlayerTitle>
            )}
            <StyledFormControlLabel
              control={
                <Checkbox
                  onChange={() => toggleRecAutoplay()}
                  checked={autoPlayRecs}
                  color="primary"
                  size="small"
                />
              }
              label="Autoplay replays"
            />
          </Row>
        </PlayerContainer>
      )}
    </div>
  );
};

const PlayerTitle = styled.div`
  padding: 9px;
  padding-right: 18px;
  font-size: ${p => p.theme.smallFont};
`;

const Download = styled.span`
  cursor: pointer;
  color: ${p => p.theme.linkColor};
  :hover {
    color: ${p => p.theme.linkHover};
  }
`;

const PlayerContainer = styled.div`
  width: 60%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  .player {
    background: ${p => p.theme.pageBackground};
    height: 550px;
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 1650px) {
      height: 450px;
    }
    @media screen and (max-width: 500px) {
      height: 400px;
    }
  }
  @media screen and (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  span {
    font-size: 14px;
  }
`;

export default RecView;
