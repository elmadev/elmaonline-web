import React, { useState } from 'react';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import Recplayer from 'components/Recplayer';
import Play from 'components/Play';
import styled from 'styled-components';
import config from 'config';

const RecView = props => {
  const [play, setPlay] = useState(
    navigator.userAgent.toLowerCase().indexOf('firefox') === -1,
  );

  const isRehydrated = useStoreRehydrated();

  const { isWindow, BattleIndex, levelIndex, battleStatus } = props;

  const { toggleRecAutoplay } = useStoreActions(actions => actions.Battle);

  const {
    settings: { autoPlayRecs },
  } = useStoreState(state => state.Battle);

  return (
    <div>
      {!isRehydrated ? null : (
        <PlayerContainer>
          <div className="player">
            {play ? (
              <>
                {isWindow && battleStatus !== 'Queued' && (
                  <Recplayer
                    rec={`${config.dlUrl}battlereplay/${BattleIndex}`}
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
        </PlayerContainer>
      )}
    </div>
  );
};

const PlayerContainer = styled.div`
  .player {
    background: #f1f1f1;
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const StyledFormControlLabel = styled(FormControlLabel)`
  span {
    font-size: 14px;
  }
`;

export default RecView;
