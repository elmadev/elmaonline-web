import React from 'react';
import styled from 'styled-components';
import SearchIcon from '@material-ui/icons/Search';
import Link from 'components/Link';
import SearchBar from 'components/SearchBar';
import { useMediaQuery } from '@material-ui/core';
import { useNavigate } from '@reach/router';
import TopBarActions from 'components/TopBarActions';

const TopBar = () => {
  const navigate = useNavigate();

  const mobileSearch = useMediaQuery('(max-width: 540px)');

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
          <TopBarActions />
        </RightSideFlex>
      </Container>
    </Root>
  );
};

const Root = styled.div`
  top: 0;
  left: 0;
  background: ${p => p.theme.primary};
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
