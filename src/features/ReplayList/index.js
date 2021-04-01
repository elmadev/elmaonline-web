import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { TextField } from '@material-ui/core';
import RecListItem from 'components/RecListItem';
import { ListContainer, ListHeader, ListCell } from 'components/List';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { intersectionBy } from 'lodash';
import styled from 'styled-components';
import Preview from './Preview';

export default function Replays({
  defaultPage = 0,
  defaultPageSize = 25,
  showTags,
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewRec, setPreviewRec] = useState(null);
  const { replays, tagOptions } = useStoreState(state => state.ReplayList);
  const { getReplays, getTagOptions } = useStoreActions(
    actions => actions.ReplayList,
  );

  useEffect(() => {
    getTagOptions();
  }, []);

  useEffect(() => {
    getReplays({ page: defaultPage, pageSize: defaultPageSize });
  }, [defaultPage, defaultPageSize]);

  const columns = ['Uploaded', 'Replay', 'Level', 'Time', 'By'];
  if (showTags) {
    columns.push('Tags');
  }

  const filterByTags = i => {
    return (
      selectedTags.length === 0 ||
      intersectionBy(i.Tags, selectedTags, 'TagIndex').length >
        selectedTags.length - 1
    );
  };

  const filterByLev = i => {
    return i.LevelIndex === previewRec.LevelIndex;
  };

  const handleReplayClick = replay => {
    setPreviewRec(replay);
    window.scroll(0, 52);
  };

  const getFilteredRecs = () => {
    return replays.rows.filter(filterByTags);
  };

  const getRelatedRecs = () => {
    return replays.rows.filter(filterByTags).filter(filterByLev);
  };

  if (!replays) {
    return null;
  }

  return (
    <Container small={!showTags}>
      {showTags && (
        <>
          <StickyContainer>
            <Filter
              value={selectedTags}
              onChange={(event, newValue) => {
                setSelectedTags(newValue);
              }}
              forcePopupIcon={false}
              multiple
              id="Tags"
              size="small"
              options={tagOptions}
              getOptionLabel={option => option.Name}
              getOptionSelected={(option, value) => option.Name === value.Name}
              filterSelectedOptions
              renderInput={params => (
                <TextField {...params} placeholder="Filter" />
              )}
            />
          </StickyContainer>
          {previewRec && (
            <Preview
              previewRec={previewRec}
              setPreviewRec={setPreviewRec}
              getRelatedRecs={getRelatedRecs}
              handleReplayClick={handleReplayClick}
            />
          )}
        </>
      )}
      <ListContainer>
        <ListHeader>
          <ListCell>Uploaded</ListCell>
          <ListCell>Replay</ListCell>
          <ListCell>Level</ListCell>
          <ListCell right>Time</ListCell>
          <ListCell>By</ListCell>
          {showTags && <ListCell>Tags</ListCell>}
        </ListHeader>
        {getFilteredRecs().map(replay => {
          return (
            <RecListItem
              key={replay.ReplayIndex}
              replay={replay}
              columns={columns}
              previewReplay={showTags ? handleReplayClick : null}
            />
          );
        })}
      </ListContainer>
    </Container>
  );
}

const Container = styled.div`
  display: block;
  min-width: 100%;
  max-height: ${p => (p.small ? '300px' : 'auto')};
  overflow: ${p => (p.small ? 'auto' : 'visible')};
  a {
    color: black;
    :hover {
      color: #219653;
    }
  }
`;

const StickyContainer = styled.div`
  background: #f1f1f1;
  position: sticky;
  top: 52px;
  z-index: 10;
`;

const Filter = styled(Autocomplete)`
  background: #f1f1f1;
  padding: 0.7rem 1rem 0.5rem 1rem;

  .MuiInput-underline:before {
    content: none;
  }

  .MuiInput-underline:after {
    content: none;
  }
`;
