import { action, thunk, persist } from 'easy-peasy';
import { LGRs } from 'api';

export default {
  page: 'LGRList',
  lgrs: [],
  setLGRs: action((state, payload) => {
    state.lgrs = payload;
  }),
  getLGRs: thunk(async actions => {
    const get = await LGRs();
    if (get.ok) {
      actions.setLGRs(get.data);
    }
  }),
  settings: persist(
    {
      grid: true,
      sortBy: 'Downloads',
    },
    { storage: 'localStorage' },
  ),
  setSettings: action((state, payload) => {
    state.settings = { ...state.settings, ...payload };
  }),
};
