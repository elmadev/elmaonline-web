import React from 'react';
import PropTypes from 'prop-types';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const RecPlayer =
  typeof document !== 'undefined' && require('recplayer-react').default; // eslint-disable-line global-require

const Recplayer = props => {
  const { rec, lev, width, height, controls, imageUrl, autoPlay } = props;

  let defaultZoom = 1;

  if (useMediaQuery('(max-width: 900px)')) {
    defaultZoom = 0.9;
  }

  if (useMediaQuery('(max-width: 640px)')) {
    defaultZoom = 0.75;
  }

  if (useMediaQuery('(max-width: 500px)')) {
    defaultZoom = 0.7;
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
      {RecPlayer && lev ? (
        <RecPlayer
          recUrl={rec}
          levUrl={lev}
          width={width}
          height={height}
          zoom={zoom}
          controls={controls}
          imageUrl={imageUrl}
          autoPlay={shouldAutoPlay}
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
};

Recplayer.defaultProps = {
  rec: null,
  width: 'auto',
  height: 'auto',
  zoom: undefined,
  controls: true,
  imageUrl: 'https://api.elma.online/recplayer',
  autoPlay: 'if-visible',
};

export default Recplayer;
