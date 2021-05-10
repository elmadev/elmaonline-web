import styled from 'styled-components';

const Popularity = ({ before, after, ...props }) => {
  return (
    <Root {...props}>
      {before && <Before className="pop-before">{before}</Before>}
      <BarWrapper className="pop-bar-1">
        <Bar className="pop-bar-2" />
      </BarWrapper>
      {after && <After className="pop-after">{after}</After>}
    </Root>
  );
};

const BarWrapper = styled.div``;

const Bar = styled.div``;

const Before = styled.div``;

const After = styled.div``;

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  ${Before} {
    margin-top: -2px;
    margin-right: 8px;
  }
  ${After} {
    margin-top: -2px;
    margin-left: 8px;
  }
  ${BarWrapper} {
    flex: 1 0 auto;
    height: ${p => p.height || 6}px;
    ${Bar} {
      height: ${p => p.height || 6}px;
      background: ${p => p.theme.linkColor};
      width: ${p => (p.widthPct || 0).toFixed(2)}%;
    }
  }
`;

export default Popularity;
