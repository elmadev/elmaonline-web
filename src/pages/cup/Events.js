import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from '@reach/router';
import { formatDistance, format } from 'date-fns';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import CupResults from 'components/CupResults';
import Kuski from 'components/Kuski';
import { Today, CheckBox, Timer } from '@material-ui/icons';
import { Tabs, Tab, Grid } from '@material-ui/core';
import Recplayer from 'components/Recplayer';
import Download from 'components/Download';
import config from 'config';
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
          <EventContainer
            key={e.CupIndex}
            highlight={i === eventIndex}
            onClick={() =>
              // persist selected eventTab when changing events.
              navigate(
                ['/cup', cup.ShortName, 'events', i + 1, eventTab]
                  .filter(Boolean)
                  .join('/'),
              )
            }
          >
            <EventNo>{i + 1}.</EventNo>
            <RightSide>
              <By>
                <Download href={`level/${e.LevelIndex}`}>
                  {e.Level ? e.Level.LevelName : ''}
                </Download>{' '}
                by <Kuski kuskiData={e.KuskiData} />
              </By>
              <div>
                <Today />{' '}
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
              </div>
              <div>
                {e.EndTime > format(new Date(), 't') &&
                  e.StartTime < format(new Date(), 't') && (
                    <>
                      <Timer /> Deadline{' '}
                      {formatDistance(new Date(e.EndTime * 1000), new Date(), {
                        addSuffix: true,
                      })}
                    </>
                  )}
                {e.EndTime > format(new Date(), 't') &&
                  e.StartTime > format(new Date(), 't') && (
                    <>
                      <Timer /> Starts{' '}
                      {formatDistance(
                        new Date(e.StartTime * 1000),
                        new Date(),
                        {
                          addSuffix: true,
                        },
                      )}
                    </>
                  )}
                {e.EndTime < format(new Date(), 't') && (
                  <>
                    <CheckBox />
                    {GetWinner(e.CupTimes)}
                  </>
                )}
              </div>
            </RightSide>
          </EventContainer>
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

const By = styled.div`
  font-weight: bold;
`;

const EventContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100px;
  cursor: pointer;
  background-color: ${props => (props.highlight ? '#219653' : 'transparent')};
  color: ${props => (props.highlight ? 'white' : 'black')};
  a {
    color: ${props => (props.highlight ? 'white' : '#219653')};
  }
`;

const EventNo = styled.div`
  width: 100px;
  font-size: 56px;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const RightSide = styled.div`
  flex-grow: 1;
  flex-direction: column;
  padding: 8px;
`;

export default Cups;
