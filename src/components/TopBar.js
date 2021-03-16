import React, { useState } from 'react';
import styled from 'styled-components';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Link from 'components/Link';
import SearchBar from 'components/SearchBar';
import { useMediaQuery } from '@material-ui/core';
import { useNavigate } from '@reach/router';
// import TopBarActions from 'components/TopBarActions';

const StyledButton = styled(Button)`
  a {
    color: #f1f1f1;
  }
`;

const TopBar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { loggedIn, username } = useStoreState(state => state.Login);
  const { logout } = useStoreActions(actions => actions.Login);

  const mobileSearch = useMediaQuery('(max-width: 540px)');

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const performLogout = () => {
    handleClose();
    logout();
  };

  return (
    <Root>
      <Container>
        {!mobileSearch && <SearchBar />}
        <RightSideFlex>
          {mobileSearch && (
            <MobileSearchButton onClick={() => navigate('/search')}>
              <Link to="/search" style={{ color: 'inherit', padding: '5px' }}>
                <SearchIcon />
              </Link>
            </MobileSearchButton>
          )}
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
                onClose={handleClose}
              >
                <MenuItem>
                  <Link to={`/kuskis/${username}`} onClick={handleClose}>
                    Profile
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/settings" onClick={handleClose}>
                    Settings
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link to="/" onClick={performLogout}>
                    Log out
                  </Link>
                </MenuItem>
              </Menu>
            </div>
          )}
        </RightSideFlex>
      </Container>
    </Root>
  );
};

const Root = styled.div`
  top: 0;
  left: 0;
  background: #219653;
  color: #f1f1f1;
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  padding-left: 250px;
  z-index: 10;
  @media screen and (max-width: 768px) {
    padding-left: 50px;
  }
  @media screen and (max-width: 540px) {
    .top-bar-search-bar {
      display: none;
    }
  }
`;

const Container = styled.div`
  margin: 0 17px 0 24px;
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 540px) {
    justify-content: flex-end;
  }
`;

const RightSideFlex = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const MobileSearchButton = styled.div`
  margin-right: 8px;
`;

export default TopBar;
