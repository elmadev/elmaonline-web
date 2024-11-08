import React from 'react';
import PropTypes from 'prop-types';
import { useStoreState } from 'easy-peasy';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import RecPlayerReact from 'recplayer-react';

const Recplayer = props => {
  const {
    rec = null,
    lev,
    shirt,
    width = 'auto',
    height = 'auto',
    controls = true,
    imageUrl = 'https://api.elma.online/recplayer',
    autoPlay = 'if-visible',
    merge = false,
    forceRefresh = false,
  } = props;
  const {
    settings: { grass, pictures, customSkyGround, zoomScale, arrows },
  } = useStoreState(state => state.ReplaySettings);

  let defaultZoom = 1;

  if (useMediaQuery('(max-width: 900px)')) {
    defaultZoom = 0.9;
  }

  if (useMediaQuery('(max-width: 640px)')) {
    defaultZoom = 0.75;
  }

  if (useMediaQuery('(max-width: 500px)')) {
    defaultZoom = 0.58;
  }

  if (zoomScale && zoomScale > 0) {
    defaultZoom = defaultZoom * (zoomScale / 100);
  }

  const zoom = props.zoom || defaultZoom;

  let shouldAutoPlay = false;

  if (autoPlay === 'if-visible') {
    const { visibilityState } = document;

    if (visibilityState === 'visible') {
      shouldAutoPlay = true;
    }
  } else if (autoPlay === 'no') {
    shouldAutoPlay = false;
  } else if (autoPlay === 'yes') {
    shouldAutoPlay = true;
  }

  return (
    <>
      {RecPlayerReact && lev ? (
        <RecPlayerReact
          recUrl={rec}
          levUrl={lev}
          shirtUrl={shirt}
          width={width}
          height={height}
          zoom={zoom}
          controls={controls}
          imageUrl={imageUrl}
          autoPlay={shouldAutoPlay}
          merge={merge}
          levelOptions={{
            grass,
            pictures,
            customBackgroundSky: customSkyGround,
            arrows,
          }}
          showStartPos
          fitLev={!rec}
          showZoomBtns
          showPlaybackBtns={Boolean(rec)}
          key={forceRefresh ? rec + shirt : undefined}
        />
      ) : (
        <span>Loading..</span>
      )}
    </>
  );
};

Recplayer.propTypes = {
  rec: PropTypes.string,
  lev: PropTypes.string.isRequired,
  width: PropTypes.string,
  height: PropTypes.string,
  zoom: PropTypes.number,
  controls: PropTypes.bool,
  imageUrl: PropTypes.string,
  autoPlay: PropTypes.oneOf(['if-visible', 'yes', 'no']),
  merge: PropTypes.bool,
  forceRefresh: PropTypes.bool,
};

export default Recplayer;
