import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useStoreState, useStoreActions, useStoreRehydrated } from 'easy-peasy';
import { mod } from 'utils/nick';
import SideBarSubItem from 'components/SideBarSubItem';
import Link from 'components/Link';
import { useLocation } from '@reach/router';

const SideBar = () => {
  const location = useLocation();
  const isRehydrated = useStoreRehydrated();
  const {
    sideBarVisible,
    sideBar: { menu },
  } = useStoreState(state => state.Page);
  const { hideSideBar, toggleSideBar } = useStoreActions(
    actions => actions.Page,
  );
  const onNavigation = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1000) {
      hideSideBar();
    }
  };

  const isSelected = to => location.pathname.substring(0, to.length) === to;

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.innerWidth < 1000 &&
      isRehydrated
    ) {
      hideSideBar();
    }
  }, [isRehydrated]);

  const onToggle = () => {
    toggleSideBar();
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  };
  if (!isRehydrated) return null;
  return (
    <Root sideBarVisible={sideBarVisible}>
      <Container>
        <Title>
          <Burger
            role="button"
            tabIndex="0"
            onKeyUp={e => {
              if (e.key === 'Enter') onToggle();
            }}
            onClick={onToggle}
          >
            &#9776;
          </Burger>
          <Header to="/" sideBarVisible={sideBarVisible}>
            Elma Online
          </Header>
        </Title>
        <Content sideBarVisible={sideBarVisible}>
          {menu.map(m => (
            <SideBarSubItem
              key={m.header}
              name={m.header}
              expanded={m.expanded}
            >
              {m.items.map(i => (
                <MenuLink
                  selected={isSelected(i.to)}
                  key={i.name}
                  to={i.to}
                  onClick={onNavigation}
                >
                  {i.name}
                </MenuLink>
              ))}
            </SideBarSubItem>
          ))}
          {mod() === 1 && (
            <MenuLink
              selected={isSelected('/mod')}
              to="/mod"
              onClick={onNavigation}
            >
              Mod
            </MenuLink>
          )}
        </Content>
      </Container>
    </Root>
  );
};

const Root = styled.div`
  color: black;
  position: fixed;
  width: 250px;
  top: 0;
  left: 0;
  z-index: 11;
  height: ${p => (p.sideBarVisible ? '100%' : 'auto')};
  @media (max-width: 768px) {
    width: ${p => (p.sideBarVisible ? '175px' : '50px')};
    opacity: 0.9;
  }
`;

const Header = styled(Link)`
  color: #fff;
  display: ${p => (p.sideBarVisible ? 'inline-block' : 'initial')};
  @media (max-width: 768px) {
    display: ${p => (p.sideBarVisible ? 'inline-block' : 'none')};
  }
`;

const MenuLink = styled(Link)`
  display: block;
  font-size: 0.8em;
  padding: 10px 25px;
  text-decoration: none;
  background-color: ${p => (p.selected ? '#c3c3c3' : 'transparent')};
  color: ${p => (p.selected ? '#1f1f1f' : '#c3c3c3')};
  :hover {
    background-color: #333333;
    color: #c3c3c3;
  }
`;

const Burger = styled.span`
  padding: 17px;
`;

const Container = styled.div`
  height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
  display: ${p => (p.sideBarVisible ? 'block' : 'none')};
  background: #1f1f1f;
`;

const Title = styled.div`
  background: #1f1f1f;
  opacity: 0.9;
  line-height: 54px;
  color: #fff;
  text-transform: uppercase;
  outline: 0;
  cursor: pointer;
`;

export default SideBar;
