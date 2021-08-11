/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { MyLatest, ShareTimeFile } from 'api';

export default {
  timesAndReplays: '',
  setTimesAndReplays: action((state, payload) => {
    state.timesAndReplays = payload;
  }),
  getTimesAndReplays: thunk(async (actions, payload) => {
    const get = await MyLatest(payload);
    if (get.ok) {
      actions.setTimesAndReplays(get.data);
    }
  }),
  shareTimeFile: thunk(async (actions, payload) => {
    const post = await ShareTimeFile(payload);
    if (post.ok) {
      actions.getTimesAndReplays(100);
    }
  }),
  search: {
    level: '',
    from: '',
    to: '',
  },
  setSearch: action((state, payload) => {
    state.search[payload.field] = payload.value;
  }),
};
