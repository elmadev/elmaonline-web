import React from 'react';
import Recplayer from 'components/Recplayer';
import { useLocation } from '@reach/router';
import queryString from 'query-string';

const ReplayStandalone = () => {
  const location = useLocation();
  const { levUrl, recUrl } = queryString.parse(location.search);

  if (!levUrl || !recUrl) {
    return <>Missing required query parameters.</>;
  }

  return <Recplayer rec={recUrl} lev={levUrl} controls />;
};

export default ReplayStandalone;
