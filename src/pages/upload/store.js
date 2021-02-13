/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { UploadFile, UpdateFile } from 'api';

export default {
  response: null,
  update: false,
  setResponse: action((state, payload) => {
    state.response = payload;
  }),
  setUpdate: action((state, payload) => {
    state.update = payload;
  }),
  uploadFile: thunk(async (actions, payload) => {
    actions.setResponse(null);
    const post = await UploadFile(payload);
    if (post.ok) {
      actions.setResponse(post.data);
    }
  }),
  updateFile: thunk(async (actions, payload) => {
    const post = await UpdateFile(payload);
    if (post.ok) {
      actions.setUpdate(false);
    }
  }),
};
