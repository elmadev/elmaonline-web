import React from 'react';
import styled, { css } from 'styled-components';

// Two columns split roughly 60/40 with padding between.
// Note: if the responsive styles/html do not work properly for you,
// consider calling component conditionally based on window width,
// and use different DOM for mobile.
const SidebarPage = ({
  responsive = true,
  rightSm = false,
  stackWhen = '(max-width: 1000px)',
  ...props
}) => {
  const left = props.children && props.children[0];
  const right = props.children && props.children[1];

  return (
    <Root className="sb-root" {...{ responsive, rightSm, stackWhen, ...props }}>
      <div className="sb-left">{left}</div>
      <div className="sb-right">{right}</div>
    </Root>
  );
};

// double class selector to add priority, in case widths are overriden by
// caller (ie. const SB = styled(SidebarPage)`.sb-left{width:...}`).
// if we don't do this, responsive styles don't take effect.
const responsive = css`
  @media screen and ${p => p.stackWhen} {
    .sb-left.sb-left {
      width: 100%;
      padding-right: 0;
      padding-bottom: 24px;
    }
    .sb-right.sb-right {
      width: 100%;
    }
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  .sb-left {
    width: ${p => (p.rightSm ? '62%' : '58%')};
    padding-right: 24px;
    box-sizing: border-box;
  }
  .sb-right {
    width: ${p => (p.rightSm ? '38%' : '42%')};
  }
  ${p => p.responsive && responsive}
`;

export default SidebarPage;
