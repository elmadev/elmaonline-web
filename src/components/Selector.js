import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Icon,
} from '@material-ui/core';
import { stripSpace } from 'utils/misc';

const Selector = ({ label, options, selected, onChange }) => {
  const theme = useContext(ThemeContext);

  const update = s => {
    let newSelected = s;
    const currentIndex = options.findIndex(o => o.id === selected);
    if (s === -1) {
      if (currentIndex - 1 >= 0) {
        newSelected = options[currentIndex - 1].id;
      } else {
        newSelected = selected;
      }
    }
    if (s === 1) {
      if (currentIndex + 1 < options.length) {
        newSelected = options[currentIndex + 1].id;
      } else {
        newSelected = selected;
      }
    }
    onChange(newSelected);
  };

  return (
    <>
      <Icon
        onClick={() => update(-1)}
        style={{
          fontSize: 36,
          cursor: 'pointer',
          color: theme.lightTextColor,
        }}
      >
        chevron_left
      </Icon>
      <FormControl>
        <InputLabel htmlFor="type-simple">{label}</InputLabel>
        <Select
          value={selected}
          onChange={e => update(e.target.value)}
          inputProps={{
            name: stripSpace(label),
            id: 'type-simple',
          }}
          style={{ minWidth: '130px' }}
        >
          {options.map(y => (
            <MenuItem key={y.id} value={y.id}>
              {y.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Icon
        onClick={() => update(1)}
        style={{
          fontSize: 36,
          cursor: 'pointer',
          color: theme.lightTextColor,
        }}
      >
        chevron_right
      </Icon>
    </>
  );
};

export default Selector;
