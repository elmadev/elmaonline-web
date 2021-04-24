/* eslint-disable no-param-reassign */
import { action, persist } from 'easy-peasy';

export default {
  settings: persist(
    {
      revealOnClick: false,
      autoPlay: false,
      grass: true,
      pictures: true,
      customSkyGround: true,
      theater: false,
    },
    { storage: 'localStorage' },
  ),
  toggleSetting: action((state, payload) => {
    state.settings[payload] = !state.settings[payload];
  }),
};
