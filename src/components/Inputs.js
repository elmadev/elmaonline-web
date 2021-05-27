import React from 'react';
import styled from 'styled-components';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField as MuiTextField,
} from '@material-ui/core';

const Container = styled.div`
  min-width: 100px;
  margin-left: 10px;
  margin-right: 10px;
`;

export const Dropdown = ({ name, options, selected, update }) => {
  const id = name.replace(/\s/g, '');
  return (
    <Container>
      <FormControl fullWidth>
        <InputLabel htmlFor={id}>{name}</InputLabel>
        <Select
          value={selected}
          onChange={e => update(e.target.value)}
          inputProps={{
            name: id,
            id,
          }}
        >
          {options.map(y => (
            <MenuItem key={y} value={y}>{`${y}`}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Container>
  );
};

export const TextField = ({
  name,
  error,
  date,
  value,
  onChange,
  multiline = false,
}) => {
  const id = name.replace(/\s/g, '');
  let isError = false;
  if (error) {
    isError = true;
  }
  return (
    <Container>
      <MuiTextField
        id={id}
        label={name}
        margin="normal"
        variant="outlined"
        fullWidth
        error={isError}
        helperText={error}
        type={date ? 'date' : 'text'}
        onChange={e => onChange(e.target.value)}
        value={value}
        multiline={multiline}
      />
    </Container>
  );
};
