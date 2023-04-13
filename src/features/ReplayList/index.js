import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { TextField, Box } from '@material-ui/core';
import RecListItem from 'components/RecListItem';
import { ListContainer, ListHeader, ListCell } from 'components/List';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { findIndex } from 'lodash';
import styled from 'styled-components';
import Preview from 'components/Preview';
import ReplayCard from 'components/ReplayCard';
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
  drivenBy = 0,
  uploadedBy = 0,
  summary,
  nonsticky = false,
  levelPack = 0,
  persist = '',
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [previewRec, setPreviewRec] = useState(null);
  const [page, setPage] = useState(defaultPage);
  const [pageSize] = useState(defaultPageSize);
  const { replays, tagOptions, settings, persistPage } = useStoreState(
    state => state.ReplayList,
  );
  const {
    getReplays,
    getTagOptions,
    setSettings,
    setPersistPage,
  } = useStoreActions(actions => actions.ReplayList);
  const { loggedIn, userid } = useStoreState(state => state.Login);

  useEffect(() => {
    getTagOptions();
    setPage(getPage());
  }, []);

  useEffect(() => {
    getReplays({
      page: getPage(),
      pageSize,
      tags: selectedTags.map(tag => tag.TagIndex),
      excludedTags: excludedTags.map(tag => tag.TagIndex),
      sortBy: !summary ? settings.sortBy : 'uploaded',
      order: 'desc',
      drivenBy,
      uploadedBy,
      levelPack,
    });
  }, [page, pageSize, selectedTags, excludedTags, settings.sortBy]);

  const updatePage = pageNo => {
    setPage(pageNo);
    if (persist) {
      setPersistPage({ key: persist, pageNo });
    }
  };

  const getPage = () => {
    if (persist && persistPage?.[persist]) {
      return persistPage[persist];
    }
    return page;
  };

  const columns = ['Uploaded', 'Replay', 'Level', 'Time', 'By'];
  const personal = Boolean(
    loggedIn &&
      ((drivenBy && userid === drivenBy) ||
        (uploadedBy && userid === uploadedBy)),
  );
  if (personal) {
    columns.push('Unlisted');
  }
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
          <StickyContainer nonsticky={nonsticky}>
            <Filter
              value={selectedTags}
              onChange={(_event, newValue) => {
                setSelectedTags(newValue);
                updatePage(0);
              }}
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
            />
            <Filter
              value={excludedTags}
              onChange={(_event, newValue) => {
                setExcludedTags(newValue);
                updatePage(0);
              }}
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
            {personal && <ListCell>Unlisted</ListCell>}
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
            onChange={(event, value) => updatePage(value - 1)}
            page={getPage() + 1}
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
  background: ${p =>
    p.grid ? p.theme.pageBackgroundDark : p.theme.paperBackground};
  min-width: 100%;
  max-height: ${p => (p.small ? '243px' : 'auto')};
  overflow: ${p => (p.small ? 'auto' : 'visible')};
  a {
    color: ${p => p.theme.fontColor};
    :hover {
      color: ${p => p.theme.linkColor};
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
  background: ${p => p.theme.pageBackground};
  position: ${p => (p.nonsticky ? 'relative' : 'sticky')};
  display: flex;
  justify-content: space-between;
  top: ${p => (p.nonsticky ? '0' : '52px')};
  z-index: 10;
`;

const Filter = styled(Autocomplete)`
  background: ${p => p.theme.pageBackground};
  padding: 0.7rem 1rem 0.5rem 1rem;
  flex-grow: 1;

  .MuiInput-underline:before {
    content: none;
  }

  .MuiInput-underline:after {
    content: none;
  }
`;
