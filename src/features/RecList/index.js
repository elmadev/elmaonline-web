import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { sortBy, filter } from 'lodash';
import { Chip, Box } from '@material-ui/core';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import Header from 'components/Header';
import RecListItem from 'components/RecListItem';
import { useNavigate } from '@reach/router';
import { xor, intersectionBy } from 'lodash';

const widths = { Replay: 200, Time: 100, Level: null, By: null };

const RecList = ({ currentUUID, columns, horizontalMargin, LevelIndex }) => {
  const navigate = useNavigate();

  const { loading, replays, tagOptions } = useStoreState(
    state => state.RecList,
  );
  const { getTagOptions, getReplays } = useStoreActions(
    actions => actions.RecList,
  );
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    getReplays(LevelIndex);
    getTagOptions();
  }, [LevelIndex]);

  const isSelected = uuid => {
    return currentUUID === uuid;
  };

  const handleOpenReplay = uuid => {
    navigate(`/r/${uuid}`);
  };

  const handleTagClick = tag => {
    setSelectedTags(xor(selectedTags, [tag]));
  };

  const filterByTags = i => {
    return (
      selectedTags.length === 0 ||
      intersectionBy(i.Tags, selectedTags, 'TagIndex').length >
        selectedTags.length - 1
    );
  };

  return (
    <>
      <Header h3>Filter</Header>
      <Box display="flex" flexWrap="wrap">
        {tagOptions.map(option => {
          if (selectedTags.includes(option)) {
            return (
              <Chip
                size="small"
                label={option.Name}
                onDelete={() => handleTagClick(option)}
                color="primary"
                style={{ margin: 4 }}
              />
            );
          } else {
            return (
              <Chip
                size="small"
                label={option.Name}
                onClick={() => handleTagClick(option)}
                style={{ margin: 4 }}
              />
            );
          }
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
              key={i.ReplayIndex}
              replay={i}
              openReplay={uuid => handleOpenReplay(uuid)}
              selected={isSelected(i.UUID)}
              columns={columns}
            />
          ))
        )}
      </ListContainer>
    </>
  );
};

RecList.propTypes = {
  currentUUID: PropTypes.string,
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
