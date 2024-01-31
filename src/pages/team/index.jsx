import React, { useEffect } from 'react';
import styled from 'styled-components';
import Header from 'components/Header';
import Kuski from 'components/Kuski';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListCell, ListContainer, ListRow } from 'components/List';
import Layout from 'components/Layout';

const Team = ({ TeamName }) => {
  const { teamMembers } = useStoreState(state => state.Teams);
  const { getTeamMembers } = useStoreActions(actions => actions.Teams);

  useEffect(() => {
    getTeamMembers(TeamName);
  }, []);
  return (
    <Layout t={`Team - ${TeamName}`}>
      <Header>{TeamName}</Header>
      <Paper>
        <ListContainer>
          {teamMembers.map(m => (
            <ListRow key={m.KuskiIndex}>
              <ListCell to={`/kuskis/${m.Kuski}`}>
                <Kuski noLink kuskiData={m} />
              </ListCell>
            </ListRow>
          ))}
        </ListContainer>
      </Paper>
    </Layout>
  );
};

const Paper = styled.div`
  width: 100%;
  background-color: ${p => p.theme.paperBackground};
  border: 1px solid ${p => p.theme.borderColor};
  border-radius: 4px;
`;

export default Team;
