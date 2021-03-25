import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { themes, previews } from 'theme';
import Header from 'components/Header';
import { Column, Row } from 'components/Containers';
import styled from 'styled-components';
import { Radio } from '@material-ui/core';
import { alphaNumeric } from 'utils/misc';

const Themes = () => {
  const {
    settings: { siteTheme },
  } = useStoreState(state => state.Settings);
  const { setSiteTheme } = useStoreActions(actions => actions.Settings);
  return (
    <Column>
      <Header h2>Select Site Theme</Header>
      <Column>
        {themes.map((theme, index) => (
          <Column key={theme.name} t="Large">
            <Row>
              <Header h3>{theme.name}</Header>
              <ThemeRadio
                checked={siteTheme === index}
                onChange={() => setSiteTheme(index)}
                value={alphaNumeric(theme.name)}
                name="themeRadios"
              />
            </Row>
            <Link target="_blank" rel="noreferrer" href={previews[index]}>
              <PreviewImage src={previews[index]} alt={theme.name} />
            </Link>
          </Column>
        ))}
      </Column>
    </Column>
  );
};

const ThemeRadio = styled(Radio)`
  && {
    padding: 0;
  }
`;

const Link = styled.a`
  height: 200px;
  width: 400px;
  margin-top: ${p => p.theme.padSmall};
`;

const PreviewImage = styled.img`
  border: 1px solid ${p => p.theme.fontColor};
  height: 200px;
  width: 400px;
  object-fit: cover;
`;

export default Themes;
