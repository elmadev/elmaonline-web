/* eslint-disable no-param-reassign */
import { model } from 'utils/easy-peasy';
import { BattleLeague, BattleResults } from 'api';

export default {
  league: {
    ...model(BattleLeague),
  },
  battle: {
    ...model(BattleResults),
  },
};
