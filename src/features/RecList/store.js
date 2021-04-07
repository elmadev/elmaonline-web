/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { ReplaysByLevelIndex, GetTags } from 'api';

export default {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  replays: [],
  setReplays: action((state, payload) => {
    state.replays = payload;
  }),
  getReplays: thunk(async (actions, payload) => {
    actions.setLoading(true);
    const recs = await ReplaysByLevelIndex(payload);
    if (recs.ok) {
      actions.setReplays(recs.data);
    }
    actions.setLoading(false);
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
};
