import React from 'react';
import styled from 'styled-components';
import Link from 'components/Link';

const LinkWithDesc = ({ link, name, desc }) => {
  return (
    <>
      <Link to={link}>
        <CupName>{name}</CupName>
      </Link>
      <Description dangerouslySetInnerHTML={{ __html: desc }} />
    </>
  );
};

const CupName = styled.div`
  font-weight: 500;
  color: ${p => p.theme.linkColor};
`;

const Description = styled.div`
  font-size: 13px;
  padding-bottom: 12px;
`;

export default LinkWithDesc;
