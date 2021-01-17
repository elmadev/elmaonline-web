import React from 'react';
import config from 'config';

const Download = ({ url, children }) => {
  return (
    <a href={`${config.dlUrl}${url}`}>
      {children}
    </a>
  );
};

export default Download;
