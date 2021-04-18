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
  replays: [],
  setReplays: action((state, payload) => {
    state.replays = payload;
  }),
  getReplayByUUID: thunk(async (actions, payload) => {
    actions.setReplays([]);
    actions.setLoading(true);
    const replays = await ReplayByUUID(payload);
    if (replays.ok) {
      if (Array.isArray(replays.data)) {
        actions.setReplays(replays.data);
        actions.setReplayByUUID(replays.data[0]);
      } else {
        actions.setReplayByUUID(replays.data);
      }
    }
    actions.setLoading(false);
  }),
};
