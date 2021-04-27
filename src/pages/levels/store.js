/* eslint-disable no-param-reassign */
import { action, thunk, actionOn } from 'easy-peasy';
import {
  LevelPacks,
  LevelPackFavAdd,
  LevelPackFavRemove,
  LevelPackFavs,
  Collections,
  LevelPacksStats,
} from 'api';
import { getSetter } from 'utils/easy-peasy';
import { mapValues, groupBy } from 'lodash';

const sortPacks = (packs, favs) => {
  if (!packs) {
    return [];
  }

  packs = packs.map(lp => {
    const Fav =
      favs.findIndex(f => f.LevelPackIndex === lp.LevelPackIndex) > -1;

    return { ...lp, Fav };
  });

  return packs.sort((a, b) => {
    if (a.LevelPackName === 'Int') return -1;
    if (b.LevelPackName === 'Int') return 1;
    if (a.Fav !== b.Fav) {
      if (a.Fav) return -1;
      if (b.Fav) return 1;
    }
    return a.LevelPackName.toLowerCase().localeCompare(
      b.LevelPackName.toLowerCase(),
    );
  });
};

export default {
  levelpacks: [],
  setLevelpacks: action((state, payload) => {
    state.levelpacks = sortPacks(payload, state.favs);
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
    state.levelpacks = sortPacks(state.levelpacks, state.favs);
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
  collections: [],
  setCollections: action((state, payload) => {
    state.collections = payload;
  }),
  getCollections: thunk(async actions => {
    const get = await Collections();
    if (get.ok) {
      actions.setCollections(get.data);
    }
  }),
  stats: [],
  setStats: getSetter('stats'),
  getStats: thunk(async actions => {
    const get = await LevelPacksStats();
    if (get.ok) {
      // <Array<Object>> -> <Object<Object>>
      const obj = groupBy(get.data, s => s.LevelPackIndex);
      const obj2 = mapValues(obj, arrayOfObjs => arrayOfObjs[0] || {});

      actions.setStats(obj2);
    }
  }),
};
