import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import {
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@material-ui/core';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import Autocomplete from '@material-ui/lab/Autocomplete';
import styled from 'styled-components';
import Pagination from '@material-ui/lab/Pagination';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Tags from 'components/Tags';
import LocalTime from 'components/LocalTime';
import Time from 'components/Time';
import { KuskiAutoComplete } from 'components/AutoComplete';

export default function LevelList({
  defaultPage = 0,
  defaultPageSize = 25,
  defaultAddedBy,
  summary,
  nonsticky = false,
  levelPack = null,
}) {
  const [selectedTags, setSelectedTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [addedBy, setAddedBy] = useState(defaultAddedBy);
  const [selectedLevelpack, setSelectedLevelpack] = useState(levelPack);
  const [finished, setFinished] = useState('all');
  const [finishedBy, setFinishedBy] = useState(null);
  const [battled, setBattled] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(defaultPage);
  const [pageSize] = useState(defaultPageSize);
  const { levels, tagOptions, kuskiOptions } = useStoreState(
    state => state.LevelList,
  );
  const { levelpacksSorted } = useStoreState(state => state.Levels);
  const { getLevelpacks } = useStoreActions(state => state.Levels);
  const { getLevels, getTagOptions, getKuskiOptions } = useStoreActions(
    actions => actions.LevelList,
  );

  useEffect(() => {
    getTagOptions();
    getKuskiOptions();
    getLevelpacks(false);
    setPage(getPage());
  }, []);

  useEffect(() => {
    getLevels(buildSearchQueryParams());
  }, [
    page,
    pageSize,
    selectedTags,
    excludedTags,
    addedBy,
    finished,
    battled,
    finishedBy,
    selectedLevelpack,
  ]);

  const handleSearchBlur = () => {
    getLevels(buildSearchQueryParams());
  };

  const handleSearchKeyPress = event => {
    if (event.key === 'Enter') {
      getLevels(buildSearchQueryParams());
    }
  };

  const updatePage = pageNo => {
    setPage(pageNo);
  };

  const getPage = () => {
    return page;
  };

  const buildSearchQueryParams = () => ({
    page: getPage(),
    pageSize,
    tags: selectedTags.map(tag => tag.TagIndex),
    excludedTags: excludedTags.map(tag => tag.TagIndex),
    order: 'desc',
    addedBy: addedBy?.KuskiIndex || undefined,
    finished,
    battled,
    finishedBy: finishedBy?.KuskiIndex || undefined,
    q: searchQuery,
    levelPack: selectedLevelpack?.LevelPackIndex || undefined,
  });

  const columns = [
    'Added',
    'Level',
    'Name',
    'By',
    'Best time',
    'Battles',
    'Apples',
    'Killers',
  ];
  if (!summary) {
    columns.push('Tags');
  }

  if (!levels) {
    return null;
  }

  const getTags = level => {
    return level.Tags.map(tag => tag.Name);
  };

  return (
    <Container small={summary}>
      {!summary && (
        <>
          <StickyContainer nonsticky={nonsticky}>
            <SearchTerm
              label="Search query"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onBlur={handleSearchBlur}
              onKeyDown={handleSearchKeyPress}
            />

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
                <TextField {...params} label="Included tags" />
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
                <TextField {...params} label="Excluded tags" />
              )}
            />
            <Filter
              value={selectedLevelpack}
              onChange={(_event, newValue) => {
                setSelectedLevelpack(newValue);
                updatePage(0);
              }}
              forcePopupIcon={false}
              multiple={false}
              id="Levelpack"
              size="small"
              options={levelpacksSorted}
              getOptionLabel={option => option.LevelPackName}
              getOptionSelected={(option, value) =>
                option.LevelPackName === value.LevelPackName
              }
              filterSelectedOptions
              renderInput={params => (
                <TextField {...params} label="Levelpack" />
              )}
            />
            <KuskiFilter>
              <KuskiAutoComplete
                list={kuskiOptions}
                value={addedBy}
                onChange={newValue => {
                  setAddedBy(newValue);
                  updatePage(0);
                }}
                multiple={false}
                label="Added by"
                variant="standard"
              />
            </KuskiFilter>
            <FormControl>
              <InputLabel id="battled">Battled</InputLabel>
              <SelectFilter
                labelId="battled"
                value={battled}
                displayEmpty
                onChange={e => setBattled(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value={true}>Battled</MenuItem>
                <MenuItem value={false}>Unbattled</MenuItem>
              </SelectFilter>
            </FormControl>
            <FormControl>
              <InputLabel id="finished">Finished</InputLabel>
              <SelectFilter
                labelId="finished"
                value={finished}
                displayEmpty
                onChange={e => {
                  if (e.target.value === 'all') {
                    setFinishedBy(null);
                  }
                  setFinished(e.target.value);
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value={true}>Finished</MenuItem>
                <MenuItem value={false}>Unfinished</MenuItem>
              </SelectFilter>
            </FormControl>
            <KuskiFilter>
              <KuskiAutoComplete
                disabled={finished === 'all'}
                list={kuskiOptions}
                value={finishedBy}
                onChange={newValue => {
                  setFinishedBy(newValue);
                  updatePage(0);
                }}
                multiple={false}
                label="Finished by"
                variant="standard"
              />
            </KuskiFilter>
          </StickyContainer>
        </>
      )}

      <ListContainer>
        <ListHeader>
          <ListCell>Added</ListCell>
          <ListCell>Name</ListCell>
          <ListCell>Level</ListCell>
          <ListCell>By</ListCell>
          <ListCell>Best time</ListCell>
          <ListCell>Battles</ListCell>
          <ListCell>Apples</ListCell>
          <ListCell>Kiilers</ListCell>

          {!summary && (
            <>
              <ListCell>Tags</ListCell>
            </>
          )}
        </ListHeader>
        {levels.rows.map(level => {
          return (
            <ListRow key={`${level.LevelIndex}`}>
              {columns.indexOf('Added') !== -1 && (
                <ListCell width={170}>
                  <LocalTime
                    date={level.Added}
                    format="ddd D MMM YYYY HH:mm"
                    parse="X"
                  />
                </ListCell>
              )}
              {columns.indexOf('Level') !== -1 && (
                <ListCell width={100}>
                  <Level LevelIndex={level.LevelIndex} LevelData={level} />
                </ListCell>
              )}
              {columns.indexOf('Name') !== -1 && (
                <ListCell width={100}>{level.LongName}</ListCell>
              )}
              {columns.indexOf('By') !== -1 && (
                <ListCell width={100}>
                  {level.KuskiData ? (
                    <Kuski kuskiData={level.KuskiData} />
                  ) : (
                    <div>{level.AddedByText || 'Unknown'}</div>
                  )}
                </ListCell>
              )}
              {columns.indexOf('Best time') !== -1 && (
                <ListCell width={100}>
                  {level.Besttime ? <Time time={level.Besttime} /> : '-'}
                </ListCell>
              )}
              {columns.indexOf('Battles') !== -1 && (
                <ListCell width={100}>{level.BattleCount || '-'}</ListCell>
              )}
              {columns.indexOf('Apples') !== -1 && (
                <ListCell width={100}>{level.Apples}</ListCell>
              )}
              {columns.indexOf('Killers') !== -1 && (
                <ListCell width={100}>{level.Killers}</ListCell>
              )}
              {columns.indexOf('Unlisted') !== -1 && (
                <ListCell>{level.Unlisted === 1 ? 'Yes' : ''}</ListCell>
              )}
              {columns.indexOf('Tags') !== -1 && (
                <ListCell width={300}>
                  <Tags tags={getTags(level)} />
                </ListCell>
              )}
            </ListRow>
          );
        })}
      </ListContainer>

      {!summary && (
        <Box p={2}>
          <Pagination
            count={Math.ceil(levels.count.length / pageSize)}
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

const StickyContainer = styled.div`
  background: ${p => p.theme.pageBackground};
  position: ${p => (p.nonsticky ? 'relative' : 'sticky')};
  display: flex;
  justify-content: space-between;
  top: ${p => (p.nonsticky ? '0' : '52px')};
  padding-left: 1rem;
  align-items: center;
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

const SearchTerm = styled(TextField)`
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

const SelectFilter = styled(Select)`
  background: ${p => p.theme.pageBackground};
  padding: 0.7rem 1rem 0.5rem 1rem;
  flex-grow: 1;
  min-width: 100px;
`;

const KuskiFilter = styled.div`
  flex-grow: 1;

  .MuiInput-underline:before {
    content: none;
  }

  .MuiInput-underline:after {
    content: none;
  }
`;
