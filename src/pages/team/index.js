import React, { useEffect } from 'react';
import styled from 'styled-components';
import Header from 'components/Header';
import Kuski from 'components/Kuski';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListCell, ListContainer, ListRow } from 'components/List';
import { useNavigate } from "@reach/router";

const Team = ({ TeamName }) => {
  const navigate = useNavigate();
  const { teamMembers } = useStoreState(state => state.Teams);
  const { getTeamMembers } = useStoreActions(actions => actions.Teams);

  useEffect(() => {
    getTeamMembers(TeamName);
  }, []);
  return (
    <Container>
      <Header>{TeamName}</Header>
      <Paper>
        <ListContainer>
          {teamMembers.map(m => (
            <ListRow onClick={() => navigate(`kuskis/${m.Kuski}`)}>
              <ListCell>
                <Kuski kuskiData={m} />
              </ListCell>
            </ListRow>
          ))}
        </ListContainer>
      </Paper>
    </Container>
  );
};

const Paper = styled.div`
  width: 100%;
  background-color: #ffffff;
  border: 1px solid #e2e3e4;
  border-radius: 4px;
`;

const Container = styled.div`
  padding: 8px;
`;

export default Team;
