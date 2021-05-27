import React, { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { useNavigate } from '@reach/router';
import { useStoreState, useStoreActions } from 'easy-peasy';
import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';

const StyledButton = styled(Button)`
  a {
    color: #f1f1f1;
  }
`;

const Item = styled(MenuItem)`
  && {
    color: ${p => p.theme.linkColor};
  }
`;

const Nick = styled.div`
  padding: 6px 16px;
`;

export default function TopBarActions() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { loggedIn, username, notificationsCount } = useStoreState(
    state => state.Login,
  );
  const { logout, getNotificationsCount } = useStoreActions(
    actions => actions.Login,
  );

  useEffect(() => {
    getNotificationsCount();
  }, []);

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

  const handleNotificationsClick = () => {
    navigate(`/kuskis/${username}/notifications`);
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
            aria-label="notifications"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleNotificationsClick}
            color="inherit"
          >
            <Badge badgeContent={notificationsCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
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
            <Nick>{username}</Nick>
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
