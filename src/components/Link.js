import React from 'react';
import { Link as ReachLink } from '@reach/router';

const Link = ({ to, children, ...props }) => {
  return (
    <ReachLink to={to} {...props}>
      {children}
    </ReachLink>
  );
};

export default Link;
