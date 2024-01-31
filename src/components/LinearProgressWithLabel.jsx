import React, { useEffect, useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import styled from 'styled-components';
import { Text } from 'components/Containers';
import { addSeconds, format } from 'date-fns';

function formattedTime(seconds) {
  const helperDate = addSeconds(new Date(0), seconds);
  if (seconds >= 3600) {
    return `1:${format(helperDate, 'mm:ss')}`;
  }
  return format(helperDate, 'mm:ss');
}

function perc2color(perc) {
  let r;
  let g;
  const b = 0;
  if (perc < 50) {
    r = 255;
    g = Math.round(5.1 * perc);
  } else {
    g = 255;
    r = Math.round(510 - 5.1 * perc);
  }
  const h = r * 0x10000 + g * 0x100 + b * 0x1;
  return `#${`000000${h.toString(16)}`.slice(-6)}`;
}

const StyledLinearProgress = styled(LinearProgress)`
  &.MuiLinearProgress-colorPrimary {
    background-color: #f1f1f1;

    .MuiLinearProgress-barColorPrimary {
      background-color: ${p => p.linecolor};
    }
  }
`;

export default function LinearProgressWithLabel({ value, remainingSeconds }) {
  const [lineColor, setLineColor] = useState(perc2color(value));

  useEffect(() => {
    setLineColor(perc2color(value));
  }, [value]);

  return (
    <Box width="100%">
      <Box display="flex" alignItems="center" flexDirection="column">
        <Box width="100%" py={1}>
          <StyledLinearProgress
            value={value}
            variant="determinate"
            linecolor={lineColor}
          />
        </Box>
        <Text light>{formattedTime(remainingSeconds)} left</Text>
      </Box>
    </Box>
  );
}
