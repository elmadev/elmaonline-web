import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import styled from 'styled-components';
import { Link as ReachLink } from '@reach/router';

const StyledButton = styled(MuiButton)`
  && {
    ${p => p.margin && `margin: ${p.margin};`}
    ${p => p.small && 'font-size: 0.8125rem;'}
    ${p => p.small && `padding: ${p.to ? 0 : '4px 5px'};`}
    ${p => p.to && 'padding: 0;'}
    a {
      display: block;
      padding: ${p => (p.small ? '4px 5px' : '6px 16px')};
    }
  }
`;

const Button = ({
  children,
  onClick, // use this to execute some js function
  margin,
  disabled,
  secondary,
  naked,
  small,
  to, // use this to create a normal link
}) => {
  let color = 'primary';
  let variant = 'contained';
  if (secondary) {
    color = '';
  }
  if (naked) {
    color = '';
    variant = '';
  }
  return (
    <StyledButton
      disabled={disabled}
      margin={margin}
      variant={variant}
      color={color}
      small={small}
      onClick={() => onClick && onClick()}
    >
      {to ? <ReachLink to={to}>{children}</ReachLink> : <>{children}</>}
    </StyledButton>
  );
};

export default Button;
