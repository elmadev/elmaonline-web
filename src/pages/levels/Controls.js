import { useNavigate } from '@reach/router';
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import React from 'react';
import Popularity from 'components/Popularity';
import styled from 'styled-components';
import Switch from 'components/Switch';

const Controls = ({ detailed, sort }) => {
  const navigate = useNavigate();

  return (
    <Grid2
      container
      justify="flex-end"
      alignItems="center"
      className="controls"
    >
      {!detailed && (
        <div style={{ paddingBottom: 4 }}>
          <div style={{ fontSize: 13, marginBottom: 3, textAlign: 'center' }}>
            Avg. Kuski Count
          </div>
          <Popularity style={{ width: 150 }} widthPct={100} />
        </div>
      )}
      {detailed && (
        <FormControl style={{ minWidth: 200, marginRight: 25 }}>
          <InputLabel id="levelpack-sort">Sort By</InputLabel>
          <Select
            id="levelpack-sort"
            value={sort || 'default'}
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
            <MenuItem value="default">Default</MenuItem>
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
      <SwitchWrapper detailed={detailed}>
        <Switch
          checked={!!detailed}
          onChange={checked => {
            navigate(
              [
                '/levels',
                checked && 'detailed',
                checked && sort && `?sort=${sort}`,
              ]
                .filter(Boolean)
                .join('/'),
            );
          }}
        >
          Detailed View
        </Switch>
      </SwitchWrapper>
    </Grid2>
  );
};

const Grid2 = styled(Grid)`
  padding-bottom: 10px;
  > * {
    margin-right: 25px;
    &:last-child {
      margin-right: 10px;
    }
  }
`;

const SwitchWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: ${p => (p.detailed ? '-22px' : '0')};
`;

export default Controls;
