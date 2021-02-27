/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import {
  LevelPacks,
  LevelPackFavAdd,
  LevelPackFavRemove,
  LevelPackFavs,
} from 'api';

export default {
  levelpacks: '',
  setLevelpacks: action((state, payload) => {
    state.levelpacks = payload;
  }),
  getLevelpacks: thunk(async actions => {
    const get = await LevelPacks();
    if (get.ok) {
      actions.setLevelpacks(get.data);
    }
  }),
  favs: [],
  setFavs: action((state, payload) => {
    state.favs = payload;
  }),
  getFavs: thunk(async actions => {
    const get = await LevelPackFavs();
    if (get.ok) {
      actions.setFavs(get.data);
    }
  }),
  addFav: thunk(async (actions, payload) => {
    const post = await LevelPackFavAdd(payload);
    if (post.ok) {
      actions.getFavs();
    }
  }),
  removeFav: thunk(async (actions, payload) => {
    const post = await LevelPackFavRemove(payload);
    if (post.ok) {
      actions.getFavs();
    }
  }),
};
