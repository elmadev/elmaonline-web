import React from 'react';
import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Header from 'components/Header';
import Link from 'components/Link';
import { FixedSizeList as List } from 'react-window';
import Tags from 'components/Tags';
import LocalTime from 'components/LocalTime';
import CloseIcon from '@material-ui/icons/HighlightOffOutlined';
import { Grid, Box, Typography } from '@material-ui/core';
import config from 'config';
import { ListContainer, ListHeader, ListRow, ListCell } from 'components/List';
import styled from 'styled-components';

export default function Preview({
  previewRec,
  setPreviewRec,
  getRelatedRecs,
  handleReplayClick,
}) {
  const getRecUri = () => {
    if (previewRec.UUID.substring(0, 5) === 'local') {
      return `${config.url}temp/${previewRec.UUID}-${previewRec.RecFileName}`;
    }
    return `${config.s3Url}replays/${previewRec.UUID}/${previewRec.RecFileName}`;
  };

  return (
    <Grid container>
      <Grid item sm={8}>
        <Recplayer
          rec={getRecUri()}
          lev={`${config.dlUrl}level/${previewRec.LevelIndex}?UUID=${previewRec.UUID}`}
          controls
          height={480}
          autoPlay="yes"
        />
      </Grid>
      <Grid item sm>
        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="space-between"
        >
          <Box p={2}>
            <Header h2>
              <Link to={`/r/${previewRec.UUID}`}>{previewRec.RecFileName}</Link>

              <Close
                onClick={() => setPreviewRec(null)}
                style={{ position: 'absolute', right: 12 }}
              />
            </Header>

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

          <div>
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
            <ListContainer>
              <ListHeader>
                <ListCell width={200}>By</ListCell>
                <ListCell width={200}>Replay</ListCell>
                <ListCell right>Time</ListCell>
              </ListHeader>
            </ListContainer>
            <ListContainer>
              <List
                className="List"
                height={200}
                itemCount={getRelatedRecs().length}
                itemSize={40}
              >
                {({ index, style }) => {
                  const replay = getRelatedRecs()[index];
                  return (
                    <div style={style} key={replay.UUID}>
                      <ListRow
                        key={replay.ReplayIndex}
                        onClick={() => handleReplayClick(replay)}
                        selected={replay.ReplayIndex === previewRec.ReplayIndex}
                        bg="#FFF"
                      >
                        <ListCell width={200}>
                          {replay.DrivenByData ? (
                            <Kuski kuskiData={replay.DrivenByData} />
                          ) : (
                            <div>{replay.DrivenByText || 'Unknown'}</div>
                          )}
                        </ListCell>
                        <ListCell width={200}>
                          <Link to={`/r/${replay.UUID}`}>
                            {replay.RecFileName}
                          </Link>
                        </ListCell>
                        <ListCell right>
                          <Time thousands time={replay.ReplayTime} />
                        </ListCell>
                      </ListRow>
                    </div>
                  );
                }}
              </List>
            </ListContainer>
          </div>
        </Box>
      </Grid>
    </Grid>
  );
}

const Comment = styled.blockquote`
  border-left: 4px solid #c4c4c4;
  background: #f1f1f1;
  margin: 1em 5px;
  padding: 0.5em 5px;
`;

const Close = styled(CloseIcon)`
  cursor: pointer;
  color: #c4c4c4;

  :hover {
    color: red;
  }
`;
