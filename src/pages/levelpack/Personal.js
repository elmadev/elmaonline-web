import React, { useState, useMemo } from 'react';
import { useStoreRehydrated, useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';
import Time from 'components/Time';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Feedback from 'components/Feedback';
import Loading from 'components/Loading';
import Header from 'components/Header';
import LegacyIcon from 'components/LegacyIcon';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import LevelPopup from './LevelPopup';
import { combinedTT } from 'utils/calcs';
import Compare from 'components/Compare';
import Link from 'components/Link';
import AutoComplete, { KuskiAutoComplete } from 'components/AutoComplete';
import FieldBoolean from 'components/FieldBoolean';

const OtherKuskiLink = ({ otherKuski, getTimes, selectLevel }) => {
  return (
    <span>
      {' '}
      (with{' '}
      <Link
        onClick={e => {
          selectLevel(-1);
          getTimes(otherKuski);
          e.stopPropagation();
        }}
        to=""
      >
        {otherKuski}
      </Link>
      )
    </span>
  );
};

const compareOptions = [
  { type: '', title: 'Multi time', id: 0, key: 'multi', default: true },
  { type: '', title: 'Multi combined', id: 0, key: 'both' },
  { type: '', title: 'Record', id: 0, key: 'record', default: true },
  { type: 'Targets', title: 'Next target', id: 7, key: 'next' },
  { type: 'Targets', title: 'Beginner', id: 6, key: 'beginner' },
  { type: 'Targets', title: 'OK', id: 5, key: 'ok' },
  { type: 'Targets', title: 'Good', id: 4, key: 'good' },
  { type: 'Targets', title: 'Professional', id: 3, key: 'pro' },
  { type: 'Targets', title: 'World Class', id: 2, key: 'wc' },
  { type: 'Targets', title: 'Legendary', id: 1, key: 'legendary' },
  { type: 'Targets', title: 'Godlike', id: 0, key: 'godlike' },
];

const Personal = ({ name }) => {
  const [level, selectLevel] = useState(-1);
  const [longName, setLongName] = useState('');
  const [levelName, setLevelName] = useState('');
  const [relative, setRelative] = useState(false);
  const [compares, setCompares] = useState(
    compareOptions.filter(c => c.default),
  );
  const isRehydrated = useStoreRehydrated();
  const {
    recordsLoading,
    levelPackInfo,
    compareKuski,
    recordsOnly: records,
    timesError,
    highlight,
    multiHighlight,
    personalKuski: kuski,
    settings: { showLegacy, highlightWeeks, showLegacyIcon },
    personalTimes: times,
    kuskis,
  } = useStoreState(state => state.LevelPack);
  const { setError, getPersonalTimes, getCompareKuski } = useStoreActions(
    actions => actions.LevelPack,
  );

  const levels = useMemo(() => {
    let arr = [];
    if (isRehydrated) {
      if (times.packLevels && levelPackInfo?.levels) {
        arr = levelPackInfo.levels.map(r => {
          const timeIndex = times.packLevels.indexOf(r.LevelIndex);
          const obj = {
            single: times.timesData[timeIndex].LevelBesttime,
            Level: r,
            LevelIndex: r.LevelIndex,
          };
          compares.forEach(compare => {
            if (!compare.type) {
              if (compare.key === 'multi') {
                obj[compare.key] =
                  times.timesData[timeIndex].LevelMultiBesttime;
              }
              if (compare.key === 'both') {
                obj[compare.key] =
                  times.timesData[timeIndex].LevelCombinedBesttime;
              }
              if (compare.key === 'record') {
                obj[compare.key] = records[r.LevelIndex];
              }
            }
            if (compare.type === 'Players' && compareKuski[compare.id]) {
              const level = compareKuski[compare.id].find(
                c => c.LevelIndex === r.LevelIndex,
              );
              if (level) {
                obj[compare.key] = level;
              } else {
                obj[compare.key] = {};
              }
            }
            if (compare.type === 'Targets') {
              obj[compare.key] = {};
              if (r.Targets) {
                const targets = r.Targets.split(',');
                if (compare.key === 'next') {
                  targets.every((target, index) => {
                    if (target > obj.single.Time) {
                      return false;
                    }
                    obj[compare.key] = {
                      Time: targets[index],
                    };
                    return true;
                  });
                } else {
                  if (targets[compare.id]) {
                    obj[compare.key] = {
                      Time: targets[compare.id],
                    };
                  }
                }
              }
            }
          });
          return obj;
        });
      }
    }
    return arr;
  }, [compares, times, levelPackInfo, records, isRehydrated, compareKuski]);

  const tts = useMemo(() => {
    const obj = { single: combinedTT(levels, ['single']) };
    compares.forEach(compare => {
      obj[compare.key] = combinedTT(levels, [compare.key]);
    });
    return obj;
  }, [compares, times, levelPackInfo, records, isRehydrated, compareKuski]);

  const updateCompare = values => {
    const newValues = values.filter(v => !compares.find(c => c.key === v.key));
    newValues.forEach(newValue => {
      if (newValue.key.includes('kuski-')) {
        getCompareKuski({
          name: levelPackInfo.LevelPackName,
          PersonalKuskiIndex: newValue.id,
          eolOnly: showLegacy ? 0 : 1,
        });
      }
    });
    setCompares(values);
  };

  const compareOptionsWithKuskis = useMemo(() => {
    if (!kuskis?.length > 0) {
      return compareOptions;
    }
    return [
      ...compareOptions,
      ...kuskis
        .filter(k => k.Kuski !== kuski)
        .map(k => ({
          type: 'Players',
          title: k.Kuski,
          id: k.KuskiIndex,
          key: `kuski-${k.KuskiIndex}`,
          ...k,
        })),
    ];
  }, [kuskis]);

  if (recordsLoading || !isRehydrated) {
    return <Loading />;
  }

  return (
    <>
      <ChoosePlayer>
        <Header h2 mLeft>
          Personal records
        </Header>
        <PlayerCon>
          <KuskiAutoComplete
            list={kuskis}
            selected={kuskis.find(k => k.Kuski === kuski)}
            multiple={false}
            onChange={newValue => {
              getPersonalTimes({
                PersonalKuskiIndex: newValue.Kuski,
                name,
                eolOnly: showLegacy ? 0 : 1,
              });
            }}
          />
        </PlayerCon>
        <CompareCon>
          <AutoComplete
            multiple
            options={compareOptionsWithKuskis}
            getOptionLabel={option => option.title}
            groupBy={option => option.type}
            label="Compare"
            onChange={value => updateCompare(value)}
            value={compares}
            getOptionSelected={(o, v) => o.key === v.key}
            renderOption={option => {
              if (option.KuskiIndex) {
                return <Kuski kuskiData={option} flag team noLink />;
              }
              return option.title;
            }}
          />
        </CompareCon>
        <div>
          <FieldBoolean
            onChange={() => setRelative(!relative)}
            value={relative}
            label="Relative"
          />
        </div>
      </ChoosePlayer>
      <ListContainer>
        <ListHeader>
          <ListCell width={100}>Filename</ListCell>
          <ListCell width={320}>Level name</ListCell>
          <ListCell width={200}>{kuski}</ListCell>
          {compares.map(compare => (
            <ListCell key={compare.key} width={200}>
              {compare.title}
            </ListCell>
          ))}
        </ListHeader>
        {levels.length !== 0 && (
          <>
            {levels.map(r => (
              <TimeRow
                key={r.LevelIndex}
                selected={level === r.LevelIndex}
                onClick={e => {
                  e.preventDefault();
                  if (r.single.Time || r.multi.Time) {
                    selectLevel(level === r.LevelIndex ? -1 : r.LevelIndex);
                    setLongName(r.Level.LongName);
                    setLevelName(r.Level.LevelName);
                  }
                }}
              >
                <ListCell width={100}>
                  <Level LevelIndex={r.LevelIndex} LevelData={r.Level} />
                </ListCell>
                <ListCell>{r.Level.LongName}</ListCell>
                <ListCell
                  highlight={r.single.TimeIndex >= highlight[highlightWeeks]}
                >
                  {r.single.Time && <Time time={r.single.Time} />}
                  {r.single.Source !== null && (
                    <LegacyContainer>
                      <LegacyIcon
                        source={r.single.Source || 0}
                        show={showLegacyIcon}
                      />
                    </LegacyContainer>
                  )}
                </ListCell>
                {compares.map(compare => {
                  if (!compare.type) {
                    if (compare.key === 'multi' && tts.multi.finished !== 0) {
                      return (
                        <ListCell
                          key={compare.key}
                          highlight={
                            r.multi.MultiTimeIndex >=
                            multiHighlight[highlightWeeks]
                          }
                        >
                          {r.multi.Time && (
                            <>
                              <Time time={r.multi.Time} />{' '}
                              <Compare
                                time={r.single.Time}
                                compareTime={r.multi.Time}
                                relative={relative}
                              />
                            </>
                          )}
                          {typeof r.multi.OtherKuski === 'object' ? (
                            <OtherKuskiLink
                              otherKuski={r.multi.OtherKuski.Kuski}
                              getTimes={k =>
                                getPersonalTimes({
                                  PersonalKuskiIndex: k,
                                  name,
                                  eolOnly: showLegacy ? 0 : 1,
                                })
                              }
                              selectLevel={selectLevel}
                            />
                          ) : (
                            !r.multi.OtherKuski ||
                            ' (' + r.multi.OtherKuski + ')'
                          )}
                        </ListCell>
                      );
                    }
                    if (compare.key === 'both') {
                      return (
                        <ListCell key={compare.key}>
                          {r.both.Time && (
                            <>
                              <Time time={r.both.Time} />{' '}
                              <Compare
                                time={r.single.Time}
                                compareTime={r.both.Time}
                                hideCrown
                                relative={relative}
                              />
                            </>
                          )}
                          {typeof r.both.OtherKuski === 'object' ? (
                            <OtherKuskiLink
                              otherKuski={r.both.OtherKuski.Kuski}
                              getTimes={k =>
                                getPersonalTimes({
                                  PersonalKuskiIndex: k,
                                  name,
                                  eolOnly: showLegacy ? 0 : 1,
                                })
                              }
                              selectLevel={selectLevel}
                            />
                          ) : (
                            !r.both.OtherKuski || ' (' + r.both.OtherKuski + ')'
                          )}
                        </ListCell>
                      );
                    }
                    if (compare.key === 'record' && r.record) {
                      return (
                        <ListCell
                          key={compare.key}
                          width={200}
                          highlight={
                            r.record.TimeIndex >= highlight[highlightWeeks]
                          }
                        >
                          {r.record.Time && (
                            <>
                              <Time time={r.record.Time} />{' '}
                              <Compare
                                time={r.single.Time}
                                compareTime={r.record.Time}
                                relative={relative}
                              />{' '}
                              <Kuski kuskiData={r.record.KuskiData} />
                            </>
                          )}
                          {r.record.Source !== null && (
                            <LegacyContainer>
                              <LegacyIcon
                                source={r.record.Source || 0}
                                show={showLegacyIcon}
                              />
                            </LegacyContainer>
                          )}
                        </ListCell>
                      );
                    }
                  }
                  if (compare.type === 'Players' && r[compare.key]) {
                    return (
                      <ListCell
                        key={compare.key}
                        highlight={
                          r[compare.key].TimeIndex >= highlight[highlightWeeks]
                        }
                      >
                        {r[compare.key].Time && (
                          <Time time={r[compare.key].Time} />
                        )}{' '}
                        <Compare
                          time={r.single.Time}
                          compareTime={r[compare.key].Time}
                          relative={relative}
                        />
                      </ListCell>
                    );
                  }
                  if (compare.type === 'Targets' && r[compare.key]) {
                    return (
                      <ListCell key={compare.key}>
                        {r[compare.key].Time && (
                          <Time time={r[compare.key].Time} />
                        )}{' '}
                        <Compare
                          time={r.single.Time}
                          compareTime={r[compare.key].Time}
                          relative={relative}
                        />
                      </ListCell>
                    );
                  }
                  return <ListCell key={compare.key} width={200} />;
                })}
              </TimeRow>
            ))}
            <TTRow>
              <ListCell />
              <ListCell>Total Time</ListCell>
              <ListCell>
                <Time time={tts.single} />
              </ListCell>
              {compares.map(compare => {
                if (!compare.type) {
                  if (compare.key === 'multi' && tts.multi?.finished) {
                    return (
                      <ListCell key={compare.key}>
                        <Time time={tts.multi} />
                      </ListCell>
                    );
                  }
                  if (
                    compare.key === 'both' &&
                    tts.single.finished !== 0 &&
                    tts.multi?.finished
                  ) {
                    return (
                      <ListCell key={compare.key}>
                        <Time time={tts.both} />
                      </ListCell>
                    );
                  }
                  if (compare.key === 'record') {
                    return (
                      <ListCell key={compare.key}>
                        <Time time={tts.record} />{' '}
                        {tts.single.unfinished ? (
                          <>
                            {tts.record.finished - tts.single.finished} /{' '}
                            {tts.record.levs}
                          </>
                        ) : (
                          <Compare
                            time={tts.single.tt}
                            compareTime={tts.record.tt}
                            relative={relative}
                          />
                        )}
                      </ListCell>
                    );
                  }
                }
                if (
                  ['Players', 'Targets'].indexOf(compare.type) > -1 &&
                  tts[compare.key]
                ) {
                  return (
                    <ListCell key={compare.key}>
                      <Time time={tts[compare.key]} />{' '}
                      {tts[compare.key].unfinished ? null : (
                        <Compare
                          time={tts.single.tt}
                          compareTime={tts[compare.key].tt}
                          relative={relative}
                        />
                      )}
                    </ListCell>
                  );
                }
                return <ListCell key={compare.key} />;
              })}
              <ListCell />
            </TTRow>
          </>
        )}
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
          KuskiIndex={times.KuskiIndex}
          showLegacyIcon={showLegacyIcon}
        />
      )}
      <Feedback
        open={timesError !== ''}
        close={() => setError('')}
        text={timesError}
        type="error"
      />
    </>
  );
};

const CompareCon = styled.div`
  min-width: 400px;
`;

const PlayerCon = styled.div`
  min-width: 300px;
`;

const ChoosePlayer = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  div {
    padding-left: 6px;
  }
`;

const LegacyContainer = styled.span`
  padding-left: 5px;
  margin-top: -2px;
`;

const TimeRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  height: 19px;
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
`;

const TTRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? p.theme.primary : p.theme.hoverColor)};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

export default Personal;
