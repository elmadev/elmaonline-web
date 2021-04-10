import React, { useState } from 'react';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import {
  Checkbox,
  FormControlLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Input,
} from '@material-ui/core';
import ShareIcon from '@material-ui/icons/Share';
import Recplayer from 'components/Recplayer';
import Play from 'components/Play';
import styled from 'styled-components';
import { useLocation } from '@reach/router';
import { parse } from 'query-string';

const RecView = ({ rec, lev }) => {
  const [play, setPlay] = useState(
    navigator.userAgent.toLowerCase().indexOf('firefox') === -1,
  );

  const isRehydrated = useStoreRehydrated();

  const { toggleRecAutoplay } = useStoreActions(actions => actions.Battle);

  const {
    settings: { autoPlayRecs },
  } = useStoreState(state => state.Battle);

  const [shareOpen, setShareOpen] = useState(false);
  const [shareAtText, setShareAtText] = useState('00:00');
  const [shareAtSecond, setShareAtSecond] = useState(0);
  const [enableShareAt, setEnableShareAt] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const location = useLocation();
  const shareAtQueryPart =
    enableShareAt && shareAtSecond ? `?t=${shareAtSecond}` : '';
  const shareLink = `${location.origin}${location.pathname}${shareAtQueryPart}`;

  const searchParams = parse(location.search);
  const searchParamSeconds = parseFloat(searchParams && searchParams.t);
  const startFrame = secondsToFrame(searchParamSeconds);

  return (
    <div>
      {!isRehydrated ? null : (
        <PlayerContainer>
          <div className="player">
            {play ? (
              <Recplayer
                rec={rec}
                lev={lev}
                autoPlay={autoPlayRecs ? 'if-visible' : 'no'}
                controls
                startAtFrame={startFrame || 0}
                onFrameChange={frame => {
                  setCurrentFrame(frame);
                }}
              />
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
          <ShareButton
            color="primary"
            onClick={() => {
              setShareOpen(true);
              const seconds = frameToSeconds(currentFrame);
              setShareAtText(secondsToRecTime(seconds));
              setShareAtSecond(seconds);
            }}
          >
            <ShareIcon /> Share
          </ShareButton>
          <Dialog
            open={shareOpen}
            onClose={() => {
              setShareOpen(false);
            }}
            aria-labelledby="share-dialog-title"
            aria-describedby="share-dialog-description"
          >
            <DialogTitle id="share-dialog-title">Share</DialogTitle>
            <DialogContent>
              <DialogContentText id="share-dialog-description">
                <ShareLinkContainer>
                  <ShareLink
                    value={shareLink || ''}
                    readOnly
                    disableUnderline
                  />
                  <Button
                    color="primary"
                    onClick={() => {
                      navigator.clipboard.writeText(shareLink);
                    }}
                  >
                    Copy
                  </Button>
                </ShareLinkContainer>
                <div>
                  <StyledFormControlLabel
                    control={
                      <Checkbox
                        onChange={() => {
                          setEnableShareAt(!enableShareAt);
                        }}
                        checked={enableShareAt}
                        color="primary"
                        size="small"
                      />
                    }
                    label="Start replay at"
                  />
                  <ShareAtField
                    value={shareAtText}
                    hiddenLabel
                    disabled={!enableShareAt}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        const value = event.target.value || '';
                        const parsedValue = value.replace(/[^0-9:]/g, '');
                        let seconds = parsedValue;
                        if (parsedValue.includes(':')) {
                          seconds = getSecondsFromRecTime(parsedValue);
                        }

                        const result = secondsToRecTime(seconds);
                        setShareAtText(result);
                        setShareAtSecond(seconds);
                      }
                    }}
                    onChange={event => {
                      setShareAtText(event.target.value);
                    }}
                  />
                </div>
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </PlayerContainer>
      )}
    </div>
  );
};

const secondsToFrame = (seconds, fps = 30) =>
  parseFloat((seconds * fps).toFixed(2));
const frameToSeconds = (frame, fps = 30) =>
  parseFloat((frame / fps).toFixed(2));

const getSecondsFromRecTime = (value = '00:00') => {
  let result = 0;

  const split = value.split(':');
  for (let i = split.length - 1; i >= 0; i--) {
    const part = Number(split[i]);
    const isCentisecondsPart = i === split.length - 1;
    const isSecondsPart = i === split.length - 2;
    const isMinutesPart = i === split.length - 3;

    if (isCentisecondsPart) {
      result += part / 100;
    } else if (isSecondsPart) {
      result += part;
    } else if (isMinutesPart) {
      result += part * 60;
    }
  }

  return result;
};

function secondsToRecTime(value) {
  const parsedFloat = parseFloat(value).toFixed(2);
  const minutes = Math.floor(parsedFloat / 60);
  const seconds = Math.floor(parsedFloat - minutes * 60);
  const centiseconds = parsedFloat.slice(-2);

  const minutesPart = minutes > 0 ? `${minutes}:` : '';
  const secondsPart = seconds < 10 ? `0${seconds}:` : `${seconds}:`;
  return `${minutesPart}${secondsPart}${centiseconds}`;
}

const ShareLinkContainer = styled.div`
  margin-bottom: 18px;
`;

const ShareAtField = styled(TextField)`
  width: 50px;
`;

const ShareButton = styled(Button)`
  float: right;
`;

const ShareLink = styled(Input)`
  border: 1px solid #8c8c8c;
  width: 360px;
  padding: 0 4px;
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
