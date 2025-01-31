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
import { NewLGR, EditLGR } from 'api';
import Alert from 'components/Alert';
import { xor } from 'lodash';
import { mod } from 'utils/nick';

// Used for new uploads if lgrToEdit is undefined, as well as editing an existing lgr if it is not
const LGRUpload = ({ lgrToEdit }) => {
  const { tagOptions } = useStoreState(state => state.LGRUpload);
  const { getTagOptions } = useStoreActions(actions => actions.LGRUpload);

  const defaultLgrData = lgrToEdit
    ? {
        file: null,
        filename: lgrToEdit.LGRName,
        preview: null,
        description: lgrToEdit.LGRDesc,
        tags: lgrToEdit.Tags.map(tag => tag.TagIndex),
      }
    : {
        file: null,
        filename: null,
        preview: null,
        description: '',
        tags: [],
      };

  const [lgrData, setLgrData] = useState(defaultLgrData);
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
    getTagOptions(mod());
    reset();
  }, [lgrToEdit]);

  // Only for mods, and only on editing existing lgrs
  const modPrivileges = lgrToEdit && mod() === 1;

  // Hide hidden tags, unless a mod is editing an existing lgr
  const tagFilter = modPrivileges ? () => true : tag => !tag.Hidden;

  const reset = () => {
    setLgrData(defaultLgrData);
  };

  const closeAlert = () => {
    setAlert({
      ...alert,
      open: false,
    });
  };

  const onDropLGR = newFiles => {
    if (lgrToEdit) {
      return;
    }
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

  const handleFilename = event => {
    const filename = event.target.value;
    setLgrData({
      ...lgrData,
      filename,
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
    formData.append('tags', JSON.stringify(lgrData.tags));
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
        reset();
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
  const edit = async () => {
    if (lgrData.filename.length > 8) {
      setAlert({
        ...alert,
        open: true,
        title: 'Error',
        text: `LGR filename is too long!`,
        link: '',
      });
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    // files
    if (lgrData.preview) {
      formData.append('preview', lgrData.preview);
    }
    // body
    formData.append('filename', lgrData.filename);
    formData.append('description', lgrData.description);
    formData.append('tags', JSON.stringify(lgrData.tags));
    try {
      const res = await EditLGR(lgrToEdit.LGRName, formData);
      if (res.data && !res.data.error) {
        window.location.href = `${window.location.origin}/l/${lgrData.filename}`;
      } else {
        setAlert({
          ...alert,
          open: true,
          title: 'Error',
          text: `There was a problem editing your LGR: ${res.data ? res.data.error : 'Unknown error'}`,
          link: '',
        });
      }
    } finally {
      setIsUploading(false);
    }
  };
  const uploadOrEdit = lgrToEdit ? edit : upload;

  return (
    <>
      {!lgrToEdit && (
        <Column p="Large">
          <Header h1>LGR upload</Header>
          <Text>Upload a fancyboosted lgr here.</Text>
          <Dropzone filetype={'.lgr'} onDrop={e => onDropLGR(e)} />
        </Column>
      )}
      <Alert {...alert} onClose={closeAlert} />
      <UploadButtonContainer container>
        <Grid item xs={12}>
          {(lgrData.file || lgrToEdit) && (
            <>
              <UploadCard>
                <CardContent>
                  {!modPrivileges ? (
                    <Typography color="primary">
                      {lgrData.filename}.lgr
                    </Typography>
                  ) : (
                    <TextField
                      fullWidth
                      id="Filename"
                      multiline
                      label="Change Filename (use with caution - mod-exclusive feature)"
                      value={lgrData.filename}
                      onChange={handleFilename}
                      margin="dense"
                    />
                  )}
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
                  {tagOptions.filter(tagFilter).map(tag => {
                    if (lgrData.tags.includes(tag.TagIndex)) {
                      return (
                        <Chip
                          label={tag.Name}
                          key={tag.TagIndex}
                          onDelete={() => handleTag(tag.TagIndex)}
                          color="primary"
                          style={{ margin: 4 }}
                        />
                      );
                    } else {
                      return (
                        <Chip
                          label={tag.Name}
                          key={tag.TagIndex}
                          onClick={() => handleTag(tag.TagIndex)}
                          style={{ margin: 4 }}
                        />
                      );
                    }
                  })}
                </CardContent>
                <CardContent>
                  <Typography color="primary">
                    Upload a preview image{' '}
                    {lgrToEdit && 'if you want to replace the old one'} (max 10
                    MB)
                  </Typography>
                  <Dropzone filetype={'img'} onDrop={e => onDropPreview(e)} />
                </CardContent>
                {preview && <CardPreview src={preview}></CardPreview>}
              </UploadCard>
              <Button
                onClick={uploadOrEdit}
                disabled={isUploading}
                style={{ float: 'right' }}
                variant="contained"
                color="primary"
              >
                {lgrToEdit ? 'Edit' : 'Upload'}
              </Button>
              <Button
                onClick={reset}
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
