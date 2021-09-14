import React from 'react';
import styled from 'styled-components';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import { isEmpty } from 'lodash';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import { Level } from 'components/Names';
import Loading from 'components/Loading';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useNavigate } from '@reach/router';
import { parsedTimeToString, parseTimeHundreds } from '../../utils/recTime';

const cripples = [
  'noVolt',
  'noTurn',
  'oneTurn',
  'noBrake',
  'noThrottle',
  'alwaysThrottle',
  'oneWheel',
  'drunk',
];

const NotFinished = () => {
  return <span title="Not finished">--</span>;
};

const getTimes = (times, LevelIndex, cripple, count, fill = false) => {
  const ts = times?.[LevelIndex]?.[cripple];
  const ret = Array.isArray(ts) ? ts.slice(0, count) : [];

  if (fill) {
    while (ret.length < count) {
      ret.push(null);
    }
  }

  return ret;
};

const getBestTime = (times, LevelIndex, crippleType) => {
  const ts = getTimes(times, LevelIndex, crippleType, 1);
  return ts.length > 0 ? ts[0] : null;
};

const getPersonalBestEtc = (
  personalRecordsPayload,
  bestTimesPayload,
  LevelIndex,
  crippleType,
) => {
  const personalBest = getBestTime(
    personalRecordsPayload,
    LevelIndex,
    crippleType,
  );
  const topX = getTimes(bestTimesPayload, LevelIndex, crippleType, 9999, false);

  if (personalBest === null) {
    return [null, null, null];
  }

  let place = null;

  topX.forEach((time, index) => {
    if (place === null && time.TimeIndex === personalBest.TimeIndex) {
      place = index + 1;
    }
  });

  // if pb === best time, diff is negative.
  let diff = null;

  if (topX[0] !== undefined) {
    if (personalBest.TimeIndex === topX[0].TimeIndex) {
      if (topX[1] !== undefined) {
        diff = personalBest.Time - topX[1].Time;
      }
    } else {
      diff = personalBest.Time - topX[0].Time;
    }
  }

  return [personalBest, place, diff];
};

// for cripple === 'all'
const BestTimeCell = ({ time, loaded }) => {
  if (!loaded) {
    return <ListCell />;
  }

  if (time === null) {
    return (
      <ListCell textAlign="center">
        <NotFinished />
      </ListCell>
    );
  }

  return (
    <ListCell textAlign="center">
      <Kuski
        kuskiData={{
          Kuski: time.Kuski,
          Country: time.Country,
          Team: time.Team,
        }}
        flag={true}
      />
      <LineSep />
      <Time time={time.Time} />
    </ListCell>
  );
};

// for crippleType === 'all-personal'
const PersonalTimeCell = ({
  personalRecords,
  bestTimes,
  LevelIndex,
  crippleType,
}) => {
  if (bestTimes[0] !== 'done' || personalRecords[0] !== 'done') {
    return <ListCell />;
  }

  const [time, place, diff] = getPersonalBestEtc(
    personalRecords[1],
    bestTimes[1],
    LevelIndex,
    crippleType,
  );

  if (time === null) {
    return (
      <ListCell textAlign="center">
        <NotFinished />
      </ListCell>
    );
  }

  return (
    <ListCell textAlign="center">
      <>
        <Time time={time.Time} />
        <LineSep />
        {diff !== null && (
          <TimeDiff
            goodColor={diff <= 0}
            title="Time difference, and place (if top 10)."
          >
            {diff >= 0 ? '+' : '-'}
            {parsedTimeToString(parseTimeHundreds(Math.abs(diff)), false)}
            {place > 0 && ` (${place})`}
          </TimeDiff>
        )}
      </>
    </ListCell>
  );
};

// for crippleType === 'all' || 'all-personal'
const TableAllTypes = ({ levels, bestTimes, personalRecords, isPersonal }) => {
  return (
    <ListContainer>
      <ListHeader>
        <ListCell width={120}>Level</ListCell>
        <ListCell textAlign="center">No Volt</ListCell>
        <ListCell textAlign="center">No Turn</ListCell>
        <ListCell textAlign="center">One Turn</ListCell>
        <ListCell textAlign="center">No Brake</ListCell>
        <ListCell textAlign="center">No Throttle</ListCell>
        <ListCell textAlign="center">Always Throttle</ListCell>
        <ListCell textAlign="center">One Wheel</ListCell>
        <ListCell textAlign="center">Drunk</ListCell>
      </ListHeader>
      {levels.map(level => {
        return (
          <ListRow key={level.LevelIndex}>
            <ListCell>
              <Level LevelIndex={level.LevelIndex} LevelData={level.Level} />
              <LineSep />
              <span>{level.Level.LongName}</span>
            </ListCell>
            {!isPersonal &&
              cripples.map(cripple => {
                return (
                  <BestTimeCell
                    loaded={bestTimes[0] === 'done'}
                    time={getBestTime(bestTimes[1], level.LevelIndex, cripple)}
                  />
                );
              })}
            {isPersonal &&
              cripples.map(cripple => {
                return (
                  <PersonalTimeCell
                    personalRecords={personalRecords}
                    bestTimes={bestTimes}
                    LevelIndex={level.LevelIndex}
                    crippleType={cripple}
                  />
                );
              })}
          </ListRow>
        );
      })}
    </ListContainer>
  );
};

const TableByType = ({
  levels,
  bestTimes,
  personalRecords,
  loggedIn,
  crippleType,
}) => {
  const bestTimesLoaded = bestTimes[0] === 'done';
  const personalRecordsLoaded = personalRecords[0] === 'done';

  return (
    <ListContainer>
      <ListHeader>
        <ListCell width={100}>Filename</ListCell>
        <ListCell width={320}>Level name</ListCell>
        <ListCell width={200}>Kuski</ListCell>
        <ListCell width={130}>Time</ListCell>
        <ListCell>{loggedIn && 'Personal'}</ListCell>
        <ListCell />
      </ListHeader>

      {levels.map(level => {
        const bestTime = getBestTime(
          bestTimes[1],
          level.LevelIndex,
          crippleType,
        );

        const [personalBest, personalPlace] = getPersonalBestEtc(
          personalRecords[1],
          bestTimes[1],
          level.LevelIndex,
          crippleType,
        );

        return (
          <ListRow key={level.LevelIndex}>
            <ListCell>
              <Level LevelIndex={level.LevelIndex} LevelData={level.Level} />
            </ListCell>
            <ListCell>
              <span>{level.Level.LongName}</span>
            </ListCell>
            <ListCell>
              {bestTime !== null && (
                <Kuski
                  kuskiData={{
                    Kuski: bestTime.Kuski,
                    Country: bestTime.Country,
                    TeamData: {
                      Team: bestTime.Team,
                    },
                  }}
                  flag={true}
                  team={true}
                />
              )}
            </ListCell>
            <ListCell>
              {bestTimesLoaded && bestTime === null && <NotFinished />}
              {bestTimesLoaded && bestTime !== null && (
                <Time time={bestTime.Time} />
              )}
            </ListCell>
            <ListCell>
              {loggedIn && bestTimesLoaded && personalRecordsLoaded && (
                <>
                  {personalPlace === 1 && (
                    <span title="First Place">Record</span>
                  )}
                  {personalPlace < 1 && <NotFinished />}
                  {personalPlace > 1 && (
                    <span title="Time, and place (if top 10)">
                      <Time time={personalBest.Time} />
                      {personalPlace > 1 ? ` (${personalPlace})` : ``}
                    </span>
                  )}
                </>
              )}
            </ListCell>
            <ListCell />
          </ListRow>
        );
      })}
    </ListContainer>
  );
};

const Crippled = ({
  LevelPack,
  bestTimes,
  personalRecords,
  crippleType,
  loggedIn,
}) => {
  const levels = isEmpty(LevelPack) ? [] : LevelPack.levels;
  const navigate = useNavigate();

  return (
    <Root>
      <Controls>
        <CrippleSelect>
          <InputLabel id="cripple">Cripple</InputLabel>
          <Select
            id="cripple"
            value={crippleType}
            onChange={e => {
              navigate(
                [
                  '/levels/packs',
                  LevelPack.LevelPackName,
                  'crippled',
                  e.target.value,
                ]
                  .filter(Boolean)
                  .join('/'),
              );
            }}
          >
            <MenuItem value="noVolt">No Volt</MenuItem>
            <MenuItem value="noTurn">No Turn</MenuItem>
            <MenuItem value="oneTurn">One Turn</MenuItem>
            <MenuItem value="noBrake">No Brake</MenuItem>
            <MenuItem value="noThrottle">No Throttle</MenuItem>
            <MenuItem value="alwaysThrottle">Always Throttle</MenuItem>
            <MenuItem value="oneWheel">One Wheel</MenuItem>
            <MenuItem value="drunk">Drunk</MenuItem>
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="all-personal">All Types (Personal)</MenuItem>
          </Select>
        </CrippleSelect>
      </Controls>

      {!crippleType && 'Select a cripple type.'}
      {bestTimes[0] === 'loading' && <Loading />}
      {bestTimes[0] === 'error' && 'Error loading data.'}

      {crippleType === 'all' && (
        <TableAllTypes levels={levels} bestTimes={bestTimes} />
      )}

      {crippleType === 'all-personal' && (
        <TableAllTypes
          levels={levels}
          bestTimes={bestTimes}
          personalRecords={personalRecords}
          isPersonal={true}
        />
      )}

      {crippleType &&
        crippleType !== 'all' &&
        crippleType !== 'all-personal' && (
          <TableByType
            levels={levels}
            bestTimes={bestTimes}
            personalRecords={personalRecords}
            loggedIn={loggedIn}
            crippleType={crippleType}
          />
        )}
    </Root>
  );
};

const Root = styled.div`
  margin-bottom: 30px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 16px;
  padding-bottom: 25px;
  && {
    > * {
      margin-right: 18px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

const LineSep = styled.div`
  height: 3px;
`;

const CrippleSelect = styled(FormControl)`
  min-width: 175px !important;
`;

const TimeDiff = styled.span`
  color: ${p => (p.goodColor ? p.theme.primary : p.theme.errorColor)};
`;

export default Crippled;
