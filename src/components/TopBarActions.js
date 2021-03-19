import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { useNavigate } from '@reach/router';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  a {
    color: #f1f1f1;
  }
`;

const Item = styled(MenuItem)`
  && {
    color: #219653;
  }
`;

export default function TopBarActions() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { loggedIn, username } = useStoreState(state => state.Login);
  const { logout } = useStoreActions(actions => actions.Login);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = to => {
    setAnchorEl(null);
    if (to) {
      navigate(to);
    }
  };

  const performLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  return (
    <>
      {!loggedIn && (
        <StyledButton color="inherit" onClick={() => navigate('/login')}>
          Login
        </StyledButton>
      )}
      {loggedIn && (
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={() => handleClose('')}
          >
            <Item onClick={() => handleClose(`/kuskis/${username}`)}>
              Profile
            </Item>
            <Item onClick={() => handleClose('/settings')}>Settings</Item>
            <Item onClick={() => performLogout()}>Log out</Item>
          </Menu>
        </div>
      )}
    </>
  );
}
