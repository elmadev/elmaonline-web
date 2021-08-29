import React from 'react';
import { Link as ReachLink } from '@reach/router';

const Link = ({ to, children, ...props }) => {
  if (to.substring(0, 4) === 'http') {
    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  }
  return (
    <ReachLink to={to} {...props}>
      {children}
    </ReachLink>
  );
};

export default Link;
