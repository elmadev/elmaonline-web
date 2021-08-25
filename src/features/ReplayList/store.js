/* eslint-disable no-param-reassign */
import { action, thunk, persist } from 'easy-peasy';
import {
  Replays,
  BattleListPeriod,
  GetTags,
  ReplayDrivenBy,
  ReplayUploadedBy,
} from 'api';

export default {
  replays: null,
  setReplays: action((state, payload) => {
    state.replays = payload;
  }),
  getReplays: thunk(async (actions, payload) => {
    let get = null;
    if (payload.drivenBy) {
      get = await ReplayDrivenBy(payload.drivenBy);
    } else if (payload.uploadedBy) {
      get = await ReplayUploadedBy(payload.uploadedBy);
    } else {
      get = await Replays(payload);
    }
    if (get.ok) {
      actions.setReplays(get.data);
    }
  }),
  battles: null,
  setBattles: action((state, payload) => {
    state.battles = payload;
  }),
  getBattles: thunk(async (actions, payload) => {
    const get = await BattleListPeriod(payload);
    if (get.ok) {
      actions.setBattles(get.data);
    }
  }),

  tagOptions: [],
  setTagOptions: action((state, payload) => {
    state.tagOptions = payload;
  }),
  getTagOptions: thunk(async actions => {
    const get = await GetTags();
    if (get.ok) {
      actions.setTagOptions(get.data);
    }
  }),
  settings: persist(
    {
      grid: true,
      sortBy: 'uploaded',
    },
    { storage: 'localStorage' },
  ),
  setSettings: action((state, payload) => {
    state.settings = { ...state.settings, ...payload };
  }),
};
