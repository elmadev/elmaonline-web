/* eslint-disable no-param-reassign */
import { action, thunk, persist } from 'easy-peasy';
import { nickId } from 'utils/nick';
import {
  Besttime,
  Level,
  BattlesByLevel,
  AllFinishedLevel,
  LevelTimeStats,
  LeaderHistory,
  LevelPacksByLevel,
  CrippledTimes,
  CrippledPersonal,
  CrippledTimeStats,
} from 'api';

const crippleDefault = {
  LevelIndexTimes: null,
  LevelIndexPersonal: null,
  LevelIndexTimeStats: null,
  // false means loading
  allTimes: false,
  bestTimes: false,
  leaderHistory: false,
  kuskiTimes: false,
  kuskiLeaderHistory: false,
  timeStats: false,
};

export default {
  besttimes: [],
  besttimesLoading: false,
  level: {},
  levelpacks: [],
  battlesForLevel: [],
  loading: true,
  allfinished: [],
  allLoading: 0,
  eoltimes: [],
  eolLoading: 0,
  timeStats: [],
  personalLeaderHistory: [],
  leaderHistory: [],
  statsLoading: 0,
  leaderHistoryLoading: 0,
  personalLeaderHistoryLoading: 0,
  settings: persist(
    {
      fancyMap: navigator.userAgent.toLowerCase().indexOf('firefox') === -1,
    },
    { storage: 'localStorage' },
  ),
  toggleFancyMap: action(state => {
    state.settings.fancyMap = !state.settings.fancyMap;
  }),
  setBestLoading: action((state, payload) => {
    state.besttimesLoading = payload;
  }),
  setBesttimes: action((state, payload) => {
    state.besttimes = payload;
    state.besttimesLoading = false;
  }),
  getBesttimes: thunk(async (actions, payload) => {
    actions.setBestLoading(true);
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setBesttimes(times.data);
    }
  }),
  setLevel: action((state, payload) => {
    state.level = payload;
    state.loading = false;
  }),
  setLevelPacks: action((state, payload) => {
    state.levelpacks = payload;
  }),
  setBattlesForLevel: action((state, payload) => {
    state.battlesForLevel = payload;
  }),
  getLevel: thunk(async (actions, payload) => {
    Level(payload, 1).then(res => {
      if (res.ok) {
        actions.setLevel(res.data);
      }
    });

    BattlesByLevel(payload).then(res => {
      if (res.ok) {
        actions.setBattlesForLevel(res.data);
      }
    });

    LevelPacksByLevel(payload).then(res => {
      if (res.ok) {
        actions.setLevelPacks(res.data);
      }
    });
  }),
  setAllfinished: action((state, payload) => {
    state.allfinished = payload.times;
    state.allLoading = payload.id;
  }),
  getAllfinished: thunk(async (actions, payload) => {
    const times = await AllFinishedLevel(payload);
    if (times.ok) {
      actions.setAllfinished({ times: times.data, id: payload });
    }
  }),
  setEoltimes: action((state, payload) => {
    state.eoltimes = payload.times;
    state.eolLoading = payload.id;
  }),
  getEoltimes: thunk(async (actions, payload) => {
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setEoltimes({ times: times.data, id: payload.levelId });
    }
  }),
  setTimeStats: action((state, payload) => {
    state.timeStats = payload.data;
    state.statsLoading = payload.id;
  }),
  getTimeStats: thunk(async (actions, payload) => {
    const stats = await LevelTimeStats(payload);
    if (stats.ok) {
      actions.setTimeStats({ data: stats.data, id: payload });
    }
  }),
  setPersonalLeaderHistory: action((state, payload) => {
    state.personalLeaderHistory = payload.data;
    state.personalLeaderHistoryLoading = payload.id;
  }),
  getPersonalLeaderHistory: thunk(async (actions, payload) => {
    const leaderHistory = await LeaderHistory(payload);
    if (leaderHistory.ok) {
      actions.setPersonalLeaderHistory({
        data: leaderHistory.data,
        id: payload.LevelIndex,
      });
    }
  }),
  setLeaderHistory: action((state, payload) => {
    state.leaderHistory = payload.data;
    state.leaderHistoryLoading = payload.id;
  }),
  getLeaderHistory: thunk(async (actions, payload) => {
    const leaderHistory = await LeaderHistory(payload);
    if (leaderHistory.ok) {
      actions.setLeaderHistory({
        data: leaderHistory.data,
        id: payload.LevelIndex,
      });
    }
  }),
  Crippled: {
    noThrottle: { ...crippleDefault },
    noBrake: { ...crippleDefault },
    noVolt: { ...crippleDefault },
    noTurn: { ...crippleDefault },
    oneTurn: { ...crippleDefault },
    alwaysThrottle: { ...crippleDefault },
    oneWheel: { ...crippleDefault },
    drunk: { ...crippleDefault },
    updateState: action((state, f) => {
      f(state);
    }),
    fetchTimes: thunk(async (actions, payload, helpers) => {
      const state = helpers.getState();
      const [LevelIndex, cripple] = payload;

      if (state[cripple].LevelIndexTimes !== LevelIndex) {
        actions.updateState(st => {
          st[cripple].LevelIndexTimes = LevelIndex;
          st[cripple].allTimes = false;
          st[cripple].bestTimes = false;
          st[cripple].leaderHistory = false;
        });

        const res = await CrippledTimes(LevelIndex, cripple, 1000, true, 10000);

        if (res.ok) {
          actions.updateState(st => {
            st[cripple].allTimes = res.data.allTimes;
            st[cripple].bestTimes = res.data.bestTimes;
            st[cripple].leaderHistory = res.data.leaderHistory;
          });
        }
      }
    }),

    fetchPersonal: thunk(async (actions, payload, helpers) => {
      const state = helpers.getState();
      const [LevelIndex, cripple] = payload;

      if (state[cripple].LevelIndexPersonal !== LevelIndex) {
        actions.updateState(st => {
          st[cripple].LevelIndexPersonal = LevelIndex;
          st[cripple].kuskiTimes = false;
          st[cripple].kuskiLeaderHistory = false;
        });

        if (nickId()) {
          const res = await CrippledPersonal(LevelIndex, 0, cripple, 1000);

          if (res.ok) {
            actions.updateState(st => {
              st[cripple].kuskiTimes = res.data.kuskiTimes;
              st[cripple].kuskiLeaderHistory = res.data.kuskiLeaderHistory;
            });
          }
        } else {
          actions.updateState(st => {
            st[cripple].kuskiTimes = [];
            st[cripple].kuskiLeaderHistory = [];
          });
        }
      }
    }),

    fetchTimeStats: thunk(async (actions, payload, helpers) => {
      const state = helpers.getState();
      const [LevelIndex, cripple] = payload;

      if (state[cripple].LevelIndexTimeStats !== LevelIndex) {
        actions.updateState(st => {
          st[cripple].LevelIndexTimeStats = LevelIndex;
          st[cripple].timeStats = false;
        });

        if (nickId()) {
          const res = await CrippledTimeStats(LevelIndex, 0, cripple);

          if (res.ok) {
            actions.updateState(st => {
              st[cripple].timeStats = res.data;
            });
          }
        } else {
          actions.updateState(st => {
            st[cripple].timeStats = [];
          });
        }
      }
    }),
  },
};
