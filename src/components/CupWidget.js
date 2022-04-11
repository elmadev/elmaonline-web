import React, { useEffect } from 'react';
import CupCurrent from 'components/CupCurrent';
import Header from 'components/Header';
import { Card, CardContent, Grid } from '@material-ui/core';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useNavigate } from '@reach/router';
import { isEmpty } from 'lodash';

const CupWidget = () => {
  const navigate = useNavigate();
  const [status, cups] = useStoreState(state => state.Cup.onGoingCups);
  const { getOnGoingCups } = useStoreActions(actions => actions.Cup);

  useEffect(() => {
    if (status === 'default') {
      getOnGoingCups();
    }
  }, [status]);

  if (isEmpty(cups)) {
    return null;
  }

  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Header h2>Events</Header>
          {cups.map(cup => {
            const events = cup.SiteCupData;
            return (
              <CupRoot key={cup.CupGroupIndex}>
                <Header onClick={() => navigate(`/cup/${cup.ShortName}`)} h2>
                  {cup.CupName}
                </Header>
                <CupCurrent events={events} ShortName={cup.ShortName} />
                <Text onClick={() => navigate(`/cup/${cup.ShortName}`)}>
                  Open cup page to upload replays
                </Text>
              </CupRoot>
            );
          })}
        </CardContent>
      </Card>
    </Grid>
  );
};

const CupRoot = styled.div`
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Text = styled.div`
  cursor: pointer;
  color: ${p => p.theme.linkColor};
`;

export default CupWidget;
