import React, { useState } from 'react';
import { useStoreRehydrated } from 'easy-peasy';
import styled from 'styled-components';
import { Edit } from '@material-ui/icons';
import { useStoreState } from 'easy-peasy';
import Time from 'components/Time';
import { Level } from 'components/Names';
import ClickToEdit from 'components/ClickToEdit';
import Feedback from 'components/Feedback';
import Loading from 'components/Loading';
import Header from 'components/Header';
import LegacyIcon from 'components/LegacyIcon';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import LevelPopup from './LevelPopup';
import { combinedTT } from 'utils/calcs';
import Link from '../../components/Link';

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

const Personal = ({
  times,
  getTimes,
  highlight,
  multiHighlight,
  highlightWeeks,
  timesError,
  setError,
  records,
  showLegacyIcon,
  kuski,
}) => {
  const [level, selectLevel] = useState(-1);
  const [longName, setLongName] = useState('');
  const [levelName, setLevelName] = useState('');
  const isRehydrated = useStoreRehydrated();
  const { recordsLoading } = useStoreState(state => state.LevelPack);

  if (recordsLoading || !isRehydrated) {
    return <Loading />;
  }

  let levels = [];
  if (isRehydrated) {
    if (times.packLevels) {
      levels = records.map(r => {
        const timeIndex = times.packLevels.indexOf(r.LevelIndex);
        return {
          single: times.timesData[timeIndex].LevelBesttime,
          multi: times.timesData[timeIndex].LevelMultiBesttime,
          both: times.timesData[timeIndex].LevelCombinedBesttime,
          Level: r.Level,
          LevelIndex: r.LevelIndex,
        };
      });
    }
  }
  const tts = [
    combinedTT(levels, ['single']),
    combinedTT(levels, ['multi']),
    combinedTT(levels, ['single', 'multi']),
  ];

  return (
    <>
      <Header h2 mLeft>
        Personal records
      </Header>
      <ChoosePlayer>
        <span>Select player: </span>
        <div>
          <ClickToEdit value={kuski} update={newKuski => getTimes(newKuski)}>
            <KuskiLink>{kuski}</KuskiLink> <EditIcon />
          </ClickToEdit>
        </div>
      </ChoosePlayer>
      <ListContainer>
        <ListHeader>
          <ListCell width={100}>Filename</ListCell>
          <ListCell width={320}>Level name</ListCell>
          <ListCell width={200}>Single time</ListCell>
          {tts[1].finished !== 0 && <ListCell width={200}>Multi time</ListCell>}
          {tts[0].finished !== 0 && tts[1].finished !== 0 && (
            <ListCell width={200}>Difference</ListCell>
          )}
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
                {tts[1].finished !== 0 && (
                  <ListCell
                    highlight={
                      r.multi.MultiTimeIndex >= multiHighlight[highlightWeeks]
                    }
                  >
                    {r.multi.Time && <Time time={r.multi.Time} />}
                    {typeof r.multi.OtherKuski === 'object' ? (
                      <OtherKuskiLink
                        otherKuski={r.multi.OtherKuski.Kuski}
                        getTimes={getTimes}
                        selectLevel={selectLevel}
                      />
                    ) : (
                      !r.multi.OtherKuski || ' (' + r.multi.OtherKuski + ')'
                    )}
                  </ListCell>
                )}
                {tts[0].finished !== 0 && tts[1].finished !== 0 && (
                  <ListCell
                    highlight={
                      r.multi.MultiTimeIndex >=
                        multiHighlight[highlightWeeks] ||
                      r.single.TimeIndex >= highlight[highlightWeeks]
                    }
                  >
                    <Compare bettertime={r.multi.Time > r.single.Time}>
                      {r.multi.Time &&
                        r.single.Time &&
                        (r.multi.Time > r.single.Time ? '-' : '+')}
                      {r.multi.Time && r.single.Time && (
                        <Time time={Math.abs(r.multi.Time - r.single.Time)} />
                      )}
                    </Compare>
                  </ListCell>
                )}
              </TimeRow>
            ))}
            {isRehydrated ? (
              <TTRow>
                <ListCell />
                <ListCell>Total Time</ListCell>
                <ListCell>
                  <Time time={tts[0]} />
                </ListCell>
                {tts[1].finished !== 0 && (
                  <ListCell>
                    <Time time={tts[1]} />
                  </ListCell>
                )}
                {tts[0].finished !== 0 && tts[1].finished !== 0 && (
                  <ListCell>
                    <Time time={tts[2]} />
                  </ListCell>
                )}
                <ListCell />
              </TTRow>
            ) : (
              <TTRow>
                <ListCell>...</ListCell>
              </TTRow>
            )}
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

const ChoosePlayer = styled.div`
  display: inline-flex;
  flex-direction: row;
  padding-left: 10px;
  height: 40px;
  align-items: center;
  div {
    padding-left: 6px;
  }
`;

const LegacyContainer = styled.span`
  padding-left: 5px;
  margin-top: -2px;
`;

const KuskiLink = styled.span`
  color: ${p => p.theme.linkColor};
  & :hover {
    color: ${p => p.theme.linkHover};
  }
`;

const EditIcon = styled(Edit)`
  margin-top: -4px;
  font-size: 18px !important;
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

const Compare = styled.span`
  && {
    color: ${p => (p.bettertime ? p.theme.linkColor : '#da0000')};
  }
`;

export default Personal;
