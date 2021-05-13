import React, { useState } from 'react';
import styled from 'styled-components';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import { Level } from 'components/Names';
import Header from 'components/Header';
import Loading from 'components/Loading';
import { recordsTT } from 'utils/calcs';
import LegacyIcon from 'components/LegacyIcon';
import LevelPopup from './LevelPopup';
import Popularity from 'components/Popularity';
import { formatPct, formatTimeSpent } from '../../utils/format';
import formatDistance from 'date-fns/formatDistance';

const hasSource = records => {
  if (records.length > 0) {
    if (records[0].LevelBesttime) {
      if (records[0].LevelBesttime.Source !== undefined) {
        return true;
      }
    }
  }
  return false;
};

const Records = ({
  highlight,
  highlightWeeks,
  records,
  recordsLoading,
  showLegacyIcon,
  levelStats,
}) => {
  const [level, selectLevel] = useState(-1);
  const [longName, setLongName] = useState('');
  const [levelName, setLevelName] = useState('');

  if (recordsLoading) {
    return <Loading />;
  }

  // eslint-disable-next-line no-unused-vars
  const anyAreLegacy = hasSource(records);

  const MaxRelativeTimeAll = Math.max(
    ...Object.values(levelStats).map(v => v.RelativeTimeAll),
  );

  return (
    <>
      <Header h2 mLeft>
        Levels
      </Header>
      <ListContainer>
        <ListHeader>
          <ListCell width={80}>Filename</ListCell>
          <ListCell width={250}>Level Name</ListCell>
          <ListCell width={140}>Kuski's Played (% Finished)</ListCell>
          <ListCell
            width={170}
            title="Total time played by all kuski's combined."
          >
            Time Played
          </ListCell>
          <ListCell width={170}>Last Driven</ListCell>
          <ListCell width={140}>Kuski</ListCell>
          <ListCell width={140}>Time</ListCell>
        </ListHeader>
        {records.map(r => {
          // levels not played will not have stats objects.
          const stats = levelStats?.[r.LevelIndex] || {};

          const isLegacy =
            r.LevelBesttime && r.LevelBesttime.Source !== undefined;

          const isHighlight =
            r.LevelBesttime &&
            r.LevelBesttime.TimeIndex >= highlight[highlightWeeks];

          // ie. width of popularity bar
          const timePct = formatPct(
            stats.RelativeTimeAll || 0,
            MaxRelativeTimeAll,
          );

          const finishPct = formatPct(
            stats.KuskiCountF,
            stats.KuskiCountAll,
            0,
          );

          const lastDriven = formatDistance(
            new Date((stats.LastDrivenAll || 0) * 1000),
            new Date(),
            { addSuffix: true },
          );

          return (
            <TimeRow
              key={r.LevelIndex}
              onClick={e => {
                e.preventDefault();
                selectLevel(level === r.LevelIndex ? -1 : r.LevelIndex);
                setLongName(r.Level.LongName);
                setLevelName(r.Level.LevelName);
              }}
              selected={level === r.LevelIndex}
            >
              <ListCell>
                <Level LevelIndex={r.LevelIndex} LevelData={r.Level} />
              </ListCell>

              <ListCell>{r.Level.LongName}</ListCell>

              <ListCell>
                {stats.KuskiCountAll || 0}
                {` (${finishPct}%)`}
              </ListCell>

              <ListCell
                title={`Relative time played: ${(
                  stats.RelativeTimeAll || 0
                ).toFixed(2)}`}
              >
                <Popularity
                  widthPct={timePct}
                  before={
                    <div style={{ minWidth: 42 }}>
                      {stats.TimeAll ? formatTimeSpent(stats.TimeAll) : ''}
                    </div>
                  }
                />
              </ListCell>

              <ListCell>{lastDriven}</ListCell>

              <ListCell>
                {r.LevelBesttime && (
                  <Kuski kuskiData={r.LevelBesttime.KuskiData} team flag />
                )}
              </ListCell>

              <ListCell highlight={isHighlight}>
                {r.LevelBesttime && <Time time={r.LevelBesttime.Time} />}
                {isLegacy && (
                  <span style={{ marginLeft: 10 }}>
                    <LegacyIcon
                      source={r.LevelBesttime.Source}
                      show={showLegacyIcon}
                    />
                  </span>
                )}
              </ListCell>
            </TimeRow>
          );
        })}
        <TTRow>
          <ListCell />
          <ListCell />
          <ListCell />
          <ListCell />
          <ListCell />
          <ListCell>Total Time</ListCell>
          <ListCell>
            <Time time={recordsTT(records, 'LevelBesttime')} />
          </ListCell>
        </TTRow>
      </ListContainer>
      {level !== -1 && (
        <LevelPopup
          highlight={highlight[highlightWeeks]}
          levelId={level}
          longName={longName}
          levelName={levelName}
          close={() => {
            selectLevel(-1);
          }}
          showLegacyIcon={showLegacyIcon}
        />
      )}
    </>
  );
};

const TimeRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  cursor: pointer;
  a {
    color: ${p => (p.selected ? 'white' : p.theme.linkColor)};
  }
  span {
    color: ${p => (p.selected ? 'white' : 'inherit')};
  }
  :hover {
    background: ${p => (p.selected ? p.theme.primary : p.theme.hoverColor)};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
  > span {
    :hover {
      .pop-wrapper {
        .pop-bar-1 {
          background: ${p => p.theme.paperBackground};
        }
      }
    }
  }
`;

const TTRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? p.theme.primary : p.theme.hoverColor)};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

export default Records;
