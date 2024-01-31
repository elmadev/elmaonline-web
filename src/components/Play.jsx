import React from 'react';
import styled from 'styled-components';
import { Paper } from 'components/Paper';
import { PlayArrow } from '@material-ui/icons';
import Sky from '../images/sky.png';

const Play = ({ onClick, type }) => {
  return (
    <Paper onClick={() => onClick && onClick()}>
      <Container>
        <Arrow />
        {type === 'replay' && <Text>Click to show replay</Text>}
        {type === 'map' && <Text>Click to show map</Text>}
      </Container>
    </Paper>
  );
};

const Text = styled.div`
  color: white;
`;

const Container = styled.div`
  background-image: url('${Sky}');
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  cursor: pointer;
  flex-direction: column;
  @media screen and (max-width: 500px) {
    height: 400px;
  }
`;

const Arrow = styled(PlayArrow)`
  & {
    font-size: 10rem !important;
    color: white;
  }
`;

export default Play;
