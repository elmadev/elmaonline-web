import React from 'react';
import styled from 'styled-components';
import Link from 'components/Link';

export const ListContainer = ({
  className,
  children,
  chin,
  horizontalMargin,
  width,
  flex,
}) => {
  return (
    <Container
      className={className}
      chin={chin}
      horizontalMargin={horizontalMargin}
      width={width}
      flex={flex}
    >
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
  ${p =>
    p.flex &&
    `display: flex;
    flex-direction: column;
    ${Row} {
      display: flex;
      flex-direction: row;
    }
    ${Header} {
      display: flex;
      flex-direction: row;
    }
    ${Cell} {
      display: flex;
    }
  `};
`;

export const ListRow = ({
  className,
  children,
  selected,
  onClick,
  bg = 'transparent',
  title = '',
  highlight = false,
  verticalAlign = 'baseline',
}) => {
  return (
    <Row
      className={className}
      pointer={onClick}
      selected={selected}
      bg={bg}
      onClick={e => onClick && onClick(e)}
      title={title}
      highlight={highlight}
      verticalAlign={verticalAlign}
    >
      {children}
    </Row>
  );
};

const Row = styled.div`
  display: table-row;
  vertical-align: ${p => p.verticalAlign};
  background: ${p =>
    p.selected
      ? p.theme.selectedColor
      : p.highlight
      ? p.theme.highlightColor
      : p.bg};
  cursor: ${p => (p.pointer ? 'pointer' : 'auto')};
  :hover {
    background: ${p => p.theme.hoverColor};
  }
`;

export const ListHeader = ({ className, children }) => {
  return <Header className={className}>{children}</Header>;
};

const Header = styled.div`
  display: table-row;
  color: inherit;
  font-size: 14px;
  padding: 10px;
  font-weight: 600;
`;

export const ListCell = ({
  className,
  width,
  children,
  right,
  highlight,
  to,
  whiteSpace,
  onClick,
  verticalAlign = 'baseline',
  textAlign = 'left',
}) => {
  if (to) {
    return (
      <Cell
        className={className}
        whiteSpace={whiteSpace}
        width={width}
        right={right}
        highlight={highlight}
        to={to}
        verticalAlign={verticalAlign}
        textAlign={textAlign}
      >
        <CellLink to={to}>{children}</CellLink>
      </Cell>
    );
  }
  return (
    <Cell
      className={className}
      whiteSpace={whiteSpace}
      width={width}
      right={right}
      highlight={highlight}
      onClick={() => onClick && onClick()}
      verticalAlign={verticalAlign}
      textAlign={textAlign}
    >
      {children}
    </Cell>
  );
};

const CellLink = styled(Link)`
  padding: 10px;
  display: block;
  color: ${p => p.theme.fontColor};
`;

const Cell = styled.span`
  color: ${p => p.theme.fontColor};
  display: table-cell;
  padding: ${p => (p.to ? 0 : '10px')};
  border-bottom: 1px solid #eaeaea;
  width: ${p => (p.width ? `${p.width}px` : 'auto')};
  text-align: ${p => (p.right ? 'right' : 'left')};
  background: ${p => (p.highlight ? p.theme.highlightColor : 'transparent')};
  position: relative;
  white-space: ${p => (p.whiteSpace ? p.whiteSpace : 'normal')};
  flex: ${p => (p.width ? 'none' : '1')};
  justify-content: ${p => (p.right ? 'flex-end' : 'flex-start')};
  vertical-align: ${p => p.verticalAlign};
  text-align: ${p => p.textAlign};
  ${p => p.onClick && 'cursor: pointer;'}
  button {
    max-height: 20px;
  }
`;
