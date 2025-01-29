import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import LGRListItem from 'components/LGRListItem';
import LGRListCard from 'components/LGRListCard';
import styled from '@emotion/styled';
import Loading from 'components/Loading';
import ListIcon from '@material-ui/icons/List';
import AppsIcon from '@material-ui/icons/Apps';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import SortByAlphaOutlinedIcon from '@material-ui/icons/SortByAlphaOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import GetAppOutlinedIcon from '@material-ui/icons/GetAppOutlined';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { ListContainer, ListHeader, ListCell } from 'components/List';

const LGRList = () => {
  const { lgrs, settings } = useStoreState(state => state.LGRList);
  const { getLGRs, setSettings } = useStoreActions(actions => actions.LGRList);

  useEffect(() => {
    getLGRs();
  }, []);

  const sortBy = settings.sortBy ? settings.sortBy : 'LGRName';
  const sorts = {
    LGRName: (a, b) =>
      a.LGRName > b.LGRName ? 1 : a.LGRName < b.LGRName ? -1 : 0,
    Downloads: (a, b) => b.Downloads - a.Downloads,
  };
  const sortedLgrs = lgrs.toSorted(sorts[sortBy]);

  return (
    <>
      <StickyContainer>
        <ToggleButtonGroup
          value={settings.sortBy}
          size="small"
          exclusive
          style={{ alignSelf: 'center', marginRight: '12px' }}
          onChange={(ev, value) => setSettings({ sortBy: value })}
        >
          <ToggleButton value="LGRName">
            {settings.sortBy === 'LGRName' ? (
              <SortByAlphaIcon fontSize="small" />
            ) : (
              <SortByAlphaOutlinedIcon fontSize="small" />
            )}
          </ToggleButton>
          <ToggleButton value="Downloads">
            {settings.sortBy === 'Downloads' ? (
              <GetAppIcon fontSize="small" />
            ) : (
              <GetAppOutlinedIcon fontSize="small" />
            )}
          </ToggleButton>
        </ToggleButtonGroup>
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
      {!lgrs ? (
        <Loading />
      ) : (
        <>
          {!settings.grid && (
            <ListContainerWhite>
              <ListHeader>
                <ListCell>Uploaded</ListCell>
                <ListCell>Name</ListCell>
                <ListCell>Uploader</ListCell>
                <ListCell>Description</ListCell>
                <ListCell right>Downloads</ListCell>
                <ListCell>Tags</ListCell>
              </ListHeader>
              {sortedLgrs.map(lgr => {
                return <LGRListItem lgr={lgr} key={lgr.LGRIndex} />;
              })}
            </ListContainerWhite>
          )}
          {settings.grid && (
            <CardGrid>
              {sortedLgrs.map(lgr => {
                return <LGRListCard lgr={lgr} key={lgr.LGRIndex} />;
              })}
            </CardGrid>
          )}
        </>
      )}
    </>
  );
};

const ListContainerWhite = styled(ListContainer)`
  background: ${p => p.theme.paperBackground};
`;

const StickyContainer = styled.div`
  background: ${p => p.theme.pageBackground};
  position: ${p => (p.nonsticky ? 'relative' : 'sticky')};
  display: flex;
  justify-content: space-between;
  top: ${p => (p.nonsticky ? '0' : '52px')};
  z-index: 10;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  padding: 12px;
`;

export default LGRList;
