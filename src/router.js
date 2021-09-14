import React from 'react';
import { Router } from '@reach/router';
import Home from 'pages/home';
import Battle from 'pages/battle';
import Battles from 'pages/battles';
import ChatLog from 'pages/chatlog';
import Confirm from 'pages/confirm';
import Cup from 'pages/cup';
import CupReplay from 'pages/cupreplay';
import Cups from 'pages/cups';
import Editor from 'pages/editor';
import Error from 'pages/error';
import ForgotPassword from 'pages/forgot-password';
import Help from 'pages/help';
import Kuski from 'pages/kuski';
import Kuskis from 'pages/kuskis';
import Level from 'pages/level';
import LevelPack from 'pages/levelpack';
import Levels from 'pages/levels';
import LevelsAdd from 'pages/levels-add';
import LevelsAddCollection from 'pages/levels-add-collection';
import LevelpackCollection from 'pages/levelpack-collection';
import Login from 'pages/login';
import Map from 'pages/map';
import Mod from 'pages/mod';
import NotFound from 'pages/not-found';
import Ranking from 'pages/ranking';
import Register from 'pages/register';
import Replay from 'pages/replay';
import Replays from 'pages/replays';
import Search from 'pages/search';
import Settings from 'pages/settings';
import Team from 'pages/team';
import Teams from 'pages/teams';
import Upload from 'pages/upload';
import styled, { ThemeProvider } from 'styled-components';
import { useStoreState, useStoreRehydrated } from 'easy-peasy';
import { themes, muiTheme } from './theme';
import { MuiThemeProvider } from '@material-ui/core/styles';

const Router100 = styled(Router)`
  height: 100%;
`;

const Routes = () => {
  const isRehydrated = useStoreRehydrated();
  const {
    settings: { siteTheme },
  } = useStoreState(state => state.Settings);
  if (!isRehydrated) return null;
  return (
    <MuiThemeProvider theme={muiTheme(siteTheme)}>
      <ThemeProvider theme={themes[siteTheme]}>
        <Router100>
          <Home path="/" />
          <Battle path="battles/:BattleId" />
          <Battles path="battles" />
          <ChatLog path="chatlog" />
          <Confirm path="confirm/:confirmCode" />
          <Cup path="cup/:ShortName/*" />
          <CupReplay path="r/cup/:ReplayIndex/:Filename" ReplayType="cup" />
          <Cups path="cups" />
          <Editor path="editor" />
          <Error path="error" />
          <ForgotPassword path="forgot" />
          <Help path="help/*" />
          <Kuski path="kuskis/:name" tab="" />
          <Kuski path="kuskis/:name/:tab" />
          <Kuskis path="kuskis" tab="" />
          <Kuskis path="kuskis/search" tab="search" />
          <Level path="levels/:LevelId" />
          <LevelPack path="levels/packs/:name" tab="" />
          <LevelPack path="levels/packs/:name/:tab/*" />
          <Levels path="levels" tab="" />
          {/* can't use levels/:tab due to conflict with levels/:LevelId above*/}
          <Levels path="levels/collections" tab="collections" />
          <LevelsAdd path="levels/add" />
          <LevelsAddCollection path="levels/collections/add" />
          <LevelpackCollection path="levels/collections/:name" />
          <Login path="login" />
          <Map path="map" />
          <Mod path="mod" />
          <Ranking path="ranking" />
          <Register path="register" />
          <Replay path="r/:ReplayUuid" />
          <Replay path="r/:ReplayUuid/:RecFileName" />
          <Replays path="replays/*" />
          <Search path="search" />
          <Settings path="settings" tab="" />
          <Settings path="settings/:tab" />
          <Team path="team/:TeamName" />
          <Teams path="teams" />
          <Upload path="up" />
          <NotFound default />
        </Router100>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default Routes;
