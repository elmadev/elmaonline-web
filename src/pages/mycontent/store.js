/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { MyLatest, ShareTimeFile, MyFiles, DeleteFile } from 'api';
import { model } from 'utils/easy-peasy';

export default {
  timesAndReplays: {
    ...model(MyLatest),
  },
  files: {
    ...model(MyFiles),
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
  fileSearch: {
    filename: '',
    from: '',
    to: '',
  },
  setFileSearch: action((state, payload) => {
    state.fileSearch[payload.field] = payload.value;
  }),
  deleteFile: thunk(async (actions, payload) => {
    const post = await DeleteFile(payload);
    if (post.ok) {
      actions.files.fetch({ limit: payload.limit, search: payload.search });
    }
  }),
};
