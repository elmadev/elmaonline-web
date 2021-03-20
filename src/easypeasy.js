/* eslint-disable no-param-reassign */
import { action, persist } from 'easy-peasy';
import ReplayComments from 'features/ReplayComments/store';
import ReplayRating from 'features/ReplayRating/store';
import ReplaysBy from 'features/ReplaysBy/store';
import ChatView from 'features/ChatView/store';
import RecList from 'features/RecList/store';
import LevelMap from 'features/LevelMap/store';
import Register from 'pages/register/store';
import Login from 'pages/login/store';
import RankingTable from 'features/RankingTable/store';
import BattleList from 'features/BattleList/store';
import Upload from 'features/Upload/store';
import Cups from 'pages/cups/store';
import Cup from 'pages/cup/store';
import KuskiMap from 'pages/map/store';
import LevelPack from 'pages/levelpack/store';
import Search from 'pages/search/store';
import Kuski from 'pages/kuski/store';
import LevelsAdd from 'pages/levels-add/store';
import LevelsAddCollection from 'pages/levels-add-collection/store';
import LevelpackCollection from 'pages/levelpack-collection/store';
import Settings from 'pages/settings/store';
import Replay from 'pages/cupreplay/store';
import ReplayByUUID from 'pages/replay/store';
import Teams from 'pages/teams/store';
import Kuskis from 'pages/kuskis/store';
import Help from 'pages/help/store';
import Level from 'pages/level/store';
import Mod from 'pages/mod/store';
import Battle from 'pages/battle/store';
import Levels from 'pages/levels/store';
import News from 'features/News/store';
import FileUpload from 'pages/upload/store';
import ReplayList from 'features/ReplayList/store';

export default {
  ReplayComments,
  ReplayRating,
  ReplaysBy,
  Register,
  BattleList,
  ChatView,
  Cups,
  Cup,
  KuskiMap,
  Kuskis,
  LevelMap,
  LevelPack,
  Search,
  Kuski,
  Help,
  LevelsAdd,
  LevelsAddCollection,
  LevelpackCollection,
  Levels,
  Settings,
  Upload,
  Mod,
  News,
  Teams,
  Replay,
  ReplayByUUID,
  RecList,
  RankingTable,
  Level,
  Battle,
  Login,
  ReplayList,
  FileUpload,
  Page: {
    sideBarVisible: true,
    showSideBar: action(state => {
      state.sideBarVisible = true;
    }),
    hideSideBar: action(state => {
      state.sideBarVisible = false;
    }),
    toggleSideBar: action(state => {
      state.sideBarVisible = !state.sideBarVisible;
    }),
    sideBar: persist(
      {
        menu: [
          {
            header: 'Playing',
            expanded: true,
            items: [
              { name: 'Battles', to: '/battles', hidden: false },
              { name: 'Levels', to: '/levels', hidden: false },
              { name: 'Replays', to: '/replays', hidden: false },
              { name: 'Ranking', to: '/ranking', hidden: false },
            ],
          },
          {
            header: 'Community',
            expanded: true,
            items: [
              { name: 'Chat Log', to: '/chatlog', hidden: false },
              { name: 'Players', to: '/kuskis', hidden: false },
              { name: 'Teams', to: '/teams', hidden: false },
              { name: 'Kuski map', to: '/map', hidden: false },
            ],
          },
          {
            header: 'Competitions',
            expanded: true,
            items: [{ name: 'Cups', to: '/cups', hidden: false }],
          },
          {
            header: 'Tools',
            expanded: true,
            items: [
              { name: 'Help', to: '/help', hidden: false },
              { name: 'Editor', to: '/editor', hidden: false },
              { name: 'File upload', to: '/up', hidden: false },
            ],
          },
        ],
      },
      { storage: 'localStorage' },
    ),
    setExpanded: action((state, payload) => {
      const index = state.sideBar.menu.findIndex(m => m.header === payload);
      state.sideBar.menu[index].expanded = !state.sideBar.menu[index].expanded;
    }),
  },
  test: {
    derp: 'hi',
  },
};
