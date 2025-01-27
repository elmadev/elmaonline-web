import React, { useState, useEffect } from 'react';
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
} from '@material-ui/core';
import { NewLGR } from 'api';

const LGRUpload = () => {
  const [lgrData, setLgrData] = useState({
    file: null,
  });
  // TODO tags
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const reset = () => {
    setLgrData({
      file: null,
    });
  };

  const onDropLGR = newFiles => {
    if (newFiles.length !== 1) {
      reset();
      return;
    }
    const newFile = newFiles[0];
    const filename = newFile.name.toLowerCase();
    if (!filename.endsWith('.lgr')) {
      reset();
      return;
    }
    setLgrData({
      file: newFile,
      filename: filename.slice(0, -4),
      preview: null,
      description: '',
    });
  };

  const onDropPreview = newFiles => {
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

  const upload = () => {
    setIsUploading(true);
    const formData = new FormData();
    // files
    formData.append('lgr', lgrData.file);
    formData.append('preview', lgrData.preview);
    // body
    formData.append('filename', lgrData.filename);
    formData.append('description', lgrData.description);
    try {
      NewLGR(formData);
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
                  <Typography color="primary">
                    Upload a preview image.
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
