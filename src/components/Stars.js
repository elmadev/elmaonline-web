import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { StarBorder } from '@material-ui/icons';
import Rating from '@material-ui/lab/Rating';

const Stars = ({ voted, average, vote, clickable }) => (
  <Container>
    <Rating
      name="replay-rating"
      value={voted}
      onChange={(_event, newValue) => {
        vote(newValue);
      }}
      emptyIcon={<StarBorder fontSize="inherit" />}
      readOnly={!clickable}
      max={10}
    />
    <AverageRating>{Number(average)?.toFixed(2)}</AverageRating>
  </Container>
);

const Container = styled.div`
  font-size: 16px;
  height: 19px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const AverageRating = styled.div`
  margin-left: 0.35em;
  font-weight: bold;
`;

Stars.propTypes = {
  voted: PropTypes.number.isRequired,
  average: PropTypes.number.isRequired,
  vote: PropTypes.func.isRequired,
  clickable: PropTypes.bool.isRequired,
};

export default Stars;
