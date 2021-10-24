import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@reach/router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import {
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@material-ui/icons';
import { Paper } from 'components/Paper';
import {
  Tabs,
  Tab,
  ClickAwayListener,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
} from '@material-ui/core';
import Layout from 'components/Layout';
import { nick, nickId, mod } from 'utils/nick';
import FieldBoolean from 'components/FieldBoolean';
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

const LevelPack = ({ name, tab, ...props }) => {
  const isRehydrated = useStoreRehydrated();
  const subTab = props['*'];
  const {
    levelPackInfo,
    highlight,
    multiHighlight,
    personalTimes,
    timesError,
    records,
    recordsLoading,
    personalKuski,
    settings: { highlightWeeks, showLegacyIcon, showLegacy, showMoreStats },
  } = useStoreState(state => state.LevelPack);

  const {
    getLevelPackInfo,
    getHighlight,
    getPersonalTimes,
    setError,
    getStats,
    setHighlightWeeks,
    toggleShowLegacyIcon,
    toggleShowLegacy,
  } = useStoreActions(actions => actions.LevelPack);
  const lastShowLegacy = useRef(showLegacy);
  const [openSettings, setOpenSettings] = useState(false);
  const navigate = useNavigate();

  const { data: levelStats } = useQueryAlt(
    ['LevelPackLevelStats', 1, name],
    async () => LevelPackLevelStats(1, name),
  );

  useEffect(() => {
    if (levelPackInfo.LevelPackName !== name) {
      getLevelPackInfo(name);
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
          <Tab label="Personal" value="personal" />
          <Tab label="Multi records" value="multi" />
          <Tab label="Replays" value="replays" />
          <Tab label="Crippled" value="crippled" />
          {adminAuth && <Tab label="Admin" value="admin" />}
        </Tabs>
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
        <br />
        <Settings>
          {openSettings ? (
            <ClickAwayListener onClickAway={() => setOpenSettings(false)}>
              <Paper>
                <SettingsHeader>
                  <ClickCloseIcon onClick={() => setOpenSettings(false)} />
                  <SettingsHeadline>Settings</SettingsHeadline>
                </SettingsHeader>
                <FormControl component="fieldset" focused={false}>
                  <RadioButtonContainer>
                    <RadioButtonItem>
                      <FormLabel component="legend">
                        Highlight times newer than{' '}
                      </FormLabel>
                    </RadioButtonItem>
                    <RadioButtonItem>
                      <RadioGroup
                        aria-label="highlightWeeks"
                        value={highlightWeeks}
                        onChange={n => setHighlightWeeks(n.target.value)}
                        name="weeks"
                        row
                      >
                        <FormControlLabel
                          value={0}
                          checked={highlightWeeks === '0'}
                          label="0"
                          control={<Radio size="small" />}
                        />
                        <FormControlLabel
                          value={1}
                          checked={highlightWeeks === '1'}
                          label="1"
                          control={<Radio size="small" />}
                        />
                        <FormControlLabel
                          value={2}
                          checked={highlightWeeks === '2'}
                          label="2"
                          control={<Radio size="small" />}
                        />
                        <FormControlLabel
                          value={3}
                          checked={highlightWeeks === '3'}
                          label="3"
                          control={<Radio size="small" />}
                        />
                        <FormControlLabel
                          value={4}
                          checked={highlightWeeks === '4'}
                          label="4"
                          control={<Radio size="small" />}
                        />
                      </RadioGroup>
                    </RadioButtonItem>
                    <RadioButtonItem>
                      <FormLabel component="legend">weeks</FormLabel>
                    </RadioButtonItem>
                  </RadioButtonContainer>
                </FormControl>
                {levelPackInfo.Legacy === 1 && (
                  <>
                    <SettingItem>
                      <FieldBoolean
                        value={showLegacyIcon}
                        label="Show icon on legacy times"
                        onChange={() => toggleShowLegacyIcon()}
                      />
                    </SettingItem>
                    <SettingItem>
                      <FieldBoolean
                        value={showLegacy}
                        label="Show legacy times"
                        onChange={() => toggleShowLegacy()}
                      />
                    </SettingItem>
                  </>
                )}
              </Paper>
            </ClickAwayListener>
          ) : (
            <ClickSettingsIcon onClick={() => setOpenSettings(true)} />
          )}
        </Settings>
        {!tab && (
          <Records
            levelStats={levelStats}
            records={records}
            highlight={highlight}
            highlightWeeks={highlightWeeks}
            recordsLoading={recordsLoading}
            showLegacyIcon={showLegacyIcon}
            showMoreStats={showMoreStats}
          />
        )}
        {tab === 'total-times' && (
          <TotalTimes highlight={highlight} highlightWeeks={highlightWeeks} />
        )}
        {tab === 'king-list' && (
          <Kinglist highlight={highlight} highlightWeeks={highlightWeeks} />
        )}
        {tab === 'personal' && (
          <Personal
            timesError={timesError}
            setError={e => setError(e)}
            getTimes={newKuski =>
              getPersonalTimes({
                PersonalKuskiIndex: newKuski,
                name,
                eolOnly: showLegacy ? 0 : 1,
              })
            }
            times={personalTimes}
            highlight={highlight}
            multiHighlight={multiHighlight}
            highlightWeeks={highlightWeeks}
            records={records}
            showLegacyIcon={showLegacyIcon}
            kuski={personalKuski}
          />
        )}
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
          <ReplayList nonsticky levelPack={levelPackInfo.LevelPackIndex} />
        )}
        {tab === 'admin' && adminAuth && (
          <Admin records={records} LevelPack={levelPackInfo} />
        )}
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

const Settings = styled.div`
  padding: 0 10px;
  margin-bottom: 26px;
  font-size: 14px;
`;

const SettingsHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin: 5px;
`;

const SettingsHeadline = styled.div`
  color: #8c8c8c;
  font-size: 20px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  padding-bottom: 6px;
`;

const RadioButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 12px;
`;

const RadioButtonItem = styled.div`
  display: flex;
  float: left;
  margin-right: 15px;
`;

const ClickSettingsIcon = styled(SettingsIcon)`
  cursor: pointer;
`;

const ClickCloseIcon = styled(CloseIcon)`
  cursor: pointer;
`;

const FormLabel = styled.legend`
  color: ${p => p.theme.lightTextColor};
  font-size: 1rem;
  letter-spacing: 0.00938em;
`;

export default LevelPack;
