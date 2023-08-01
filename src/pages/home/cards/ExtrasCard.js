import React from 'react';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Tabs, Tab } from '@material-ui/core';
import { Install } from 'components/Welcome';
import Links from 'pages/help/tabs/Links';
import Programs from 'pages/help/tabs/Programs';
import { useStoreState, useStoreActions } from 'easy-peasy';

export default function ExtrasCard() {
  const {
    extras: { setExtrasTab },
  } = useStoreActions(actions => actions.Page);
  const {
    extras: { extrasTab },
  } = useStoreState(state => state.Page);
  return (
    <Card>
      <CardContent>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={extrasTab}
          onChange={(e, value) => {
            setExtrasTab(value);
          }}
        >
          <Tab label="Install" value="install" />
          <Tab label="Links" value="links" />
          <Tab label="Programs" value="programs" />
        </Tabs>
        {extrasTab === 'install' && (
          <Con>
            <Install />
          </Con>
        )}
        {extrasTab === 'links' && (
          <Con>
            <Links hideHeader />
          </Con>
        )}
        {extrasTab === 'programs' && (
          <ProgramsCon>
            <Programs hideHeader />
          </ProgramsCon>
        )}
      </CardContent>
    </Card>
  );
}

const Con = styled.div`
  padding-top: ${p => p.theme.padMedium};
`;

const ProgramsCon = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;
