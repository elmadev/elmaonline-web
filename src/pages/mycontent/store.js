/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { MyLatest, ShareTimeFile } from 'api';
import { model } from 'utils/easy-peasy';

export default {
  timesAndReplays: {
    ...model(MyLatest),
  },
  shareTimeFile: thunk(async (actions, payload) => {
    const post = await ShareTimeFile(payload);
    if (post.ok) {
      actions.timesAndReplays.fetch({ search: payload.search, limit: 100 });
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
