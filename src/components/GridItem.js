import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Link from 'components/Link';

const GridItem = ({ name, longname, to, children, promote }) => {
  return (
    <Container promote={promote}>
      {to ? (
        <Link to={to}>
          <ShortName>{name}</ShortName>
          <LongName>{longname}</LongName>
        </Link>
      ) : (
        <>
          <ShortName>{name}</ShortName>
          <LongName>{longname}</LongName>
        </>
      )}
      {children}
    </Container>
  );
};

const ShortName = styled.div`
  font-weight: 500;
  color: #219653;
`;

const LongName = styled.div`
  font-size: 13px;
`;

const Container = styled.div`
  float: left;
  width: ${p => (p.promote ? '40%' : '20%')};
  height: ${p => (p.promote ? '200px' : '100px')};
  padding-left: 1px;
  padding-top: 1px;
  box-sizing: border-box;
  position: relative;
  > a {
    display: block;
    background: #fff;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    color: inherit;
    overflow: hidden;
    position: relative;
    :hover {
      background: #f9f9f9;
    }
  }
  @media (max-width: 1350px) {
    width: ${p => (p.promote ? '50%' : '25%')};
  }
  @media (max-width: 1160px) {
    width: calc(100% / 3);
  }
  @media (max-width: 730px) {
    width: 50%;
  }
  @media (max-width: 480px) {
    width: 100%;
    height: unset;
  }
`;

GridItem.propTypes = {
  name: PropTypes.string,
  longname: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.node,
  promote: PropTypes.bool,
};

GridItem.defaultProps = {
  name: '',
  longname: '',
  to: '',
  children: null,
  promote: false,
};

export default GridItem;
