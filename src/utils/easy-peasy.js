import { action } from 'easy-peasy';

export const getSetter = key => {
  return action((state, payload) => {
    state[key] = payload;
  });
};

export const getUpdater = () => {
  return action((state, payload) => {
    state = payload(state);
    return state;
  });
};
