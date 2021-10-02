import React, { useEffect } from 'react';
import CupCurrent from 'components/CupCurrent';
import Header from 'components/Header';
import { Card, CardContent, Grid } from '@material-ui/core';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useNavigate } from '@reach/router';

const CupWidget = () => {
  const navigate = useNavigate();
  const { events, cup } = useStoreState(state => state.Cup);
  const { getOngoing } = useStoreActions(actions => actions.Cup);

  useEffect(() => {
    getOngoing();
  }, []);

  if (!cup.CupName) return null;

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Header h2>Events</Header>
          <Header onClick={() => navigate(`/cup/${cup.ShortName}`)} h2>
            {cup.CupName}
          </Header>
          <CupCurrent events={events} ShortName={cup.ShortName} />
          <Text onClick={() => navigate(`/cup/${cup.ShortName}`)}>
            Open cup page to upload replays
          </Text>
        </CardContent>
      </Card>
    </Grid>
  );
};

const Text = styled.div`
  cursor: pointer;
  color: ${p => p.theme.linkColor};
`;

export default CupWidget;
