import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import recplayer from 'recplayer';
import styled from 'styled-components';
import PlayIcon from './play.svg';
import PauseIcon from './pause.svg';
import FullscreenIcon from './fullscreen.svg';

let controller;

const Recplay = ({
  levUrl,
  recUrl,
  autoPlay = false,
  imageUrl = 'http://www.recsource.tv/images',
  width = 'auto',
  height = 'auto',
  zoom = 0.8,
  controls = true,
  showGrass = true,
  showPictures = true,
  showCustomBackgroundSky = true,
  onInitialize,
  onFrameChange,
}) => {
  const [playing, setPlaying] = useState(autoPlay);
  const [maxFrames, setMaxFrames] = useState(0);
  const [progressBarDrag, setProgressBarDrag] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [progress, setProgress] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const playerContainerRef = useRef();
  const progressBarRef = useRef();

  const removeAnimationLoop = () => {
    if (controller) {
      controller.removeAnimationLoop();
    }
  };

  const frameCallback = (currentFrame, maxFrames) => {
    setMaxFrames(maxFrames);
    setCurrentFrame(currentFrame > maxFrames ? maxFrames : currentFrame);
    setProgress((currentFrame / maxFrames) * 100);
  };

  const autoResize = useCallback(() => {
    if (controller && playerContainerRef.current) {
      const w =
        ((width === 'auto' || fullscreen) &&
          playerContainerRef.current.offsetWidth) ||
        width;
      const h =
        ((height === 'auto' || fullscreen) &&
          playerContainerRef.current.offsetHeight) ||
        height;
      controller.resize(w, h);
    }
  }, [playerContainerRef, width, height, fullscreen]);

  const initPlayer = useCallback(
    urls => {
      recplayer(
        urls.levUrl,
        imageUrl,
        playerContainerRef.current,
        document,
        frameCallback,
        autoPlay,
      )(cnt => {
        controller = cnt;
        autoResize();
        urls.recUrl && cnt.loadReplay(urls.recUrl);
        controller.player().setScale(zoom);
        onInitialize && onInitialize(controller);
      });
    },
    [zoom, imageUrl, autoPlay, autoResize, onInitialize],
  );

  useEffect(
    function updateLevelOptions() {
      if (controller) {
        const player = controller.player();
        player.setLevOpts({
          grass: showGrass,
          pictures: showPictures,
          customBackgroundSky: showCustomBackgroundSky,
        });
        // player.setFrame(player.frame());
      }
    },
    [showGrass, showPictures, showCustomBackgroundSky],
  );

  const prevLevUrl = usePrevious(levUrl);
  const prevRecUrl = usePrevious(recUrl);
  useEffect(
    function componentWillReceiveProps() {
      if (levUrl !== prevLevUrl && playerContainerRef.current) {
        removeAnimationLoop();
        playerContainerRef.current.querySelector('canvas')?.remove();
        setPlaying(false);
        initPlayer({
          levUrl: levUrl,
          recUrl: recUrl,
        });
      } else if (recUrl !== prevRecUrl) {
        recUrl && controller.loadReplay(recUrl);
      }
    },
    [levUrl, recUrl, prevLevUrl, prevRecUrl, initPlayer, playerContainerRef],
  );

  const playPause = useCallback(() => {
    if (controller) {
      controller.player().playPause();
      setPlaying(!playing);
    }
  }, [playing, setPlaying]);

  const goToFrame = useCallback(frame => {
    if (controller) {
      controller.setFrame(frame);
    }
  }, []);

  useEffect(
    function updateFullScreen() {
      autoResize();
    },
    [fullscreen, autoResize],
  );

  const progressBarOnStart = () => {
    setProgressBarDrag(true);
  };

  useEffect(function handleFrameChange() {
    if (controller && onFrameChange) {
      const currentFrame = controller.player().frame();
      onFrameChange(currentFrame);
    }
  });

  const progressBarOnMove = useCallback(
    pos => {
      if (pos < 0) {
        pos = 0;
      } else if (pos > 1) {
        pos = 1;
      }

      goToFrame(maxFrames * pos);
    },
    [maxFrames, goToFrame],
  );

  const progressBarOnMouseMove = useCallback(
    event => {
      if (progressBarRef.current && progressBarDrag) {
        const pos =
          (event.pageX - progressBarRef.current.getBoundingClientRect()?.left) /
          progressBarRef.current.offsetWidth;
        progressBarOnMove(pos);
      }
    },
    [progressBarRef, progressBarDrag, progressBarOnMove],
  );

  const progressBarOnTouchMove = e => {
    if (progressBarRef.current && progressBarDrag) {
      const pos =
        (e.touches[0].clientX -
          progressBarRef.current?.getBoundingClientRect()?.left) /
        progressBarRef.current?.offsetWidth;
      progressBarOnMove(pos);
    }
  };

  const progressBarOnEnd = useCallback(() => {
    setProgressBarDrag(false);
  }, [setProgressBarDrag]);

  useEffect(function componentWillUnmount() {
    return () => {
      removeAnimationLoop();
    };
  }, []);

  useEffect(
    function addEventListeners() {
      window.addEventListener('resize', autoResize);
      document.addEventListener('mouseup', progressBarOnEnd);
      document.addEventListener('mousemove', progressBarOnMouseMove);

      return function removeEventListeners() {
        window.removeEventListener('resize', autoResize);
        document.removeEventListener('mouseup', progressBarOnEnd);
        document.removeEventListener('mousemove', progressBarOnMouseMove);
      };
    },
    [autoResize, progressBarOnEnd, progressBarOnMouseMove],
  );

  const playerContainerOnTap = () => {
    playerContainerRef.current?.focus();
  };

  return (
    <RecplayContainer
      style={{
        height: height === 'auto' ? '100%' : height + 'px',
        width: width === 'auto' ? '100%' : width + 'px',
      }}
      dragging={progressBarDrag}
    >
      <RecplayPlayerContainer
        fullscreen={fullscreen}
        onTouchStart={playerContainerOnTap}
        tabIndex={0}
        ref={playerContainerRef}
      >
        {controls && (
          <RecplayControls>
            <RecplayControlsProgressBar
              ref={progressBarRef}
              onMouseDown={progressBarOnStart}
              onTouchMove={progressBarOnTouchMove}
              onTouchStart={progressBarOnStart}
              onTouchEnd={progressBarOnEnd}
            >
              <RecplayControlsProgressBarBackground>
                <RecplayControlsProgressBarProgress
                  style={{ width: progress + '%' }}
                />
              </RecplayControlsProgressBarBackground>
            </RecplayControlsProgressBar>
            <RecplayControlsBottomRow>
              {!playing && (
                <RecplayControl onClick={playPause}>
                  <RecplayControlIcon src={PlayIcon} alt="Play" />
                </RecplayControl>
              )}
              {playing && (
                <RecplayControl onClick={playPause}>
                  <RecplayControlIcon src={PauseIcon} alt="Pause" />
                </RecplayControl>
              )}
              <RecplayControlsTimestamp>
                {frameToTimestamp(currentFrame)}
              </RecplayControlsTimestamp>
              <RecplayControlFullscreen
                onClick={() => {
                  setFullscreen(!fullscreen);
                }}
              >
                <RecplayControlIcon src={FullscreenIcon} alt="Fullscreen" />
              </RecplayControlFullscreen>
            </RecplayControlsBottomRow>
          </RecplayControls>
        )}
      </RecplayPlayerContainer>
    </RecplayContainer>
  );
};

const RecplayControls = styled.div`
  position: absolute;
  bottom: 0;
  color: #fff;
  width: 100%;
  opacity: 0;
  transition-delay: 1s;
`;

const RecplayContainer = styled.div`
  position: relative;
  overflow: hidden;

  &:hover ${RecplayControls} {
    transition-delay: 0s;
  }
`;

const RecplayPlayerContainer = styled.div`
  width: 100%;
  height: 100%;

  & canvas {
    display: block;
  }

  ${({ fullscreen }) =>
    fullscreen &&
    `
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  `}

  &:hover,
  &:focus {
    ${RecplayControls} {
      opacity: 1;
    }
  }

  ${({ dragging }) => dragging && `opacity: 1;`}
`;

const RecplayControl = styled.div`
  padding: 12px;
  float: left;
  cursor: pointer;
`;

const RecplayControlFullscreen = styled(RecplayControl)`
  float: right;
`;

const RecplayControlIcon = styled.img`
  width: 15px;
  height: 15px;
  display: block;
`;

const RecplayControlsProgressBar = styled.div`
  height: 10px;
  margin-bottom: -6px;
  position: relative;
  user-select: none;
  padding-top: 6px;

  &hover {
    cursor: pointer;
  }
`;

const RecplayControlsProgressBarBackground = styled.div`
  height: 4px;
  background: #3a3a3a;
  overflow: hidden;
`;

const RecplayControlsProgressBarProgress = styled.div`
  background: #fff;
  height: 100%;
  width: 0;
`;

const RecplayControlsTimestamp = styled.div`
  padding: 0;
  line-height: 2.4rem;
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 500;
  font-family: 'Roboto Mono', monospace;
  float: left;
`;

const RecplayControlsBottomRow = styled.div`
  background: #212121;
  overflow: hidden;
  z-index: 9;
`;

Recplay.propTypes = {
  battle: PropTypes.shape(),
};

const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

const frameToTimestamp = frame => {
  let time = Math.floor((frame * 100) / 30);
  const csec = (time % 100).toString().padStart(2, '0');
  time = Math.floor(time / 100);
  const sec = (time % 60).toString().padStart(2, '0');
  time = Math.floor(time / 60);
  return time > 0 ? time + ':' + sec + ':' + csec : sec + ':' + csec;
};

export default Recplay;
