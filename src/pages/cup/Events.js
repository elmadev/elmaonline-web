import React from 'react';
import styled from 'styled-components';
import { useNavigate } from '@reach/router';
import { format } from 'date-fns';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import CupResults from 'components/CupResults';
import Kuski from 'components/Kuski';
import { Tabs, Tab, Grid } from '@material-ui/core';
import Recplayer from 'components/Recplayer';
import Download from 'components/Download';
import EventItem from 'components/EventItem';
import config from 'config';
import { Paper } from 'components/Paper';
import Interviews from './Interviews';
import Leaders from './Leaders';

const eventSort = (a, b) => a.CupIndex - b.CupIndex;

const GetWinner = times => {
  if (times.length > 0) {
    const ordered = times.sort((a, b) => a.Time - b.Time);
    return (
      <>
        <Time time={ordered[0].Time} /> by {ordered[0].KuskiData.Kuski}
      </>
    );
  }
  return '';
};

const Cups = props => {
  const { cup, events, eventNumber, eventTab } = props;
  const eventIndex = eventNumber - 1;
  const navigate = useNavigate();

  if (!events) {
    return <div>No events found.</div>;
  }

  const event = events[eventIndex];

  if (event === undefined) {
    return <div>Event does not exist.</div>;
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={6}>
        {events.sort(eventSort).map((e, i) => (
          <EventItem
            key={e.CupIndex}
            i={i}
            selected={eventIndex}
            onClick={() =>
              // persist selected eventTab when changing events.
              navigate(
                ['/cup', cup.ShortName, 'events', i + 1, eventTab]
                  .filter(Boolean)
                  .join('/'),
              )
            }
            level={
              <Download href={`level/${e.LevelIndex}`}>
                {e.Level ? e.Level.LevelName : ''}
              </Download>
            }
            by={<Kuski kuskiData={e.KuskiData} />}
            eventTime={
              <>
                <LocalTime
                  date={e.StartTime}
                  format="ddd D MMM HH:mm"
                  parse="X"
                />{' '}
                -{' '}
                <LocalTime
                  date={e.EndTime}
                  format="ddd D MMM YYYY HH:mm"
                  parse="X"
                />
              </>
            }
            start={e.StartTime}
            end={e.EndTime}
            winner={GetWinner(e.CupTimes)}
          />
        ))}
      </Grid>
      {(() => {
        const hasEnded = event.StartTime < format(new Date(), 't');

        return (
          <Grid item xs={12} sm={6}>
            <Tabs
              variant="scrollable"
              scrollButtons="auto"
              value={eventTab}
              onChange={(e, value) => {
                navigate(
                  ['/cup', cup.ShortName, 'events', eventNumber, value]
                    .filter(Boolean)
                    .join('/'),
                );
              }}
            >
              <Tab label="Results" value="results" />
              {hasEnded && <Tab label="Map" value="map" />}
              {hasEnded && <Tab label="Interviews" value="interviews" />}
              {hasEnded && <Tab label="Leaders" value="leaders" />}
            </Tabs>
            <Paper>
              {eventTab === 'results' && (
                <CupResults
                  CupIndex={event.CupIndex}
                  ShortName={cup.ShortName}
                  eventNo={eventIndex + 1}
                  results={event.CupTimes}
                />
              )}
              {eventTab === 'map' && hasEnded && (
                <PlayerContainer>
                  <Recplayer
                    lev={`${config.dlUrl}level/${events[eventIndex].LevelIndex}`}
                    controls
                  />
                </PlayerContainer>
              )}
              {eventTab === 'interviews' && hasEnded && (
                <Interviews cup={cup} event={events[eventIndex]} />
              )}
              {eventTab === 'leaders' && hasEnded && (
                <Leaders event={events[eventIndex]} />
              )}
            </Paper>
          </Grid>
        );
      })()}
    </Grid>
  );
};

const PlayerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
`;

export default Cups;
