import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'components/Link';
import Flag from 'components/Flag';

const Kuski = ({ kuskiData, team, flag, noLink }) => (
  <>
    {kuskiData ? (
      <Container>
        {flag && kuskiData.Country && (
          <span>
            <Flag nationality={kuskiData.Country} />{' '}
          </span>
        )}
        {noLink ? (
          <span>{kuskiData.Kuski && kuskiData.Kuski}</span>
        ) : (
          <Link to={`/kuskis/${kuskiData.Kuski}`}>
            {kuskiData.Kuski && kuskiData.Kuski}
          </Link>
        )}
        {team && kuskiData?.TeamData?.Team && (
          <>
            {' '}
            {noLink ? (
              <span>[{kuskiData.TeamData.Team}]</span>
            ) : (
              <Link to={`/team/${kuskiData.TeamData.Team}`}>
                [{kuskiData.TeamData.Team}]
              </Link>
            )}
          </>
        )}
      </Container>
    ) : (
      <Container>Unknown</Container>
    )}
  </>
);

const Container = styled.span`
  white-space: nowrap;
`;

Kuski.defaultProps = {
  team: false,
  flag: false,
  kuskiData: null,
  noLink: false,
};

Kuski.propTypes = {
  kuskiData: PropTypes.shape({}),
  team: PropTypes.bool,
  flag: PropTypes.bool,
  noLink: PropTypes.bool,
};

export default Kuski;
