import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import styled from 'styled-components';

const StyledButton = styled(MuiButton)`
  && {
    ${p => p.margin && `margin: ${p.margin}`};
  }
`;

const Button = ({ children, onClick, color, margin, disabled }) => {
  return (
    <StyledButton
      disabled={disabled}
      margin={margin}
      variant="contained"
      color={color}
      onClick={() => onClick && onClick()}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
