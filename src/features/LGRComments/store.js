import { action, thunk } from 'easy-peasy';
import { LGRComments, NewLGRComment } from 'api';

export default {
  page: 'LGRComments',

  comments: [],
  setComments: action((state, payload) => {
    state.comments = payload;
  }),
  getComments: thunk(async (actions, LGRIndex) => {
    const lgrComments = await LGRComments(LGRIndex);
    if (lgrComments.ok) {
      actions.setComments(lgrComments.data);
    }
  }),
  addComment: thunk(async (actions, payload) => {
    const add = await NewLGRComment(payload);
    if (add.ok) {
      actions.getComments(payload.LGRIndex);
    }
  }),
};
