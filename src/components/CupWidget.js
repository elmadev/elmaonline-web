import React, { useEffect } from 'react';
import CupCurrent from 'components/CupCurrent';
import Header from 'components/Header';
import styled from 'styled-components';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useNavigate } from "@reach/router";

const CupWidget = ({ ShortName }) => {
  const navigate = useNavigate();
  const { events, cup, lastCupShortName } = useStoreState(state => state.Cup);
  const { getCup } = useStoreActions(actions => actions.Cup);

  useEffect(() => {
    if (lastCupShortName !== ShortName) {
      getCup(ShortName);
    }
  }, []);

  return (
    <>
      {cup.ShortName === ShortName && (
        <>
          <Header onClick={() => navigate(`/cup/${ShortName}`)} h2>
            {cup.CupName}
          </Header>
          <CupCurrent events={events} />
          <Text onClick={() => navigate(`/cup/${ShortName}`)}>
            Open cup page to upload replays
          </Text>
        </>
      )}
    </>
  );
};

const Text = styled.div`
  cursor: pointer;
  color: #219653;
`;

export default CupWidget;
