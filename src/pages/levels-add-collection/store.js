import { action, thunk } from 'easy-peasy';
import { AddCollection } from 'api';

export default {
  addSuccess: '',
  setAddSuccess: action((state, payload) => {
    state.addSuccess = payload;
  }),
  addCollection: thunk(async (actions, payload) => {
    const add = await AddCollection(payload);
    if (add.ok) {
      actions.setAddSuccess(payload.CollectionName);
    }
  }),
};
