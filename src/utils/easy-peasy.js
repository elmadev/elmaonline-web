import { action, thunk } from 'easy-peasy';

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

export const model = endpoint => ({
  data: [],
  loading: false,
  error: '',
  setData: action((state, response) => {
    state.data = response;
    state.loading = false;
  }),
  startLoading: action(state => {
    state.loading = true;
  }),
  setError: action((state, problem) => {
    state.error = problem;
    state.loading = false;
  }),
  fetch: thunk(async (actions, payload) => {
    actions.startLoading();
    const response = await endpoint(payload);
    if (response.ok) {
      actions.setData(response.data);
      return;
    }
    actions.setError(
      `API ${
        response.originalError.message
      } - ${response.config.method.toUpperCase()} ${response.config.url}`,
    );
  }),
});
