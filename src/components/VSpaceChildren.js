import styled from 'styled-components';

// add vertical spacing between immediate children, with option
// to remove margin bottom from the last child.
const VSpaceChildren = styled.div`
  > * {
    margin-bottom: 24px;
    &:last-child {
      margin-bottom: ${p => (p.last ? '24px' : '0')};
    }
  }
`;

export default VSpaceChildren;
