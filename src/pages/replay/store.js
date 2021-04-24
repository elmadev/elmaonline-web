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
    let uuids = payload.ReplayUuid;
    if (payload.merge) {
      uuids = `${uuids};${payload.merge}`;
    }
    const replays = await ReplayByUUID(uuids);
    if (replays.ok) {
      if (Array.isArray(replays.data)) {
        actions.setReplays(replays.data);
        actions.setReplayByUUID(
          replays.data.filter(
            d => d.RecFileName === `${payload.RecFileName}.rec`,
          )[0],
        );
      } else {
        actions.setReplayByUUID(replays.data);
      }
    }
    actions.setLoading(false);
  }),
};
