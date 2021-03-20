/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { ReplayByUUID } from 'api';

export default {
  replay: null,
  setReplayByUUID: action((state, payload) => {
    state.replay = payload;
  }),
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  getReplayByUUID: thunk(async (actions, payload) => {
    actions.setLoading(true);
    const replays = await ReplayByUUID(payload);
    if (replays.ok) {
      actions.setReplayByUUID(replays.data);
    }
    actions.setLoading(false);
  }),
};
