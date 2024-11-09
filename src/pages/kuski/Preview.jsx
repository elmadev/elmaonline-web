import React from 'react';
import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import Time from 'components/Time';
import { has } from 'lodash';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import CloseIcon from '@material-ui/icons/HighlightOffOutlined';
import { Grid, Typography, Backdrop } from '@material-ui/core';
import config from 'config';
import styled from '@emotion/styled';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { Column, Row } from 'components/Containers';

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
            shirt={[`${config.dlUrl}shirt/${previewRec.KuskiIndex}`]}
            controls
            autoPlay="yes"
          />
        </Grid>
        <Grid item sm>
          <Column height="100%">
            <PadY>
              <Row>
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
              </Row>
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
            </PadY>

            <PadY>
              <Typography variant="caption" display="block">
                Driven{' '}
                <LocalTime
                  date={previewRec.Driven}
                  format="yyyy-MM-dd HH:mm:ss"
                  parse="X"
                />
              </Typography>
            </PadY>
          </Column>
        </Grid>
      </Container>
    </Backdrop>
  );
}

const PadY = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
`;

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
