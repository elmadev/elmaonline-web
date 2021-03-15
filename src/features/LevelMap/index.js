/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Loading from 'components/Loading';
import Portal from 'components/Portal';

import { levToSvg } from 'elma-js';

const MapContainer = styled.div`
  width: ${props => (props.fullscreen ? '100%' : props.width)};
  height: ${props => props.height};
  > div {
    ${props =>
      props.fullscreen &&
      css`
        top: 0;
        left: 0;
        position: fixed;
        z-index: 99;
      `}
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background: #333;
    border: 10px solid #333;

    transition: ${props => (props.fullscreen ? null : 'opacity 0.3s ease')};
    cursor: pointer;
    &:hover {
      opacity: ${props => (props.fullscreen ? 1 : 0.8)};
    }
  }

  svg .sky {
  }
  svg .APPLE {
  }
  svg .KILLER {
  }
  svg .FLOWER {
  }
  svg .START {
  }
  svg {
    overflow: hidden;
    object-fit: contain;
    width: 100%;
    height: 100%;
  }
`;

const LevelMap = props => {
  const { LevelIndex, width, height } = props;
  const [fullscreen, setFullscreen] = useState(false);
  const { levelData } = useStoreState(state => state.LevelMap);
  const { getLevelData } = useStoreActions(actions => actions.LevelMap);

  useEffect(() => {
    getLevelData(LevelIndex);
  }, [LevelIndex]);

  if (!levelData) {
    return <Loading />;
  } else if (!levelData.LevelData) {
    return <MapContainer />;
  }

  const svg = levToSvg(levelData.LevelData);

  return (
    <>
      {fullscreen ? (
        <Portal>
          <MapContainer
            fullscreen={fullscreen}
            onClick={() => setFullscreen(!fullscreen)}
            width={width}
            height={height}
          >
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </MapContainer>
        </Portal>
      ) : (
        <MapContainer
          fullscreen={fullscreen}
          onClick={() => setFullscreen(!fullscreen)}
          width={width}
          height={height}
        >
          <div dangerouslySetInnerHTML={{ __html: svg }} />
        </MapContainer>
      )}
    </>
  );
};

LevelMap.propTypes = {
  LevelIndex: PropTypes.number.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
};

LevelMap.defaultProps = {
  LevelIndex: null,
  width: '100%',
  height: '100%',
};

export default LevelMap;
