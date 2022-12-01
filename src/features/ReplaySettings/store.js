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
      // scaling (%) for default zoom on page load
      zoomScale: 100,
    },
    { storage: 'localStorage' },
  ),
  toggleSetting: action((state, payload) => {
    state.settings[payload] = !state.settings[payload];
  }),
  setZoomScale: action((state, payload) => {
    state.settings.zoomScale = parseInt(payload, 10);
  }),
};
