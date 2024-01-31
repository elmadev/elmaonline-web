/* eslint-disable react/no-danger */
import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Loading from 'components/Loading';
import Portal from 'components/Portal';
import Time from 'components/Time';

import { levToSvg } from 'elma-js';

const LevelMap = ({
  LevelIndex,
  width,
  height,
  interaction = true,
  time,
  rating,
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  const { getLevelData } = useStoreActions(actions => actions.LevelMap);
  const getByLevelIndex = useStoreState(
    state => state.LevelMap.getByLevelIndex,
  );
  const {
    settings: { showGravityApples },
  } = useStoreState(state => state.Level);
  const levelData = getByLevelIndex(LevelIndex);

  useEffect(() => {
    if (!levelData) {
      getLevelData(LevelIndex);
    }
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
            showGravityApples={showGravityApples}
          >
            <div dangerouslySetInnerHTML={{ __html: svg }} />
          </MapContainer>
        </Portal>
      ) : (
        <MapContainer
          fullscreen={fullscreen}
          interaction={interaction}
          onClick={() => (interaction ? setFullscreen(!fullscreen) : null)}
          showGravityApples={showGravityApples}
          width={width}
          height={height}
        >
          <div dangerouslySetInnerHTML={{ __html: svg }} />
          {time && (
            <TimeContainer>
              <Time thousands time={time} />
            </TimeContainer>
          )}
          {rating && <RatingContainer>{rating}</RatingContainer>}
        </MapContainer>
      )}
    </>
  );
};

const MapContainer = styled.div`
  width: ${props => (props.fullscreen ? '100%' : props.width)};
  height: ${props => props.height};
  position: relative;
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
    ${p =>
      p.fullscreen
        ? ''
        : 'max-height: 420px; @media screen and (max-width: 768px) { max-height: 220px; }'}
    box-sizing: border-box;
    background: #333;
    border: 10px solid #333;

    transition: ${props =>
      props.fullscreen || !props.interaction ? null : 'opacity 0.3s ease'};
    cursor: pointer;
    &:hover {
      opacity: ${props => (props.fullscreen || !props.interaction ? 1 : 0.8)};
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

  ${props =>
    props.showGravityApples &&
    `
  svg .GRAV_UP {
    clip-path: polygon(
      50% 0,
      100% 40%,
      70% 40%,
      70% 100%,
      30% 100%,
      30% 40%,
      0 40%
    );
  }

  svg .GRAV_LEFT {
    clip-path: polygon(
      40% 0%,
      40% 30%,
      100% 30%,
      100% 70%,
      40% 70%,
      40% 100%,
      0% 50%
    );
  }

  svg .GRAV_RIGHT {
    clip-path: polygon(
      0% 30%,
      60% 30%,
      60% 0%,
      100% 50%,
      60% 100%,
      60% 70%,
      0% 70%
    );
  }

  svg .GRAV_DOWN {
    clip-path: polygon(
      50% 100%,
      100% 60%,
      70% 60%,
      70% 0,
      30% 0,
      30% 60%,
      0 60%
    );
  }`}

  svg {
    overflow: hidden;
    object-fit: contain;
    width: 100%;
    height: 100%;
    ${p =>
      p.fullscreen
        ? ''
        : 'max-height: 400px; @media screen and (max-width: 768px) { max-height: 200px; }'}
  }
`;

const TimeContainer = styled.span`
  background: #219653;
  color: #f1f1f1;
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  padding: 2px 3px;
`;

const RatingContainer = styled.span`
  background: #fff;
  position: absolute;
  right: 0.5rem;
  bottom: 0.5rem;
  padding: 2px 3px;
  background: yellow;
`;

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
