import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { sortBy, filter, intersectionBy } from 'lodash';
import { Chip, Box } from '@material-ui/core';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import Header from 'components/Header';
import RecListItem from 'components/RecListItem';
import styled from 'styled-components';

const widths = { Replay: 200, Time: 100, Level: null, By: null };

const RecList = ({
  currentUUID,
  columns,
  horizontalMargin,
  LevelIndex,
  mergable = false,
}) => {
  const { loading, replays, tagOptions } = useStoreState(
    state => state.RecList,
  );
  const { getTagOptions, getReplays } = useStoreActions(
    actions => actions.RecList,
  );
  const [includedTags, setIncludedTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    setAvailableTags(
      tagOptions.filter(tag => !['DNF', 'TAS'].includes(tag.Name)),
    );
    // Autoexclude DNF and TAS
    setExcludedTags(
      tagOptions.filter(tag => ['DNF', 'TAS'].includes(tag.Name)),
    );
  }, [tagOptions]);

  useEffect(() => {
    getReplays(LevelIndex);
    getTagOptions();
  }, [LevelIndex]);

  const isSelected = uuid => {
    if (!currentUUID) {
      return false;
    }
    return currentUUID.indexOf(uuid) !== -1;
  };

  const handleIncludeTag = tag => {
    setIncludedTags([...includedTags, tag]);
    setAvailableTags(availableTags.filter(t => t.TagIndex !== tag.TagIndex));
  };

  const handleExcludeTag = tag => {
    setExcludedTags([...excludedTags, tag]);
    setIncludedTags(includedTags.filter(t => t.TagIndex !== tag.TagIndex));
  };

  const handleRemoveExcludedTag = tag => {
    setExcludedTags(excludedTags.filter(t => t.TagIndex !== tag.TagIndex));
    setAvailableTags([...availableTags, tag]);
  };

  const filterByTags = i => {
    return (
      (includedTags.length === 0 ||
        intersectionBy(i.Tags, includedTags, 'TagIndex').length >
          includedTags.length - 1) &&
      (excludedTags.length === 0 ||
        intersectionBy(i.Tags, excludedTags, 'TagIndex').length === 0)
    );
  };

  return (
    <>
      <Header h3>Filter</Header>
      <Box display="flex" flexWrap="wrap">
        {includedTags
          .sort((a, b) => a.Name.localeCompare(b.Name))
          .map(tag => (
            <IncludedTagChip
              key={tag.Name}
              size="small"
              label={tag.Name}
              style={{ margin: 4 }}
              onClick={() => handleExcludeTag(tag)}
              title="Click to exclude"
            />
          ))}
        {excludedTags
          .sort((a, b) => a.Name.localeCompare(b.Name))
          .map(tag => (
            <ExcludedTagChip
              key={tag.Name}
              size="small"
              label={tag.Name}
              style={{ margin: 4 }}
              onClick={() => handleRemoveExcludedTag(tag)}
              title="Click to remove exclusion"
            />
          ))}
        {availableTags
          .sort((a, b) => a.Name.localeCompare(b.Name))
          .map(option => {
            return (
              <Chip
                key={option.Name}
                size="small"
                label={option.Name}
                onClick={() => handleIncludeTag(option)}
                style={{ margin: 4 }}
                title="Click to include"
              />
            );
          })}
      </Box>
      <ListContainer
        horizontalMargin={`${horizontalMargin}px`}
        width={`calc(100% - ${horizontalMargin * 2}px)`}
      >
        <ListHeader>
          {columns.map(c => (
            <ListCell ListCell width={widths[c]} key={c} right={c === 'Time'}>
              {c}
            </ListCell>
          ))}
        </ListHeader>
        {loading ? (
          <ListRow>
            <ListCell>Loading...</ListCell>
          </ListRow>
        ) : (
          sortBy(filter(replays, filterByTags), ['ReplayTime']).map(i => (
            <RecListItem
              key={`${i.ReplayIndex}${i.TimeIndex}`}
              replay={i}
              selected={isSelected(i.UUID)}
              columns={columns}
              mergable={mergable}
            />
          ))
        )}
      </ListContainer>
    </>
  );
};

const IncludedTagChip = styled(Chip)`
  background-color: green !important;
  color: white !important;
`;

const ExcludedTagChip = styled(Chip)`
  background-color: red !important;
  color: white !important;
`;

RecList.propTypes = {
  currentUUID: PropTypes.arrayOf(PropTypes.string),
  columns: PropTypes.arrayOf(PropTypes.string),
  horizontalMargin: PropTypes.number,
  LevelIndex: PropTypes.number.isRequired,
};

RecList.defaultProps = {
  currentUUID: null,
  columns: ['Replay', 'Level', 'Time', 'By'],
  horizontalMargin: 0,
};

export default RecList;
