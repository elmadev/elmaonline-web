import { action } from 'easy-peasy';

export const getSetter = key => {
  return action((state, payload) => {
    state[key] = payload;
  });
};
