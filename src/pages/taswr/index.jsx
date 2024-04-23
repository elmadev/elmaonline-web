import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import { Text, Column } from 'components/Containers';
import styled from 'styled-components';
import { Button, Grid, Tabs, Tab } from '@material-ui/core';
import { useNavigate } from '@reach/router';
import { useLocation } from '@reach/router';

import Layout from 'components/Layout';
import Time from 'components/Time';
import Dropzone from 'components/Dropzone';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';

const TasWrTable = () => {
  const navigate = useNavigate();

  const { uploadTasWr, getTasWrs, setError, setUploaded } = useStoreActions(
    actions => actions.TasWrs,
  );
  const { tableData, uploaded, error } = useStoreState(state => state.TasWrs);
  const location = useLocation();

  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const [tab, setTab] = useState('3');

  useEffect(() => {
    const path = location.pathname.split('/');
    if (path.length > 3) {
      setTab(path[3]);
    }
  }, [location]);

  useEffect(() => {
    let totalTime = 0;
    if (tableData) {
      tableData.map(record => {
        totalTime += record.Time;
      });
      setTotalTime(totalTime);
    }
  }, [tableData]);

  useEffect(() => {
    if (tab) {
      getTasWrs({ tableOption: tab });
      setUploaded(false);
    } else {
      getTasWrs({ tableOption: '1' });
      setUploaded(false);
    }
  }, [tab, uploaded]);

  const onDrop = newFiles => {
    setFiles(newFiles);
  };

  const upload = () => {
    setIsUploading(true);

    files.forEach(file => {
      const data = new FormData();
      data.append('file', file);
      data.append('filename', file.name);
      uploadTasWr(data);
    });

    setIsUploading(false);
  };

  return (
    <Layout edge t={`TAS records`}>
      <Tabs
        variant="scrollable"
        scrollButtons="auto"
        value={tab}
        onChange={(e, value) => {
          setTab(value);
          navigate(['/tas/records', value].join('/'));
        }}
      >
        <Tab label="No FPS change" value="3" />
        <Tab label="FPS change" value="2" />
        <Tab label="No limit" value="1" />
      </Tabs>

      <ListContainer>
        <ListHeader>
          <ListCell width={90}>Filename</ListCell>
          <ListCell width={320}>Level Name</ListCell>
          <ListCell width={150}>Kuski</ListCell>
          <ListCell width={150}>Time</ListCell>
        </ListHeader>
        {tableData && tableData.map((record, index) => (
          <TimeRow key={index}>
            <ListCell><Level LevelIndex={record.LevelData.LevelIndex} LevelData={record.LevelData} /></ListCell>
            <ListCell>{record.LevelData.LongName}</ListCell>
            <ListCell><Kuski kuskiData={record.KuskiData} team flag /></ListCell>
            <ListCell><Time thousands time={record.Time} /></ListCell>
          </TimeRow>
        ))}
        <TTRow>
          <ListCell />
          <ListCell />
          <ListCell>Total Time</ListCell>
          <ListCell>
            <Time thousands time={totalTime} />
          </ListCell>
          <ListCell />
        </TTRow>
      </ListContainer>

      <Column p="Large">
        <Text>Upload a new tas record.</Text>
        <div className="dropzone">
          <Dropzone
            login
            filetype=".dat"
            error={error}
            onDrop={e => onDrop(e)}
          />
        </div>
      </Column>
      <UploadButtonContainer container>
        <Grid item xs={12}>
          {files.length > 0 && (
            <>
              <Button
                onClick={() => {
                  upload();
                }}
                disabled={isUploading}
                style={{ float: 'right' }}
                variant="contained"
                color="primary"
              >
                Upload
              </Button>
              <Button
                onClick={() => {
                  setFiles([]);
                  setError('');
                }}
                style={{ float: 'right', marginRight: '8px' }}
                variant="contained"
              >
                Cancel
              </Button>
            </>
          )}
        </Grid>
      </UploadButtonContainer>
    </Layout>
  );
};

const UploadButtonContainer = styled(Grid)`
  margin-top: 8px;
`;

const TimeRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  cursor: pointer;
  a {
    color: ${p => (p.selected ? 'white' : p.theme.linkColor)};
  }
  span {
    color: ${p => (p.selected ? 'white' : 'inherit')};
  }
  :hover {
    background: ${p => (p.selected ? p.theme.primary : p.theme.hoverColor)};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
  > span:hover {
    .pop-bar-1 {
      background: ${p => p.theme.paperBackground};
    }
  }
`;


const TTRow = styled(ListRow)`
  background: ${p => (p.selected ? p.theme.primary : 'transparent')};
  color: ${p => (p.selected ? '#fff' : 'inherit')};
  :hover {
    background: ${p => (p.selected ? p.theme.primary : p.theme.hoverColor)};
    color: ${p => (p.selected ? '#fff' : 'inherit')};
  }
`;

export default TasWrTable;
