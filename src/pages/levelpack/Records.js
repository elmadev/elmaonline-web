import React, { useState } from 'react';
import styled from 'styled-components';
import { useStoreActions } from 'easy-peasy';
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
import Switch from 'components/Switch';
import { Row } from 'components/Containers';

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
  showMoreStats,
  levelStats,
}) => {
  const [level, selectLevel] = useState(-1);
  const [longName, setLongName] = useState('');
  const [levelName, setLevelName] = useState('');

  const { setShowMoreStats } = useStoreActions(state => state.LevelPack);

  if (recordsLoading) {
    return <Loading />;
  }

  // eslint-disable-next-line no-unused-vars
  const anyAreLegacy = hasSource(records);

  const MaxRelativeTimeAll = Math.max(
    ...Object.values(levelStats || {}).map(v => v.RelativeTimeAll),
  );

  return (
    <>
      <Row ai="center" jc="space-between" width="100%">
        <Header h2 mLeft>
          Levels
        </Header>
        <Switch checked={showMoreStats} onChange={setShowMoreStats}>
          Level Stats
        </Switch>
      </Row>

      <ListContainer>
        <ListHeader>
          <ListCell width={90}>Filename</ListCell>
          <ListCell width={showMoreStats ? 260 : 320}>Level Name</ListCell>
          <ListCell width={150}>Kuski</ListCell>
          <ListCell width={150}>Time</ListCell>

          {showMoreStats && <ListCell width={170}>Last Driven</ListCell>}

          {showMoreStats && (
            <ListCell width={140}>
              Kuski's Played <br />
              <span title="Percentage of kuski's that finished the level at least once.">
                (% Finished)
              </span>
            </ListCell>
          )}

          {showMoreStats && (
            <ListCell
              width={50}
              title="Total time played by all kuski's combined."
            >
              Time Played
            </ListCell>
          )}

          <ListCell
            width={150}
            title="Time played on level (by all kuski's), relative to other levels in this pack."
          >
            Popularity
          </ListCell>

          {!showMoreStats && <ListCell />}
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

              {showMoreStats && <ListCell>{lastDriven}</ListCell>}

              {showMoreStats && (
                <ListCell>
                  {stats.KuskiCountAll || 0}
                  {` (${finishPct}%)`}
                </ListCell>
              )}

              {showMoreStats && (
                <ListCell>
                  {stats.TimeAll ? formatTimeSpent(stats.TimeAll) : ''}
                </ListCell>
              )}

              <ListCell>
                <div style={{ minWidth: 100 }}>
                  <Popularity
                    widthPct={timePct}
                    title={stats.TimeAll ? formatTimeSpent(stats.TimeAll) : ''}
                  />
                </div>
              </ListCell>

              {!showMoreStats && <ListCell />}
            </TimeRow>
          );
        })}
        <TTRow>
          <ListCell />
          <ListCell />
          <ListCell>Total Time</ListCell>
          <ListCell>
            <Time time={recordsTT(records, 'LevelBesttime')} />
          </ListCell>
          <ListCell />
          {showMoreStats && (
            <>
              <ListCell />
              <ListCell />
              <ListCell />
            </>
          )}
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
