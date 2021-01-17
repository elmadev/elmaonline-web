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

const Routes = () => {
  return (
    <Router>
      <Home path="/" />
      <Battle path="battles/:BattleIndex" />
      <Battles path="battles" />
      <ChatLog path="chatlog" />
      <Confirm path="confirm/:confirmCode" />
      <Cup path="cup/:ShortName" />
      <CupReplay path="r/cup/:ReplayIndex/:Filename" ReplayType="cup" />
      <Cups path="cups" />
      <Editor path="editor" />
      <Error path="error" />
      <ForgotPassword path="forgot" />
      <Help path="help" />
      <Kuski path="kuskis/:name" />
      <Kuskis path="kuskis" />
      <Level path="levels/:LevelIndex" />
      <LevelPack path="levels/packs/:name" />
      <Levels path="levels" />
      <LevelsAdd path="levels/add" />
      <Login path="login" />
      <Map path="map" />
      <Mod path="mod" />
      <Ranking path="ranking" />
      <Register path="register" />
      <Replay path="r/:ReplayUuid" />
      <Replays path="replays" />
      <Search path="search" />
      <Settings path="settings" />
      <Team path="team/:TeamName" />
      <Teams path="teams" />
      <NotFound default />
    </Router>
  );
};

export default Routes;