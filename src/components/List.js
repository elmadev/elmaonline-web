import React from 'react';
import styled from 'styled-components';
import Link from 'components/Link';

export const ListCell = ({
  width,
  children,
  right,
  highlight,
  to,
  whiteSpace,
}) => {
  if (to) {
    return (
      <Cell
        whiteSpace={whiteSpace}
        width={width}
        right={right}
        highlight={highlight}
      >
        <Link to={to}>{children}</Link>
      </Cell>
    );
  }
  return (
    <Cell
      whiteSpace={whiteSpace}
      width={width}
      right={right}
      highlight={highlight}
    >
      {children}
    </Cell>
  );
};

const Cell = styled.span`
  display: table-cell;
  padding: ${p => (p.pad ? p.pad : '10px')};
  border-bottom: 1px solid #eaeaea;
  width: ${p => (p.width ? `${p.width}px` : 'auto')};
  text-align: ${p => (p.right ? 'right' : 'left')};
  background: ${p => (p.highlight ? '#dddddd' : 'transparent')};
  position: relative;
  white-space: ${p => (p.whiteSpace ? p.whiteSpace : 'normal')};
  button {
    max-height: 20px;
  }
`;

export const ListContainer = ({ children, chin, horizontalMargin, width }) => {
  return (
    <Container chin={chin} horizontalMargin={horizontalMargin} width={width}>
      {children}
    </Container>
  );
};

const Container = styled.div`
  padding-bottom: ${p => (p.chin ? '200px' : '0px')};
  display: table;
  width: ${p => (p.width ? p.width : '100%')};
  font-size: 14px;
  margin-left: ${p => (p.horizontalMargin ? p.horizontalMargin : '0')};
  margin-right: ${p => (p.horizontalMargin ? p.horizontalMargin : '0')};
`;

export const ListHeader = ({ children }) => {
  return <Header>{children}</Header>;
};

const Header = styled.div`
  display: table-row;
  color: inherit;
  font-size: 14px;
  padding: 10px;
  font-weight: 600;
`;

export const ListRow = ({
  children,
  selected,
  onClick,
  bg = 'transparent',
  title = '',
  highlight = false,
}) => {
  return (
    <Row
      pointer={onClick}
      selected={selected}
      bg={bg}
      onClick={e => onClick && onClick(e)}
      title={title}
      highlight={highlight}
    >
      {children}
    </Row>
  );
};

const Row = styled.div`
  display: table-row;
  background: ${p => (p.selected ? '#f5f5f5' : p.highlight ? '#ddd' : p.bg)};
  cursor: ${p => (p.pointer ? 'pointer' : 'auto')};
  :hover {
    background: #ededed;
  }
`;
