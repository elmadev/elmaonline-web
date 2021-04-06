import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { TextField, Box } from '@material-ui/core';
import RecListItem from 'components/RecListItem';
import { ListContainer, ListHeader, ListCell } from 'components/List';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { findIndex } from 'lodash';
import styled from 'styled-components';
import Preview from './Preview';
import ReplayCard from './ReplayCard';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ListIcon from '@material-ui/icons/List';
import AppsIcon from '@material-ui/icons/Apps';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Pagination from '@material-ui/lab/Pagination';

export default function ReplayList({
  defaultPage = 0,
  defaultPageSize = 25,
  summary,
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [previewRec, setPreviewRec] = useState(null);
  const [page, setPage] = useState(defaultPage);
  const [pageSize] = useState(defaultPageSize);
  const { replays, tagOptions, settings } = useStoreState(
    state => state.ReplayList,
  );
  const { getReplays, getTagOptions, setSettings } = useStoreActions(
    actions => actions.ReplayList,
  );

  useEffect(() => {
    getTagOptions();
  }, []);

  useEffect(() => {
    getReplays({
      page,
      pageSize,
      tags: selectedTags.map(tag => tag.TagIndex),
      sortBy: !summary ? settings.sortBy : 'uploaded',
      order: 'desc',
    });
  }, [page, pageSize, selectedTags, settings.sortBy]);

  useEffect(() => {
    setPage(0);
  }, [selectedTags]);

  const columns = ['Uploaded', 'Replay', 'Level', 'Time', 'By'];
  if (!summary) {
    columns.push('Rating');
    columns.push('Tags');
  }

  const handleReplayClick = replay => {
    setPreviewRec(replay);
  };

  const nextReplay = () => {
    if (!previewRec) {
      return null;
    }
    const currentIndex = findIndex(replays.rows, {
      ReplayIndex: previewRec.ReplayIndex,
    });

    const nextIndex =
      currentIndex + 1 >= replays.rows.length ? currentIndex : currentIndex + 1;

    const nextReplay = replays.rows[nextIndex];
    setPreviewRec(nextReplay);
  };

  const previousReplay = () => {
    if (!previewRec) {
      return null;
    }
    const currentIndex = findIndex(replays.rows, {
      ReplayIndex: previewRec.ReplayIndex,
    });

    const previousIndex =
      currentIndex - 1 < 0 ? currentIndex : currentIndex - 1;

    const previousReplay = replays.rows[previousIndex];
    setPreviewRec(previousReplay);
  };

  if (!replays) {
    return null;
  }

  const showGrid = () => {
    if (summary) {
      return false;
    }
    return settings.grid;
  };

  return (
    <Container small={summary} grid={showGrid()}>
      {!summary && (
        <>
          <StickyContainer>
            <Filter
              value={selectedTags}
              onChange={(_event, newValue) => {
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
            <ToggleButton
              value="check"
              size="small"
              selected={settings.sortBy === 'rating'}
              style={{ alignSelf: 'center', marginRight: '8px' }}
              onChange={() => {
                setSettings({
                  sortBy: settings.sortBy === 'rating' ? 'uploaded' : 'rating',
                });
              }}
            >
              {settings.sortBy === 'rating' ? (
                <StarIcon fontSize="small" />
              ) : (
                <StarBorderIcon fontSize="small" />
              )}
            </ToggleButton>
            <ToggleButtonGroup
              value={settings.grid}
              size="small"
              exclusive
              style={{ alignSelf: 'center', marginRight: '12px' }}
              onChange={(ev, value) => setSettings({ grid: value })}
            >
              <ToggleButton value={false}>
                <ListIcon fontSize="small" />
              </ToggleButton>
              <ToggleButton value={true}>
                <AppsIcon fontSize="small" />
              </ToggleButton>
            </ToggleButtonGroup>
          </StickyContainer>
          {previewRec && (
            <Preview
              previewRec={previewRec}
              setPreviewRec={setPreviewRec}
              nextReplay={nextReplay}
              previousReplay={previousReplay}
            />
          )}
        </>
      )}
      {!showGrid() && (
        <ListContainer>
          <ListHeader>
            <ListCell>Uploaded</ListCell>
            <ListCell>Replay</ListCell>
            <ListCell>Level</ListCell>
            <ListCell right>Time</ListCell>
            <ListCell>By</ListCell>
            {!summary && (
              <>
                <ListCell>Rating</ListCell>
                <ListCell>Tags</ListCell>
              </>
            )}
          </ListHeader>
          {replays.rows.map(replay => {
            return (
              <RecListItem
                key={replay.ReplayIndex}
                replay={replay}
                columns={columns}
              />
            );
          })}
        </ListContainer>
      )}
      {showGrid() && (
        <CardGrid>
          {replays.rows.map(replay => {
            return (
              <ReplayCard
                key={replay.ReplayIndex}
                replay={replay}
                onPreviewClick={() => handleReplayClick(replay)}
              />
            );
          })}
        </CardGrid>
      )}
      {!summary && (
        <Box p={2}>
          <Pagination
            count={Math.ceil(replays.count.length / pageSize)}
            onChange={(event, value) => setPage(value - 1)}
            page={page + 1}
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: block;
  background: ${p => (p.grid ? '#c4c4c4' : 'inherit')};
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

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  padding: 12px;
`;

const StickyContainer = styled.div`
  background: #f1f1f1;
  position: sticky;
  display: flex;
  justify-content: space-between;
  top: 52px;
  z-index: 10;
`;

const Filter = styled(Autocomplete)`
  background: #f1f1f1;
  padding: 0.7rem 1rem 0.5rem 1rem;
  flex-grow: 1;

  .MuiInput-underline:before {
    content: none;
  }

  .MuiInput-underline:after {
    content: none;
  }
`;
