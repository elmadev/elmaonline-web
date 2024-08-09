import React from 'react';
import styled from 'styled-components';
import LevelCollectionStats from 'features/LevelCollectionStats';

const PlayStats = ({ LevelPack }) => {
  const levels = LevelPack?.levels || [];
  const levelIds = levels.map(l => l.LevelIndex);

  return (
    <Root>
      <LevelCollectionStats
        levelIds={levelIds}
      />
    </Root>
  );
};

const Root = styled.div`
  padding-bottom: 50px;
`;

export default PlayStats;
