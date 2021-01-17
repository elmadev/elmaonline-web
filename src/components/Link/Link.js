import React from 'react';
import { Link as ReachLink } from "@reach/router"

const Link = ({ to, children, ...props }) => {
  /* let navTo = to;
  if (navTo.length > 2 && navTo.subtring(0, 1) === '/') {
    navTo = navTo.subtring(1, navTo.length);
  } */
  return (
    <ReachLink to={to} {...props}>{children}</ReachLink>
  );
};

export default Link;
