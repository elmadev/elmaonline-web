/* eslint-disable no-param-reassign */
import React from 'react';
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
import { orderBy, partition } from 'lodash';
import memoize from 'fast-memoize';

/**
 *
 * @param {Array} packs
 * @param {Array} favs
 * @param {Array} stats
 * @param {string} sort
 * @returns {*[]|*}
 */
const sortPacks = (packs, favs, stats, sort) => {
  if (!packs) {
    return [];
  }

  // set pack.Fav on all packs
  packs = packs.map(lp => {
    const Fav =
      favs.findIndex(f => f.LevelPackIndex === lp.LevelPackIndex) > -1;

    return { ...lp, Fav };
  });

  if (!sort) {
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
  }

  let sorted = [];

  if (!stats) {
    return packs;
  }

  // stats object from pack object. It's possible that some packs don't have stats.
  const st = p => stats[p.LevelPackIndex] || {};

  const pct = (num, div) => {
    return div > 0 ? num / div : 0;
  };

  if (sort === 'attempts') {
    sorted = orderBy(packs, [p => st(p).AttemptsAll], ['desc']);
  }

  if (sort === 'time') {
    sorted = orderBy(packs, [p => st(p).TimeAll], ['desc']);
  }

  if (sort === 'levels') {
    sorted = orderBy(packs, [p => st(p).CountLevels], ['desc']);
  }

  if (sort === 'avgKuskiCount') {
    sorted = orderBy(packs, [p => st(p).AvgKuskiPerLevel], ['desc']);
  }

  if (sort === 'topKuskiPct') {
    sorted = orderBy(
      packs,
      [
        p => {
          const s = st(p);
          return s && s.TopWrKuskis !== undefined && s.TopWrKuskis.length
            ? 1
            : 0;
        },
        p => pct(st(p).TopWrCount, st(p).CountLevels),
        p => st(p).CountLevels,
      ],
      ['desc', 'desc', 'desc'],
    );
  }

  if (sort === 'topKuskiCount') {
    sorted = orderBy(
      packs,
      [
        p => {
          const s = st(p);
          return s && s.TopWrKuskis !== undefined && s.TopWrKuskis.length
            ? 1
            : 0;
        },
        p => st(p).TopWrCount,
        p => st(p).CountLevels,
      ],
      ['desc', 'desc'],
    );
  }

  if (sort === 'attemptsPctD') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).AttemptsD, st(p).AttemptsAll), p => st(p).AttemptsAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'attemptsPctE') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).AttemptsE, st(p).AttemptsAll), p => st(p).AttemptsAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'attemptsPctF') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).AttemptsF, st(p).AttemptsAll), p => st(p).AttemptsAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'timePctD') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).TimeD, st(p).TimeAll), p => st(p).TimeAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'timePctE') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).TimeE, st(p).TimeAll), p => st(p).TimeAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'timePctF') {
    sorted = orderBy(
      packs,
      [p => pct(st(p).TimeF, st(p).TimeAll), p => st(p).TimeAll],
      ['desc', 'desc'],
    );
  }

  if (sort === 'minTime') {
    sorted = orderBy(packs, [p => st(p).ShortestWrTime], ['asc']);
  }

  if (sort === 'maxTime') {
    sorted = orderBy(
      packs,
      [
        p => {
          const t = st(p).LongestWrTime;

          return t > 0 ? t : 0;
        },
      ],
      ['desc'],
    );
  }

  if (sort === 'avgTime') {
    sorted = orderBy(packs, [p => st(p).AvgWrTime], ['desc']);
  }

  // move items with no stats to bottom (they often all appear at top)
  const [withStats, noStats] = partition(
    sorted,
    p => stats[p.LevelPackIndex] !== undefined,
  );

  return withStats.concat(noStats);
};

const cachedSort = memoize(sortPacks);

export default {
  checkSort: actionOn(
    actions => [
      actions.setLevelpacks,
      actions.setFavs,
      actions.setStats,
      actions.setSort,
    ],
    (state, target) => {
      state.levelpacks = cachedSort(
        state.levelpacks,
        state.favs,
        state.stats,
        state.sort,
      );
    },
  ),
  // sort lives in URL. Component needs to pass along to store.
  sort: '',
  setSort: action((state, payload) => {
    state.sort = payload;
  }),
  levelpacks: [],
  setLevelpacks: action((state, payload) => {
    state.levelpacks = payload;
  }),
  getLevelpacks: thunk(async (actions, sort, helpers) => {
    const get = await LevelPacks();
    if (get.ok) {
      actions.setLevelpacks(get.data);
    }
  }),
  // avoid re-fetch of favs except on page reload or add/remove fav
  favsDirty: true,
  setFavsDirty: getSetter('favsDirty'),
  favs: [],
  setFavs: action((state, payload) => {
    state.favs = payload;
  }),
  getFavs: thunk(async (actions, payload, helpers) => {
    if (!helpers.getState().favsDirty) {
      return;
    }

    const get = await LevelPackFavs();
    if (get.ok) {
      actions.setFavs(get.data);
      actions.setFavsDirty(false);
    }
  }),
  addFav: thunk(async (actions, payload) => {
    const post = await LevelPackFavAdd(payload);
    if (post.ok) {
      actions.setFavsDirty(true);
      actions.getFavs();
    }
  }),
  removeFav: thunk(async (actions, payload) => {
    const post = await LevelPackFavRemove(payload);
    if (post.ok) {
      actions.setFavsDirty(true);
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
  stats: {},
  setStats: action((state, payload) => {
    state.stats = payload;
  }),
  getStats: thunk(async (actions, payload, helpers) => {
    const get = await LevelPacksStats();
    if (get.ok) {
      const indexed = get.data.reduce((acc, val) => {
        acc[val.LevelPackIndex] = val;
        return acc;
      }, {});

      actions.setStats(indexed);
    }
  }),
};
