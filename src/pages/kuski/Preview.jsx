import React from 'react';
import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import Time from 'components/Time';
import { has } from 'lodash';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import CloseIcon from '@material-ui/icons/HighlightOffOutlined';
import { Grid, Box, Typography, Backdrop } from '@material-ui/core';
import config from 'config';
import styled from 'styled-components';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

const finishedTypes = {
  B: 'Finished (Apple Bug)',
  D: 'Dead',
  E: 'Escaped',
  F: 'Finished',
  S: 'Spied',
  X: 'Cheated',
};

export default function Preview({
  previewRec,
  setPreviewRec,
  nextReplay,
  previousReplay,
}) {
  return (
    <Backdrop open={true} style={{ zIndex: 100 }}>
      <Container container>
        <Grid item sm={8} xs={12}>
          <Recplayer
            rec={`${config.s3Url}time/${previewRec.TimeFileData.UUID}-${previewRec.TimeFileData.MD5}/${previewRec.TimeIndex}.rec`}
            lev={`${config.dlUrl}level/${previewRec.LevelIndex}?UUID=${previewRec.TimeFileData.UUID}`}
            controls
            autoPlay="yes"
          />
        </Grid>
        <Grid item sm>
          <Box display="flex" flexDirection="column" height="100%">
            <Box p={2}>
              <Box display="flex">
                <Header h2>
                  <Previous onClick={previousReplay} />
                  <a
                    href={`${config.s3Url}time/${previewRec.TimeFileData.UUID}-${previewRec.TimeFileData.MD5}/${previewRec.TimeIndex}.rec`}
                  >
                    Download
                  </a>
                  <Next onClick={nextReplay} />
                </Header>
                <Close
                  onClick={() => setPreviewRec(null)}
                  style={{ marginLeft: 'auto' }}
                />
              </Box>
              <p>
                <Time time={previewRec.Time} /> in{' '}
                <Level
                  LevelData={previewRec.LevelData}
                  LevelIndex={previewRec.LevelIndex}
                />
              </p>
              {has(previewRec, 'Apples') && (
                <Comment>
                  {finishedTypes[previewRec.Finished]}
                  <br />
                  {previewRec.Apples} Apples
                  <br />
                  {previewRec.MaxSpeed / 100} Max speed
                  <br />
                  <Time time={previewRec.ThrottleTime} /> Throttle time
                  <br />
                  <Time time={previewRec.BrakeTime} /> Brake time
                  <br />
                  {previewRec.LeftVolt} Left volts
                  <br />
                  {previewRec.RightVolt} Right volts
                  <br />
                  {previewRec.SuperVolt} Super volts
                  <br />
                  {previewRec.Turn} Turns
                  <br />
                  {previewRec.OneWheel === 1 && (
                    <>
                      One Wheel
                      <br />
                    </>
                  )}
                  {previewRec.Drunk === 1 && <>Drunk</>}
                </Comment>
              )}
            </Box>

            <Box p={2}>
              <Typography variant="caption" display="block">
                Driven{' '}
                <LocalTime
                  date={previewRec.Driven}
                  format="YYYY-MM-DD HH:mm:ss"
                  parse="X"
                />
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Container>
    </Backdrop>
  );
}

const Container = styled(Grid)`
  background: ${p => p.theme.paperBackground};
  width: 80% !important;
  @media (max-width: 730px) {
    width: 100% !important;
  }
`;

const Comment = styled.blockquote`
  background: ${p => p.theme.pageBackground};
  margin: 1em 5px;
  padding: 0.5em 5px;
`;

const Close = styled(CloseIcon)`
  cursor: pointer;
  color: ${p => p.theme.lightTextColor};

  :hover {
    color: red;
  }
`;

const Next = styled(NavigateNextIcon)`
  cursor: pointer;
  color: ${p => p.theme.lightTextColor};

  :hover {
    color: blue;
  }
`;

const Previous = styled(NavigateBeforeIcon)`
  cursor: pointer;
  color: ${p => p.theme.lightTextColor};

  :hover {
    color: blue;
  }
`;
