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

const formatError = response => {
  return `API ${
    response.originalError.message
  } - ${response.config.method.toUpperCase()} ${response.config.url}`;
};

export const model = (
  endpoint,
  create = null,
  update = null,
  remove = null,
  settings = {
    doNotRefetch: false, // true means a create/update/delete will not refetch
  },
) => ({
  data: null,
  loading: false,
  error: '',
  fetchPayload: null,
  response: null,
  setData: action((state, response) => {
    state.data = response;
    state.loading = false;
  }),
  startLoading: action((state, payload) => {
    state.loading = true;
    state.fetchPayload = payload;
  }),
  setError: action((state, problem) => {
    state.error = problem;
    state.loading = false;
  }),
  setResponse: action((state, response) => {
    state.response = response;
  }),
  fetch: thunk(async (actions, payload) => {
    actions.startLoading(payload);
    const response = await endpoint(payload);
    if (response.ok) {
      actions.setData(response.data);
      return;
    }
    actions.setError(formatError(response));
  }),
  refetch: thunk(async (actions, payload, { getState }) => {
    const response = await endpoint(getState().fetchPayload);
    if (response.ok) {
      actions.setData(response.data);
      return;
    }
    actions.setError(formatError(response));
  }),
  create: thunk(async (actions, payload) => {
    if (create) {
      const post = await create(payload);
      if (post.ok) {
        actions.setResponse(post.data);
        if (!settings.doNotRefetch) {
          actions.refetch();
        }
      }
    }
  }),
});
