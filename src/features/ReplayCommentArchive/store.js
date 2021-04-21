import { action, thunk } from 'easy-peasy';
import { getSetter, getUpdater } from 'utils/easy-peasy';
import { AllReplayComments } from '../../api';

export default {
  comments: [],
  setComments: getSetter('comments'),
  fetchComments: thunk(async (actions, payload, helpers) => {
    const response = await AllReplayComments();

    if (response.ok) {
      actions.setComments(response.data);
    }
  }),
};
