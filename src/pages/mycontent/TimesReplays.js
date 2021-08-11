import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {
  Button as MuiButton,
  Backdrop,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Chip,
} from '@material-ui/core';
import { Paper } from 'components/Paper';
import { Row } from 'components/Containers';
import Time from 'components/Time';
import LocalTime from 'components/LocalTime';
import { Level } from 'components/Names';
import {
  PlayArrow,
  Share,
  HighlightOffOutlined as CloseIcon,
} from '@material-ui/icons';
import styled from 'styled-components';
import config from 'config';
import { FixedSizeList as List } from 'react-window';
import {
  ListContainer,
  ListCell,
  ListRow,
  ListHeader,
  ListInput,
} from 'components/List';
import useElementSize from 'utils/useWindowSize';
import Link from 'components/Link';
import { nick } from 'utils/nick';
import Button from 'components/Buttons';
import { xor } from 'lodash';
import Preview from './Preview';

const TimesReplays = () => {
  const [hover, setHover] = useState(0);
  const [replay, openReplay] = useState(null);
  const [replayIndex, setReplayIndex] = useState(0);
  const [share, setShare] = useState(null);
  const { timesAndReplays, search } = useStoreState(state => state.MyContent);
  const { getTagOptions } = useStoreActions(actions => actions.Upload);
  const { tagOptions } = useStoreState(state => state.Upload);
  const { getTimesAndReplays, shareTimeFile, setSearch } = useStoreActions(
    actions => actions.MyContent,
  );
  const windowSize = useElementSize();
  const listHeight = windowSize.height - 209;
  useEffect(() => {
    getTimesAndReplays({ limit: 100, search });
    getTagOptions();
  }, []);

  const close = () => {
    openReplay(null);
    setReplayIndex(0);
  };

  const nextReplay = () => {
    const next = replayIndex + 1;
    if (next >= timesAndReplays.length) {
      close();
      return;
    }
    if (!timesAndReplays[next].TimeFileData) {
      close();
      return;
    }
    openReplay(timesAndReplays[next]);
    setReplayIndex(next);
  };

  const previousReplay = () => {
    const prev = replayIndex - 1;
    if (prev < 0) {
      close();
      return;
    }
    if (!timesAndReplays[prev].TimeFileData) {
      close();
      return;
    }
    openReplay(timesAndReplays[prev]);
    setReplayIndex(prev);
  };

  const selectToShare = rec => {
    setShare({
      time: rec,
      comment: '',
      hide: false,
      unlisted: false,
      tags: [],
    });
  };

  const shareReplay = () => {
    shareTimeFile({
      ...share.time,
      Unlisted: share.unlisted,
      Hide: share.hide,
      Comment: share.comment,
      Tags: share.tags,
    });
    setShare(null);
  };

  const replayUrl = time => {
    if (!time.TimeFileData) {
      return '';
    }
    const timeAsString = `${time.Time}`;
    const RecFileName = `${time.LevelData.LevelName}${nick().substring(
      0,
      Math.min(15 - (time.LevelData.LevelName.length + timeAsString.length), 4),
    )}${timeAsString}`;
    return `/r/${time.TimeFileData.UUID}/${RecFileName}`;
  };

  return (
    <>
      <Paper>
        <ListContainer>
          <ListHeader>
            <ListCell width={120}>Level</ListCell>
            <ListCell width={120}>Time</ListCell>
            <ListCell width={100}>Driven</ListCell>
            <ListCell width={100}></ListCell>
            <ListCell>Replay</ListCell>
          </ListHeader>
          <ListRow>
            <ListInput
              label="Search level"
              value={search.level}
              onChange={value => setSearch({ field: 'level', value })}
              maxLength={11}
              onEnter={level =>
                getTimesAndReplays({ limit: 100, search: { ...search, level } })
              }
            />
            <ListCell />
            <ListInput
              label="Driven on or after"
              date
              value={search.from}
              onChange={value => {
                setSearch({ field: 'from', value });
                getTimesAndReplays({
                  limit: 100,
                  search: { ...search, from: value },
                });
              }}
            />
            <ListInput
              label="Driven on or before"
              date
              value={search.to}
              onChange={value => {
                setSearch({ field: 'to', value });
                getTimesAndReplays({
                  limit: 100,
                  search: { ...search, to: value },
                });
              }}
            />
            <ListCell />
          </ListRow>
        </ListContainer>
        {timesAndReplays.length > 0 && (
          <ListContainer flex>
            <List
              height={!isNaN(listHeight) ? listHeight : 0}
              itemCount={timesAndReplays.length}
              itemSize={40}
            >
              {({ index, style }) => {
                const time = timesAndReplays[index];
                return (
                  <div style={style} key={time.AllFinishedIndex}>
                    <ListRow
                      onHover={hovering => {
                        if (hovering) {
                          setHover(time.AllFinishedIndex);
                        } else {
                          setHover(0);
                        }
                      }}
                    >
                      <ListCell width={120}>
                        <Level
                          LevelIndex={time.LevelIndex}
                          LevelData={time.LevelData}
                        />
                      </ListCell>
                      <ListCell width={120}>
                        <Time time={time.Time} />
                      </ListCell>
                      <ListCell width={200}>
                        <LocalTime
                          date={time.Driven}
                          format="ddd D MMM YYYY HH:mm:ss"
                          parse="X"
                        />
                      </ListCell>
                      <ListCell width={50} />
                      <ListCell>
                        {hover === time.AllFinishedIndex && time.TimeFileData && (
                          <>
                            <a
                              href={`${config.s3Url}time/${time.TimeFileData.UUID}-${time.TimeFileData.MD5}/${time.TimeIndex}.rec`}
                            >
                              Download
                            </a>
                            <MuiButton
                              title="View"
                              onClick={() => {
                                openReplay(time);
                                setReplayIndex(index);
                              }}
                            >
                              <PlayArrow />
                            </MuiButton>
                            {time.TimeFileData.Shared === 0 && (
                              <MuiButton
                                title="Share"
                                onClick={() => {
                                  selectToShare(time);
                                }}
                              >
                                <Share />
                              </MuiButton>
                            )}
                            {time.TimeFileData.Shared === 1 && (
                              <Link to={replayUrl(time)}>
                                <div>Go to replay page</div>
                              </Link>
                            )}
                          </>
                        )}
                      </ListCell>
                    </ListRow>
                  </div>
                );
              }}
            </List>
          </ListContainer>
        )}
      </Paper>
      {replay && (
        <Preview
          previewRec={replay}
          setPreviewRec={() => close()}
          nextReplay={() => nextReplay()}
          previousReplay={() => previousReplay()}
        />
      )}
      {share && (
        <Backdrop open={true} style={{ zIndex: 100 }}>
          <Container>
            <Row jc="space-between">
              <div>
                Share <Time time={share.time.Time} /> in{' '}
                <Level
                  LevelIndex={share.time.LevelIndex}
                  LevelData={share.time.LevelData}
                />{' '}
                driven at{' '}
                <LocalTime
                  date={share.time.Driven}
                  format="ddd D MMM YYYY HH:mm:ss"
                  parse="X"
                />
              </div>
              <Close onClick={() => setShare(null)} />
            </Row>
            <div>
              <TextField
                id="Comment"
                multiline
                label="Comment"
                value={share ? share.comment : ''}
                onChange={e => setShare({ ...share, comment: e.target.value })}
                margin="normal"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={share ? share.unlisted : false}
                    onChange={e =>
                      setShare({ ...share, unlisted: !share.unlisted })
                    }
                    value="unlisted"
                    color="primary"
                  />
                }
                label="Unlisted"
              />
            </div>
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={share ? share.hide : false}
                    onChange={e => setShare({ ...share, hide: !share.hide })}
                    value="hide"
                    color="primary"
                  />
                }
                label="Hide in latest replays"
              />
            </div>
            <Typography color="textSecondary">Tags</Typography>
            <div>
              {tagOptions.map(option => {
                if (share.tags.includes(option)) {
                  return (
                    <Chip
                      label={option.Name}
                      onDelete={() =>
                        setShare({
                          ...share,
                          tags: xor(share.tags, [option]),
                        })
                      }
                      color="primary"
                      style={{ margin: 4 }}
                    />
                  );
                } else {
                  return (
                    <Chip
                      label={option.Name}
                      onClick={() =>
                        setShare({
                          ...share,
                          tags: xor(share.tags, [option]),
                        })
                      }
                      style={{ margin: 4 }}
                    />
                  );
                }
              })}
            </div>
            <Button margin="6px" onClick={() => shareReplay()}>
              Share
            </Button>
          </Container>
        </Backdrop>
      )}
    </>
  );
};

const Close = styled(CloseIcon)`
  cursor: pointer;
  color: ${p => p.theme.lightTextColor};

  :hover {
    color: red;
  }
`;

const Container = styled.div`
  background: ${p => p.theme.paperBackground};
  width: 50%;
  @media (max-width: 730px) {
    width: 100%;
  }
  padding: ${p => p.theme.padMedium};
`;

export default TimesReplays;
