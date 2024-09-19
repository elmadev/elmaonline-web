import React from 'react';
import styled from 'styled-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';

const TagFilter = ({
  tagOptions,
  selectedTags,
  onSelectedTagsChange,
  excludedTags,
  onExcludedTagsChange,
}) => (
  <>
    <Filter
      value={selectedTags}
      onChange={onSelectedTagsChange}
      forcePopupIcon={false}
      multiple
      id="Tags"
      size="small"
      options={tagOptions.filter(tag => !excludedTags.includes(tag))}
      getOptionLabel={option => option.Name}
      getOptionSelected={(option, value) => option.Name === value.Name}
      filterSelectedOptions
      renderInput={params => (
        <TextField {...params} placeholder="Included tags" />
      )}
      ChipProps={{ color: 'primary' }}
    />
    <Filter
      value={excludedTags}
      onChange={onExcludedTagsChange}
      forcePopupIcon={false}
      multiple
      id="Excluded tags"
      size="small"
      options={tagOptions.filter(tag => !selectedTags.includes(tag))}
      getOptionLabel={option => option.Name}
      getOptionSelected={(option, value) => option.Name === value.Name}
      filterSelectedOptions
      renderInput={params => (
        <TextField {...params} placeholder="Excluded tags" />
      )}
      ChipProps={{ color: 'secondary' }}
    />
  </>
);

const Filter = styled(Autocomplete)`
  background: ${p => p.theme.pageBackground};
  padding: 0.7rem 1rem 0.5rem 1rem;
  flex: 1 0 0;
  margin-right: 0.5rem;

  .MuiInput-underline:before {
    content: none;
  }

  .MuiInput-underline:after {
    content: none;
  }

  .MuiChip-colorSecondary {
    background-color: red;
  }
`;

export default TagFilter;