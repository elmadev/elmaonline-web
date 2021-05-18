import React from 'react';
import styled from 'styled-components';
import { FormControlLabel, Switch as MUISwitch } from '@material-ui/core';

const Switch = ({
  className,
  children,
  checked,
  onChange,
  color = 'primary',
}) => {
  return (
    <Root className={['switch-root', className].filter(Boolean).join(' ')}>
      <FormControlLabel
        control={
          <MUISwitch
            checked={checked}
            onChange={e => {
              onChange(e.target.checked);
            }}
            color={color}
          />
        }
        label={children}
      />
    </Root>
  );
};

const Root = styled.div``;

export default Switch;
