/* eslint-disable no-param-reassign */
import { action, thunk } from 'easy-peasy';
import { Players, Ranking } from 'api';
import { getSetter } from 'utils/easy-peasy';
import { groupBy, sortBy, values, mapValues, orderBy } from 'lodash';

const sortCountries = (countries, sort) => {
  if (sort === 'rankedPlayers') {
    return sortBy(countries, [c => c.rankedCount]).reverse();
  }

  if (sort === 'allPlayers') {
    return sortBy(countries, [c => c.playerCount]).reverse();
  }

  if (sort === 'topPlayer') {
    return sortBy(countries, [c => c.topRanking]).reverse();
  }

  return sortBy(countries, [c => c.avgTopRanking]).reverse();
};

export default {
  playerList: [],
  playersByCountry: [],
  setPlayerList: getSetter('playerList'),
  setPlayersByCountry: getSetter('playersByCountry'),
  // for component to use when sort option changes
  sortCountries: thunk((actions, sort, helpers) => {
    const countries = helpers.getState().playersByCountry;

    actions.setPlayersByCountry(sortCountries(countries, sort));
  }),
  // for use in store only
  _buildPlayersByCountry: thunk((actions, players) => {
    // object with country codes as keys, containing arrays of player objects
    const byCountry = groupBy(players, 'Country');

    const avgTop = (players, howMany) => {
      return (
        players
          .slice(0, howMany)
          .map(p => p.RankingData.RankingAll)
          .reduce((a, c) => a + c, 0) / howMany
      );
    };

    // convert countries to array and map values
    let byCountryArr = values(
      mapValues(byCountry, (players, index) => {
        // the array of player objects
        let ps = mapValues(players, p => {
          const r = p.RankingData || {};

          // ensure all players have predictable RankingData object,
          // its just too repetitive to always check if object is null,
          // and format numeric values and stuff.
          p.RankingData = {
            ...r,
            RankingAll: +r.RankingAll || 0,
            PlayedAll: +r.PlayedAll || 0,
            WinsAll: +r.WinsAll || 0,
            DesignedAll: +r.DesignedAll || 0,
          };

          return p;
        });

        // sort players within country
        ps = orderBy(
          ps,
          [p => p.RankingData.RankingAll, p => p.Kuski],
          ['desc', 'asc'],
        );

        return {
          country: index,
          avgTopRanking: avgTop(ps, 5),
          topRanking: avgTop(ps, 1),
          playerCount: ps.length,
          rankedCount: ps.filter(p => p.RankingData.RankingAll > 0).length,
          highestRating: ps.length && ps[0].RankingData.RankingAll,
          players: ps,
        };
      }),
    );

    byCountryArr = sortCountries(byCountryArr, 'avgTop');

    actions.setPlayersByCountry(byCountryArr);
  }),
  getPlayers: thunk(async actions => {
    const players = await Players();

    if (players.ok) {
      actions.setPlayerList(players.data);

      // for now, build players by country always when fetching all players.
      // we only fetch players once ever, so this is fine, even though
      // building by country is mildly expensive.
      actions._buildPlayersByCountry(players.data);
    }
  }),
};
