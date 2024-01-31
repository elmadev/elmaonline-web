import { RecapOverall, RecapPlayer, RecapBestof } from 'api';
import { model } from 'utils/easy-peasy';

export default {
  overall: {
    ...model(RecapOverall),
  },
  player: {
    ...model(RecapPlayer),
  },
  bestof: {
    ...model(RecapBestof),
  },
};
