import React, { useEffect, useRef } from 'react';
import { useNavigate } from '@reach/router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import { Tabs, Tab } from '@material-ui/core';
import Layout from 'components/Layout';
import { nick, nickId, mod } from 'utils/nick';
import { Row } from 'components/Containers';
import Download from 'components/Download';
import Kuski from 'components/Kuski';
import Loading from 'components/Loading';
import ReplayList from 'features/ReplayList';
import Records from './Records';
import TotalTimes from './TotalTimes';
import Personal from './Personal';
import Kinglist from './Kinglist';
import MultiRecords from './MultiRecords';
import Crippled from './Crippled';
import Admin from './Admin';
import { useQueryAlt, LevelPackLevelStats } from '../../api';
import Menus from './Menus';
import RecordHistory from './RecordHistory';

const LevelPack = ({ name, tab, ...props }) => {
  const isRehydrated = useStoreRehydrated();
  const subTab = props['*'];
  const {
    levelPackInfo,
    highlight,
    multiHighlight,
    personalKuski,
    settings: { highlightWeeks, showLegacy },
  } = useStoreState(state => state.LevelPack);

  const {
    getLevelPackInfo,
    getHighlight,
    getPersonalTimes,
    getStats,
    getRecordsOnly,
  } = useStoreActions(actions => actions.LevelPack);
  const lastShowLegacy = useRef(showLegacy);
  const navigate = useNavigate();

  const { data: levelStats } = useQueryAlt(
    ['LevelPackLevelStats', 1, name],
    async () => LevelPackLevelStats(1, name),
  );

  useEffect(() => {
    if (levelPackInfo.LevelPackName !== name) {
      getLevelPackInfo(name);
      getRecordsOnly({ name, eolOnly: showLegacy ? 0 : 1 });
      getStats({ name, eolOnly: showLegacy ? 0 : 1 });
      getHighlight();
      const PersonalKuskiIndex = nick();
      if (PersonalKuskiIndex !== '') {
        getPersonalTimes({
          PersonalKuskiIndex,
          name,
          eolOnly: showLegacy ? 0 : 1,
        });
      }
    }
  }, [name]);

  useEffect(() => {
    if (lastShowLegacy.current !== showLegacy) {
      lastShowLegacy.current = showLegacy;
      getRecordsOnly({ name, eolOnly: showLegacy ? 0 : 1 });
      getStats({ name, eolOnly: showLegacy ? 0 : 1 });
      if (personalKuski !== '') {
        getPersonalTimes({
          PersonalKuskiIndex: personalKuski,
          name,
          eolOnly: showLegacy ? 0 : 1,
        });
      }
    }
  }, [showLegacy]);

  if (!isRehydrated || !levelPackInfo)
    return (
      <Layout edge t={`Level pack - ${name}`}>
        <Loading />
      </Layout>
    );

  const adminAuth = nickId() === levelPackInfo.KuskiIndex || mod();

  return (
    <Layout edge t={`Level pack - ${levelPackInfo.LevelPackName}`}>
      <RootStyle>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={tab}
          onChange={(e, value) => {
            if (value === 'crippled') {
              navigate(['/levels/packs', name, 'crippled/noVolt'].join('/'));
            } else {
              navigate(
                ['/levels/packs', name, value].filter(Boolean).join('/'),
              );
            }
          }}
        >
          <Tab label="Records" value="" />
          <Tab label="Total Times" value="total-times" />
          <Tab label="King list" value="king-list" />
          <Tab label="Record History" value="record-history" />
          <Tab label="Personal" value="personal" />
          <Tab label="Multi records" value="multi" />
          <Tab label="Replays" value="replays" />
          <Tab label="Crippled" value="crippled" />
          {adminAuth && <Tab label="Admin" value="admin" />}
        </Tabs>
        <Row b="Large">
          <div>
            <LevelPackName>
              <ShortNameStyled>{levelPackInfo.LevelPackName}</ShortNameStyled>{' '}
              <LongNameStyled>{levelPackInfo.LevelPackLongName}</LongNameStyled>
              <Download href={`pack/${levelPackInfo.LevelPackName}`}>
                <DownloadText>Download</DownloadText>
              </Download>
            </LevelPackName>
            <DescriptionStyle>
              {levelPackInfo.LevelPackDesc} - Maintainer:{' '}
              <Kuski kuskiData={levelPackInfo.KuskiData} />
            </DescriptionStyle>
          </div>
          {['record-history', 'replays', 'admin'].indexOf(tab) === -1 && (
            <Menus name={name} hideFilter={tab === 'personal'} />
          )}
        </Row>
        {!tab && <Records levelStats={levelStats} />}
        {tab === 'total-times' && (
          <TotalTimes highlight={highlight} highlightWeeks={highlightWeeks} />
        )}
        {tab === 'king-list' && (
          <Kinglist highlight={highlight} highlightWeeks={highlightWeeks} />
        )}
        {tab === 'record-history' && (
          <RecordHistory levelPackInfo={levelPackInfo} />
        )}
        {tab === 'personal' && <Personal name={name} />}
        {tab === 'multi' && (
          <MultiRecords
            name={name}
            highlight={multiHighlight}
            highlightWeeks={highlightWeeks}
          />
        )}
        {tab === 'crippled' && (
          <Crippled
            LevelPack={levelPackInfo}
            crippleType={subTab}
            highlightWeeks={highlightWeeks}
          />
        )}
        {tab === 'replays' && (
          <ReplayList
            persist={`levelpack-${levelPackInfo.LevelPackIndex}`}
            nonsticky
            levelPack={levelPackInfo.LevelPackIndex}
          />
        )}
        {tab === 'admin' && adminAuth && <Admin />}
      </RootStyle>
    </Layout>
  );
};

LevelPack.propTypes = {
  name: PropTypes.string,
};

LevelPack.defaultProps = {
  name: '',
};

const RootStyle = styled.div`
  background: ${p => p.theme.paperBackground};
  min-height: 100%;
  box-sizing: border-box;
`;

const LevelPackName = styled.div`
  font-size: 20px;
  padding: 10px;
`;

const ShortNameStyled = styled.span`
  font-weight: 500;
`;

const LongNameStyled = styled.span`
  color: #8c8c8c;
`;

const DescriptionStyle = styled.div`
  margin: 0 10px;
  font-size: 14px;
`;

const DownloadText = styled.span`
  padding-left: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
`;

export default LevelPack;
