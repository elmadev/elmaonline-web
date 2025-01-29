import React, { useState, useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Dropzone from 'components/Dropzone';
import { Text, Column } from 'components/Containers';
import Header from 'components/Header';
import styled from '@emotion/styled';
import {
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Chip,
} from '@material-ui/core';
import { NewLGR } from 'api';
import Alert from 'components/Alert';
import { xor } from 'lodash';

const LGRUpload = () => {
  const { tagOptions } = useStoreState(state => state.LGRUpload);
  const { getTagOptions } = useStoreActions(actions => actions.LGRUpload);

  const [lgrData, setLgrData] = useState({
    file: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    title: '',
    text: '',
    link: '',
    options: ['Close'],
  });

  useEffect(() => {
    getTagOptions();
  }, []);

  const reset = () => {
    setLgrData({
      file: null,
    });
  };

  const closeAlert = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  const onDropLGR = newFiles => {
    // Dropzone already limits the file size to 10 MB
    if (newFiles.length !== 1) {
      reset();
      return;
    }
    const newFile = newFiles[0];
    const filename = newFile.name.toLowerCase();
    if (!filename.endsWith('.lgr')) {
      setAlert({
        ...alert,
        open: true,
        title: 'Error',
        text: `LGR filename does not end in .lgr!`,
        link: '',
      });
      reset();
      return;
    }
    const lgrName = filename.slice(0, -4);
    if (lgrName.length > 8) {
      setAlert({
        ...alert,
        open: true,
        title: 'Error',
        text: `LGR filename is too long!`,
        link: '',
      });
      reset();
      return;
    }
    setLgrData({
      file: newFile,
      filename: filename.slice(0, -4),
      preview: null,
      description: '',
      tags: [],
    });
  };

  const onDropPreview = newFiles => {
    // Dropzone already limits the file size to 10 MB
    if (newFiles.length !== 1) {
      setLgrData({
        ...lgrData,
        preview: null,
      });
      return;
    }
    setLgrData({
      ...lgrData,
      preview: newFiles[0],
    });
  };

  useEffect(() => {
    if (!lgrData.preview) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(lgrData.preview);
    setPreview(url);

    // prevent memory leak
    return () => URL.revokeObjectURL(url);
  }, [lgrData.preview]);

  const handleDescription = event => {
    const description = event.target.value;
    setLgrData({
      ...lgrData,
      description,
    });
  };

  const handleTag = tag => {
    setLgrData({
      ...lgrData,
      tags: xor(lgrData.tags, [tag]),
    });
  };

  const upload = async () => {
    setIsUploading(true);
    const formData = new FormData();
    // files
    formData.append('lgr', lgrData.file);
    formData.append('preview', lgrData.preview);
    // body
    formData.append('filename', lgrData.filename);
    formData.append('description', lgrData.description);
    formData.append(
      'tags',
      JSON.stringify(lgrData.tags.map(tag => tag.TagIndex)),
    );
    try {
      const res = await NewLGR(formData);
      if (res.data && !res.data.error) {
        setAlert({
          ...alert,
          open: true,
          title: 'LGR Uploaded!',
          text: `Congratulations, your LGR is uploaded. You can see your LGR here:`,
          link: `${window.location.origin}/l/${lgrData.filename}`,
        });
        //reset() TODO add reset (removed for faster deving)
      } else {
        setAlert({
          ...alert,
          open: true,
          title: 'Error',
          text: `There was a problem with uploading your LGR: ${res.data ? res.data.error : 'Unknown error'}`,
          link: '',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Column p="Large">
        <Header h1>LGR upload</Header>
        <Text>Upload a fancyboosted lgr here.</Text>
        <Dropzone filetype={'.lgr'} onDrop={e => onDropLGR(e)} />
      </Column>
      <Alert {...alert} onClose={closeAlert} />
      <UploadButtonContainer container>
        <Grid item xs={12}>
          {lgrData.file && (
            <>
              <UploadCard>
                <CardContent>
                  <Typography color="primary">
                    {lgrData.filename}.lgr
                  </Typography>
                  <TextField
                    fullWidth
                    id="Description"
                    multiline
                    label="Description"
                    value={lgrData.description}
                    onChange={handleDescription}
                    margin="dense"
                  />
                </CardContent>
                <CardContent>
                  <Typography color="primary">Tags</Typography>
                  {tagOptions.map(option => {
                    if (lgrData.tags.includes(option)) {
                      return (
                        <Chip
                          label={option.Name}
                          onDelete={() => handleTag(option)}
                          color="primary"
                          style={{ margin: 4 }}
                        />
                      );
                    } else {
                      return (
                        <Chip
                          label={option.Name}
                          onClick={() => handleTag(option)}
                          style={{ margin: 4 }}
                        />
                      );
                    }
                  })}
                </CardContent>
                <CardContent>
                  <Typography color="primary">
                    Upload a preview image (max 10 MB)
                  </Typography>
                  <Dropzone filetype={'img'} onDrop={e => onDropPreview(e)} />
                </CardContent>
                {preview && <CardPreview src={preview}></CardPreview>}
              </UploadCard>
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
                  reset();
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
    </>
  );
};

const UploadButtonContainer = styled(Grid)`
  margin-top: 8px;
`;
const UploadCard = styled(Card)`
  margin-top: 8px;
  margin-bottom: 8px;
`;
const CardPreview = styled.img`
  background-size: contain;
  height: 160px;
`;

export default LGRUpload;
