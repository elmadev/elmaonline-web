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
import { isEmpty, sumBy } from 'lodash';
import { LevelPackRecords, useQueryAlt } from '../../api';

const TableRow = ({
  record,
  levelStats,
  highlight,
  highlightWeeks,
  MaxRelativeTimeAll,
  level,
  selectLevel,
  selectedLevel,
  setLongName,
  setLevelName,
  showMoreStats,
  showLegacyIcon,
}) => {
  // levels not played will not have stats objects.
  const stats = levelStats?.[level.LevelIndex] || {};

  // level could be unfinished, or records haven't loaded yet.
  const hasRecord = !isEmpty(record);

  const isLegacy = hasRecord && record.Source !== undefined;

  const isHighlight =
    hasRecord && record.TimeIndex >= highlight[highlightWeeks];

  // ie. width of popularity bar
  const timePct = formatPct(stats.RelativeTimeAll || 0, MaxRelativeTimeAll);

  const finishPct = formatPct(stats.KuskiCountF, stats.KuskiCountAll, 0);

  const lastDriven = formatDistance(
    new Date((stats.LastDrivenAll || 0) * 1000),
    new Date(),
    { addSuffix: true },
  );

  return (
    <TimeRow
      key={level.LevelIndex}
      onClick={e => {
        e.preventDefault();
        selectLevel(level === level.LevelIndex ? -1 : level.LevelIndex);
        setLongName(level.LongName);
        setLevelName(level.LevelName);
      }}
      selected={selectedLevel === level.LevelIndex}
    >
      <ListCell>
        <Level LevelIndex={level.LevelIndex} LevelData={level} />
      </ListCell>

      <ListCell>{level.LongName}</ListCell>

      {hasRecord && (
        <>
          <ListCell>
            <Kuski kuskiData={record.KuskiData} team flag />
          </ListCell>
          <ListCell highlight={isHighlight}>
            <Time time={record.Time} />
            {isLegacy && (
              <span style={{ marginLeft: 10 }}>
                <LegacyIcon source={record.Source} show={showLegacyIcon} />
              </span>
            )}
          </ListCell>
        </>
      )}

      {!hasRecord && (
        <>
          <ListCell />
          <ListCell />
        </>
      )}

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
};

const Records = ({
  levelPackInfo,
  levelStats,
  showLegacy,
  highlight,
  highlightWeeks,
  showLegacyIcon,
  showMoreStats,
}) => {
  const [selectedLevel, selectLevel] = useState(-1);
  const [longName, setLongName] = useState('');
  const [levelName, setLevelName] = useState('');

  const { setShowMoreStats } = useStoreActions(state => state.LevelPack);

  const { data: records, isLoading: recordsLoading } = useQueryAlt(
    [
      'LevelPackRecords',
      levelPackInfo?.name,
      levelPackInfo?.Legacy,
      showLegacy,
    ],
    async () =>
      LevelPackRecords(
        levelPackInfo.LevelPackName,
        levelPackInfo.Legacy && !showLegacy,
      ),
    { enabled: !isEmpty(levelPackInfo) },
  );

  if (isEmpty(levelPackInfo)) {
    return <Loading />;
  }

  const levels = levelPackInfo.levels;

  const totalTimeArgs = isEmpty(levels)
    ? { tt: 0 }
    : recordsTT(
        levels.map(l => ({
          record: isEmpty(records?.[l.LevelIndex])
            ? null
            : [records[l.LevelIndex]],
        })),
        'record',
      );

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

      {recordsLoading && <Loading />}

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

        {levels.map(level => {
          const record = isEmpty(records) ? null : records[level.LevelIndex];
          return (
            <TableRow
              {...{
                key: level.LevelIndex,
                level,
                record,
                levelStats,
                highlight,
                highlightWeeks,
                MaxRelativeTimeAll,
                selectedLevel,
                selectLevel,
                setLongName,
                setLevelName,
                showMoreStats,
                showLegacyIcon,
              }}
            />
          );
        })}

        <TTRow>
          <ListCell />
          <ListCell />
          <ListCell>Total Time</ListCell>
          <ListCell>
            <Time time={totalTimeArgs} />
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
      {selectedLevel !== -1 && (
        <LevelPopup
          highlight={highlight[highlightWeeks]}
          levelId={selectedLevel}
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
  > span:hover {
    .pop-bar-1 {
      background: ${p => p.theme.paperBackground};
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
