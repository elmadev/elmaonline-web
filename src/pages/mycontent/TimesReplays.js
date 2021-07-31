import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Button } from '@material-ui/core';
import { Paper } from 'components/Paper';
import Time from 'components/Time';
import LocalTime from 'components/LocalTime';
import { Level } from 'components/Names';
import { PlayArrow, Share } from '@material-ui/icons';
import config from 'config';
import { FixedSizeList as List } from 'react-window';
import { ListContainer, ListCell, ListRow, ListHeader } from 'components/List';
import useElementSize from 'utils/useWindowSize';
import Preview from './Preview';

const TimesReplays = () => {
  const [hover, setHover] = useState(0);
  const [replay, openReplay] = useState(null);
  const [replayIndex, setReplayIndex] = useState(0);
  const { timesAndReplays } = useStoreState(state => state.MyContent);
  const { getTimesAndReplays, shareTimeFile } = useStoreActions(
    actions => actions.MyContent,
  );
  const windowSize = useElementSize();
  const listHeight = windowSize.height - 169;
  useEffect(() => {
    getTimesAndReplays(100);
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

  const shareReplay = rec => {
    shareTimeFile({
      ...rec,
      Unlisted: 0,
      Comment: '',
    });
  };

  return (
    <>
      <Paper>
        <ListContainer>
          <ListHeader>
            <ListCell width={120}>Level</ListCell>
            <ListCell width={120}>Time</ListCell>
            <ListCell width={200}>Driven</ListCell>
            <ListCell>Replay</ListCell>
          </ListHeader>
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
                      <ListCell>
                        {hover === time.AllFinishedIndex && time.TimeFileData && (
                          <>
                            <a
                              href={`${config.s3Url}time/${time.TimeFileData.UUID}-${time.TimeFileData.MD5}/${time.TimeIndex}.rec`}
                            >
                              Download
                            </a>
                            <Button
                              title="View"
                              onClick={() => {
                                openReplay(time);
                                setReplayIndex(index);
                              }}
                            >
                              <PlayArrow />
                            </Button>
                            <Button
                              title="Share"
                              onClick={() => {
                                shareReplay(time);
                              }}
                            >
                              <Share />
                            </Button>
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
    </>
  );
};

export default TimesReplays;
