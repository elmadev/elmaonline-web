import { useNavigate } from '@reach/router';

import {
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const Controls = ({ detailed, sort }) => {
  const navigate = useNavigate();

  return (
    <Grid
      container
      justify="flex-end"
      align="center"
      className="controls"
      style={{ paddingRight: 10 }}
    >
      <SwitchWrapper>
        <FormControlLabel
          control={
            <Switch
              checked={!!detailed}
              onChange={e => {
                navigate(
                  [
                    '/levels',
                    e.target.checked && 'detailed',
                    e.target.checked && sort && `?sort=${sort}`,
                  ]
                    .filter(Boolean)
                    .join('/'),
                );
              }}
              color="primary"
            />
          }
          label="Detailed View"
        />
      </SwitchWrapper>
      {detailed && (
        <FormControl style={{ minWidth: 200, marginBottom: 19 }}>
          <InputLabel id="levelpack-sort">Sort By</InputLabel>
          <Select
            id="levelpack-sort"
            value={sort}
            onChange={e => {
              navigate(
                [
                  '/levels',
                  detailed && 'detailed',
                  e.target.value && `?sort=${e.target.value}`,
                ]
                  .filter(Boolean)
                  .join('/'),
              );
            }}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="attempts"># Attempts</MenuItem>
            <MenuItem value="time">Total Time Spent</MenuItem>
            <MenuItem value="levels"># Levels</MenuItem>
            <MenuItem value="avgKuskiCount">Avg. Kuski Count</MenuItem>
            <MenuItem value="topKuskiPct">Highest Record Holder %</MenuItem>
            <MenuItem value="topKuskiCount">
              Highest Record Holder Count
            </MenuItem>
            <MenuItem value="attemptsPctD">Attempts % (Dead)</MenuItem>
            <MenuItem value="attemptsPctE">Attempts % (Esc)</MenuItem>
            <MenuItem value="attemptsPctF">Attempts % (Finished)</MenuItem>
            <MenuItem value="timePctD">Time % (Dead)</MenuItem>
            <MenuItem value="timePctE">Time % (Esc)</MenuItem>
            <MenuItem value="timePctF">Time % (Finished)</MenuItem>
            <MenuItem value="minTime">Min Record Time</MenuItem>
            <MenuItem value="maxTime">Max Record Time</MenuItem>
            <MenuItem value="avgTime">Avg. Record Time</MenuItem>
          </Select>
        </FormControl>
      )}
    </Grid>
  );
};

const SwitchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
`;

export default Controls;
