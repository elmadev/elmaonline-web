/* eslint-disable no-param-reassign */
import { action, thunk, persist } from 'easy-peasy';
import {
  Highlight,
  PersonalAllFinished,
  Besttime,
  LevelPackStats,
  MultiRecords,
  MultiBesttime,
  PersonalWithMulti,
  LevelPackDeleteLevel,
  LevelsSearchAll,
  LevelPackAddLevel,
  LevelPackSortLevel,
  LevelPackSort,
  LevelPack,
} from 'api';

export default {
  levelPackInfo: {},
  setLevelPackInfo: action((state, payload) => {
    state.levelPackInfo = payload;
  }),
  getLevelPackInfo: thunk(async (actions, payload) => {
    const get = await LevelPack(payload);
    if (get.ok) {
      actions.setLevelPackInfo(get.data);
    }
  }),
  highlight: [9999999999, 9999999999, 9999999999, 9999999999, 9999999999],
  multiHighlight: [9999999999, 9999999999, 9999999999, 9999999999, 9999999999],
  setHighlight: action((state, payload) => {
    state.highlight = payload.single;
    state.multiHighlight = payload.multi;
  }),
  getHighlight: thunk(async actions => {
    const highlights = await Highlight();
    if (highlights.ok) {
      actions.setHighlight(highlights.data);
    }
  }),
  settings: persist(
    {
      highlightWeeks: 1,
      showLegacyIcon: true,
      showLegacy: true,
    },
    { storage: 'localStorage' },
  ),
  setHighlightWeeks: action((state, payload) => {
    state.settings.highlightWeeks = payload;
  }),
  toggleShowLegacyIcon: action(state => {
    state.settings.showLegacyIcon = !state.settings.showLegacyIcon;
  }),
  toggleShowLegacy: action(state => {
    state.settings.showLegacy = !state.settings.showLegacy;
  }),
  totaltimes: [],
  kinglist: [],
  setTotalTimes: action((state, payload) => {
    state.totaltimes = payload;
  }),
  setKinglist: action((state, payload) => {
    state.kinglist = payload;
  }),
  personalTimes: persist([], { storage: 'sessionStorage' }),
  setPersonalTimes: action((state, payload) => {
    state.personalTimes = payload;
  }),
  getPersonalTimes: thunk(async (actions, payload) => {
    actions.setPersonalKuski(payload.PersonalKuskiIndex);
    const data = await PersonalWithMulti(payload);
    if (data.ok) {
      if (data.data.error) {
        actions.setError(data.data.error);
      } else {
        actions.setPersonalTimes(data.data);
      }
    }
  }),
  timesError: '',
  setError: action((state, payload) => {
    state.timesError = payload;
  }),
  personalKuski: '',
  setPersonalKuski: action((state, payload) => {
    state.personalKuski = payload;
  }),
  personalAllFinished: [],
  setPeronalAllFinished: action((state, payload) => {
    state.personalAllFinished = payload;
  }),
  getPersonalAllFinished: thunk(async (actions, payload) => {
    const times = await PersonalAllFinished(payload);
    if (times.ok) {
      actions.setPeronalAllFinished(times.data);
    }
  }),
  levelBesttimes: [],
  setLevelBesttimes: action((state, payload) => {
    state.levelBesttimes = payload;
  }),
  getLevelBesttimes: thunk(async (actions, payload) => {
    const times = await Besttime(payload);
    if (times.ok) {
      actions.setLevelBesttimes(times.data);
    }
  }),
  levelMultiBesttimes: [],
  setLevelMultiBesttimes: action((state, payload) => {
    state.levelMultiBesttimes = payload;
  }),
  getLevelMultiBesttimes: thunk(async (actions, payload) => {
    const times = await MultiBesttime(payload);
    if (times.ok) {
      actions.setLevelMultiBesttimes(times.data);
    }
  }),
  records: [],
  recordsLoading: false,
  setRecords: action((state, payload) => {
    state.records = payload;
  }),
  setRecordsLoading: action((state, payload) => {
    state.recordsLoading = payload;
  }),
  getStats: thunk(async (actions, payload) => {
    actions.setRecordsLoading(true);
    const times = await LevelPackStats(payload);
    if (times.ok) {
      actions.setRecords(times.data.records);
      actions.setTotalTimes(times.data.tts);
      actions.setKinglist(times.data.points);
    }
    actions.setRecordsLoading(false);
    actions.setAdminLoading(false);
  }),
  multiRecords: [],
  multiRecordsLoading: false,
  lastMultiName: '',
  setMultiRecords: action((state, payload) => {
    state.multiRecords = payload;
  }),
  setMultiRecordsLoading: action((state, payload) => {
    state.multiRecordsLoading = payload;
  }),
  setLastMultiName: action((state, payload) => {
    state.lastMultiName = payload;
  }),
  getMultiRecords: thunk(async (actions, payload) => {
    actions.setMultiRecordsLoading(true);
    const times = await MultiRecords(payload);
    if (times.ok) {
      actions.setMultiRecords(times.data);
    }
    actions.setMultiRecordsLoading(false);
  }),
  deleteLevel: thunk(async (actions, payload) => {
    const del = await LevelPackDeleteLevel(payload);
    if (del.ok) {
      actions.getRecords({
        name: payload.name,
        eolOnly: payload.showLegacy ? 0 : 1,
      });
    }
  }),
  levelsFound: [],
  adminLoading: false,
  setLevelsFound: action((state, payload) => {
    state.levelsFound = payload;
  }),
  setAdminLoading: action((state, payload) => {
    state.adminLoading = payload;
  }),
  searchLevel: thunk(async (actions, payload) => {
    const levs = await LevelsSearchAll(payload);
    if (levs.ok) {
      actions.setLevelsFound(levs.data);
    }
  }),
  addLevel: thunk(async (actions, payload) => {
    const add = await LevelPackAddLevel(payload);
    if (add.ok) {
      actions.getRecords({
        name: payload.name,
        eolOnly: payload.showLegacy ? 0 : 1,
      });
    }
  }),
  sortLevel: thunk(async (actions, payload) => {
    actions.setAdminLoading(true);
    const sort = await LevelPackSortLevel(payload);
    if (sort.ok) {
      actions.getRecords({
        name: payload.name,
        eolOnly: payload.showLegacy ? 0 : 1,
      });
    } else {
      actions.setAdminLoading(false);
    }
  }),
  sortPack: thunk(async (actions, payload) => {
    actions.setAdminLoading(true);
    const sort = await LevelPackSort(payload);
    if (sort.ok) {
      actions.getRecords({
        name: payload.name,
        eolOnly: payload.showLegacy ? 0 : 1,
      });
    } else {
      actions.setAdminLoading(false);
    }
  }),
};
