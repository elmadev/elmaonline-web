import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from '@emotion/styled';
import { CropLandscape, Settings, Crop75, Close } from '@material-ui/icons';
import { Row, Text } from 'components/Containers';
import FieldBoolean from 'components/FieldBoolean';
import { TextField, Typography } from '@material-ui/core';

const ReplaySettings = ({ battle = false, lgrPage = false }) => {
  const [openSettings, setSettings] = useState(false);
  const {
    settings: {
      revealOnClick,
      autoPlay,
      grass,
      pictures,
      customSkyGround,
      theater,
      arrows,
      lgrOverride,
    },
  } = useStoreState(state => state.ReplaySettings);
  const { toggleSetting, setLgrOverride } = useStoreActions(
    actions => actions.ReplaySettings,
  );

  const { lgr } = useStoreState(state => state.LGR);
  const { getLGR } = useStoreActions(actions => actions.LGR);
  useEffect(() => {
    if (!lgrPage && lgrOverride !== '' && lgrOverride !== 'legacy') {
      getLGR(lgrOverride);
    }
  }, [lgrOverride]);
  const lgrInvalid = lgrOverride && !lgr && lgrOverride !== 'legacy';

  useEffect(() => {
    // triggers autoResize in recplayer-react
    window.dispatchEvent(new Event('resize'));
  }, [theater]);

  return (
    <Row jc="flex-end" ai="center">
      {openSettings && (
        <SettingsContainer>
          <Text light small noPad r="Small">
            Refresh to apply changes
          </Text>
          {battle && (
            <FieldBoolean
              size="small"
              value={revealOnClick}
              label="Reveal on click"
              onChange={() => toggleSetting('revealOnClick')}
            />
          )}
          <FieldBoolean
            size="small"
            value={autoPlay}
            label="Autoplay"
            onChange={() => toggleSetting('autoPlay')}
          />
          <FieldBoolean
            size="small"
            value={grass}
            label="Grass"
            onChange={() => toggleSetting('grass')}
          />
          <FieldBoolean
            size="small"
            value={arrows}
            label="Gravity arrows"
            onChange={() => toggleSetting('arrows')}
          />
          <FieldBoolean
            size="small"
            value={pictures}
            label="Pictures"
            onChange={() => toggleSetting('pictures')}
          />
          <FieldBoolean
            size="small"
            value={customSkyGround}
            label="Custom sky/ground"
            onChange={() => toggleSetting('customSkyGround')}
          />
          {!lgrPage && (
            <>
              <Typography>Override all levels with lgr:&nbsp;</Typography>
              <TextField
                error={lgrInvalid}
                helperText={lgrInvalid && 'LGR not found'}
                id="Lgr"
                value={lgrOverride}
                onChange={event => setLgrOverride(event.target.value)}
                margin="dense"
              />
            </>
          )}
        </SettingsContainer>
      )}
      <Icon onClick={() => setSettings(!openSettings)}>
        {openSettings ? <Close /> : <Settings />}
      </Icon>
      <IconTheater onClick={() => toggleSetting('theater')}>
        {theater ? <Crop75 /> : <CropLandscape />}
      </IconTheater>
    </Row>
  );
};

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: 1100px) {
    flex-direction: column;
  }
`;

const Icon = styled.div`
  padding: ${p => p.theme.padXSmall};
  cursor: pointer;
`;

const IconTheater = styled(Icon)`
  @media (max-width: 1100px) {
    display: none;
  }
`;

export default ReplaySettings;
