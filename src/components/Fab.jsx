import React from 'react';
import styled from 'styled-components';
import { Add as AddIcon } from '@material-ui/icons';
import { Fab as MuiFab } from '@material-ui/core';
import { useNavigate } from '@reach/router';

const Fab = ({ url }) => {
  const navigate = useNavigate();
  return (
    <FabCon>
      <MuiFab color="primary" aria-label="Add" onClick={() => navigate(url)}>
        <AddIcon />
      </MuiFab>
    </FabCon>
  );
};

const FabCon = styled.div`
  position: fixed;
  right: 30px;
  bottom: 30px;
`;

export default Fab;
