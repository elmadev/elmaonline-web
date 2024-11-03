import { action, computed, thunk, memo } from 'easy-peasy';
import { LevelData } from 'api';

export default {
  levelData: {},
  setLevelData: action((state, payload) => {
    state.levelData[payload.LevelIndex] = payload;
  }),
  getLevelData: thunk(async (actions, payload) => {
    const levelData = await LevelData(payload);
    if (levelData.ok && levelData.data) {
      actions.setLevelData(levelData.data);
    }
  }),
  getByLevelIndex: computed(state => {
    return memo(id => state.levelData[id], 1000);
  }),
};
