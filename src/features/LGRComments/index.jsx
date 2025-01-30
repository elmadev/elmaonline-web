import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Comments from 'components/Comments';

const LGRComments = ({ LGRIndex }) => {
  const { comments } = useStoreState(state => state.LGRComments);
  const { getComments } = useStoreActions(actions => actions.LGRComments);

  useEffect(() => {
    getComments(LGRIndex);
  }, []);

  return <Comments comments={comments} loading={false} />;
};

export default LGRComments;
