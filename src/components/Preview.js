import React from 'react';
import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Header from 'components/Header';
import Link from 'components/Link';
import Tags from 'components/Tags';
import LocalTime from 'components/LocalTime';
import CloseIcon from '@material-ui/icons/HighlightOffOutlined';
import { Grid, Box, Typography, Backdrop } from '@material-ui/core';
import config from 'config';
import styled from 'styled-components';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

export default function Preview({
  previewRec,
  setPreviewRec,
  nextReplay,
  previousReplay,
}) {
  const getRecUri = () => {
    if (previewRec.UUID.substring(0, 5) === 'local') {
      return `${config.url}temp/${previewRec.UUID}-${previewRec.RecFileName}`;
    } else if (previewRec.UUID.substring(0, 2) === 'b-') {
      return `${config.dlUrl}battlereplay/${previewRec.UUID.split('-')[1]}`;
    }
    return `${config.s3Url}replays/${previewRec.UUID}/${previewRec.RecFileName}`;
  };

  return (
    <Backdrop open={true} style={{ zIndex: 100 }}>
      <Container container>
        <Grid item sm={8} xs={12}>
          <Recplayer
            rec={getRecUri()}
            lev={`${config.dlUrl}level/${previewRec.LevelIndex}?UUID=${previewRec.UUID}`}
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
                  <Link to={`/r/${previewRec.UUID}`}>
                    {previewRec.RecFileName}
                  </Link>
                  <Next onClick={nextReplay} />
                </Header>
                <Close
                  onClick={() => setPreviewRec(null)}
                  style={{ marginLeft: 'auto' }}
                />
              </Box>
              <p>
                <Time thousands time={previewRec.ReplayTime} /> by{' '}
                {previewRec.DrivenByData ? (
                  <Kuski kuskiData={previewRec.DrivenByData} />
                ) : (
                  previewRec.DrivenByText || 'Unknown'
                )}{' '}
                in{' '}
                <Level
                  LevelData={previewRec.LevelData}
                  LevelIndex={previewRec.LevelIndex}
                />
              </p>
              <Tags tags={previewRec.Tags.map(tag => tag.Name)} />
              {previewRec.Comment && <Comment>{previewRec.Comment}</Comment>}
            </Box>

            <Box p={2}>
              <Typography variant="caption" display="block">
                Uploaded by{' '}
                {previewRec.UploadedByData
                  ? previewRec.UploadedByData.Kuski
                  : 'Unknown'}{' '}
                <LocalTime
                  date={previewRec.Uploaded}
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
  border-left: 4px solid ${p => p.theme.pageBackgroundDark};
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
