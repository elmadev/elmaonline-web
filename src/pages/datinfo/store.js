import { action, thunk } from 'easy-peasy';
import { GetDatInfo } from 'api';

export default {
  datInfo: {},
  error: '',
  setDatInfo: action((state, payload) => {
    state.datInfo = payload;
  }),
  setError: action((state, payload) => {
    state.error = payload;
  }),
  getDatInfo: thunk(async (actions, payload) => {
    const datInfo = await GetDatInfo(payload);
    if (datInfo.ok) {
      actions.setDatInfo(datInfo.data);
    }
  }),
  cleanup: action(state => {
    state.error = '';
    state.datInfo = {};
  }),
};
