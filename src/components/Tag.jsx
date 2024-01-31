import React from 'react';
import Chip from '@material-ui/core/Chip';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const colors = {
  TAS: 'red',
  DNF: 'gray',
  Bug: 'brown',
  Nitro: 'blue',
  Unlisted: 'gray',
};

const StyledTag = styled(Chip)`
  &.MuiChip-root {
    ${p => p.label && `color: ${colors[p.label]}`};
    ${p => p.label && `border-color: ${colors[p.label]}`};
  }
`;

const Tag = ({ tag }) => (
  <StyledTag size="small" label={tag} variant="outlined" />
);

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
};

export default Tag;
