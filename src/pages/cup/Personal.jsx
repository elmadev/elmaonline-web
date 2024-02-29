import React, { useEffect, Fragment, useState } from 'react';
import styled from 'styled-components';
import { nickId } from 'utils/nick';
import { forEach } from 'lodash';
import { format } from 'date-fns';
import {
  Grid,
  Checkbox,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { Paper } from 'components/Paper';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Recplayer from 'components/Recplayer';
import { getPrivateCupRecUri } from 'utils/cups';
import PreviewRecButton from 'components/PreviewRecButton';
import config from 'config';
import FieldBoolean from 'components/FieldBoolean';

const eventSort = (a, b) => a.CupIndex - b.CupIndex;

const currentEventIndex = events => {
  let indices = [];
  forEach(events, e => {
    if (
      e.StartTime < format(new Date(), 't') &&
      e.EndTime > format(new Date(), 't')
    ) {
      indices.push(e.LevelIndex);
    }
  });
  return indices;
};

const Personal = () => {
  const { myReplays, cup, events, myTimes, myTimesOptions } = useStoreState(
    state => state.Cup,
  );
  const {
    getMyReplays,
    updateReplay,
    getMyTimes,
    setMyTimesOptions,
  } = useStoreActions(actions => actions.Cup);

  const [previewRecIndex, setPreviewRecIndex] = useState(null);

  useEffect(() => {
    if (cup?.CupGroupIndex && events?.length > 0) {
      getMyReplays(cup.CupGroupIndex);
      const indices = currentEventIndex(events);
      forEach(indices, index => {
        getMyTimes({
          LevelIndex: index,
          KuskiIndex: nickId(),
          limit: 10000,
          levels: indices,
        });
      });
    }
  }, [cup, events]);

  const isPlayingPreview = CupTimeIndex => {
    return CupTimeIndex === previewRecIndex;
  };

  const handlePreviewRecButtonClick = CupTimeIndex => {
    const newIndex = isPlayingPreview(CupTimeIndex) ? null : CupTimeIndex;
    setPreviewRecIndex(newIndex);
  };

  const timesSort = (a, b) => {
    if (myTimesOptions.order === 'byTime') {
      return a.Time - b.Time;
    }
    if (myTimesOptions.order === 'byDriven') {
      return a.Driven - b.Driven;
    }
  };

  const timesFilter = times => {
    if (myTimesOptions.onlyImproved) {
      const improved = [];
      times
        .sort((a, b) => a.Driven - b.Driven)
        .forEach((t, i) => {
          if (i === 0) {
            improved.push(t);
          } else if (t.Time < improved[improved.length - 1].Time) {
            improved.push(t);
          }
        });
      return improved;
    }
    return times;
  };

  return (
    <Container>
      {nickId() > 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper padding>
              <Header h2>My uploaded replays</Header>
              <div>
                List of all replays you&apos;ve uploaded in all events. Check
                mark means online verified (note that verification only happens
                after an event is done). Check box is for sharing replay with
                team.
              </div>
              {myReplays.sort(eventSort).map((e, i) => (
                <Fragment key={e.CupIndex}>
                  <Header h3 top>
                    Event {i + 1}
                  </Header>
                  {e.CupTimes.filter(t => t.Replay).map(replay => (
                    <Fragment key={replay.CupTimeIndex}>
                      <ReplayCon>
                        <Checkbox
                          checked={replay.ShareReplay === 1}
                          onChange={() =>
                            updateReplay({
                              field: 'ShareReplay',
                              value: replay.ShareReplay ? 'false' : 'true',
                              CupGroupIndex: cup.CupGroupIndex,
                              CupTimeIndex: replay.CupTimeIndex,
                            })
                          }
                        />
                        <Rec
                          href={getPrivateCupRecUri(
                            replay.CupTimeIndex,
                            cup.ShortName,
                            replay.KuskiData.Kuski,
                            replay.Code,
                            i + 1,
                            replay.Time,
                          )}
                        >
                          {replay.TimeExists === 1 && <>✓ </>}
                          <Time time={replay.Time} apples={-1} />
                        </Rec>
                        <PreviewRecButton
                          isPlaying={isPlayingPreview(replay.CupTimeIndex)}
                          setPreviewRecIndex={handlePreviewRecButtonClick}
                          CupTimeIndex={replay.CupTimeIndex}
                        />
                        {replay.Comment !== '0' && replay.Comment !== '' && (
                          <Desc>{replay.Comment}</Desc>
                        )}
                      </ReplayCon>
                      {isPlayingPreview(replay.CupTimeIndex) && (
                        <Recplayer
                          rec={getPrivateCupRecUri(
                            replay.CupTimeIndex,
                            cup.ShortName,
                            replay.KuskiData.Kuski,
                            replay.Code,
                            i + 1,
                            replay.Time,
                          )}
                          lev={`${config.dlUrl}level/${e.LevelIndex}`}
                          shirt={[`${config.dlUrl}shirt/${replay.KuskiData.KuskiIndex}`]}
                          height={400}
                          controls
                        />
                      )}
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper padding>
              <Header h2>Current event times</Header>
              <MyTimesDesc>
                This shows your online times for current event. Can be used to
                verify that your times was registered on the server, as you
                can&apos;t see these anywhere else. Apples results are not shown
                here.
              </MyTimesDesc>
              <RadioGroup
                aria-label="type"
                value={myTimesOptions.order}
                onChange={n =>
                  setMyTimesOptions({
                    ...myTimesOptions,
                    order: n.target.value,
                  })
                }
                name="weeks"
                row
              >
                <FormControlLabel
                  value="byTime"
                  checked={myTimesOptions.order === 'byTime'}
                  label="Order by time"
                  control={<RadioThin size="small" />}
                />
                <FormControlLabel
                  value="byDriven"
                  checked={myTimesOptions.order === 'byDriven'}
                  label="Order chronologically"
                  control={<RadioThin size="small" />}
                />
              </RadioGroup>
              <FieldBoolean
                label="Show only improved times"
                value={myTimesOptions.onlyImproved}
                onChange={() =>
                  setMyTimesOptions({
                    ...myTimesOptions,
                    onlyImproved: !myTimesOptions.onlyImproved,
                  })
                }
              />
              {myTimes && (
                <>
                  {events.sort(eventSort).map((e, i) => {
                    const myTimesInLev = myTimes.filter(
                      m => m.level === e.LevelIndex,
                    );
                    if (myTimesInLev.length === 0) return null;
                    return (
                      <>
                        <Header h3 top>
                          Event {i + 1}
                        </Header>
                        {timesFilter(myTimesInLev[0].times)
                          .sort(timesSort)
                          .map(t => (
                            <ReplayCon key={t.TimeIndex}>
                              <div>
                                <Time time={t.Time} />
                              </div>
                              <Desc>
                                (
                                <LocalTime
                                  date={t.Driven}
                                  format="dddd HH:mm:ss"
                                  parse="X"
                                />
                                )
                              </Desc>
                            </ReplayCon>
                          ))}
                      </>
                    );
                  })}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

const ReplayCon = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Rec = styled.a``;

const Desc = styled.div`
  font-size: 13px;
  margin-left: 8px;
`;

const Container = styled.div`
  padding: 8px;
`;

const RadioThin = styled(Radio)`
  && {
    padding-top: 0;
    padding-bottom: 0;
  }
`;

const MyTimesDesc = styled.div`
  margin-bottom: ${p => p.theme.padSmall};
`;

export default Personal;
