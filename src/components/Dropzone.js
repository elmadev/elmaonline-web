import React from 'react';
import ReactDropzone from 'react-dropzone';
import styled from 'styled-components';
import config from 'config';
import { nickId } from 'utils/nick';
import { theme } from 'theme';

const Dropzone = ({
  error,
  success,
  filetype,
  onDrop,
  login,
  warning,
  minHeight = '100px',
}) => {
  return (
    <ReactDropzone
      accept={filetype}
      onDrop={(a, r) => onDrop(a, r)}
      multiple={false}
      maxSize={config.maxUploadSize}
      style={{
        width: '100%',
        height: 'auto',
        minHeight,
        border: `2px dashed ${theme.borderColor}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.paperBackground,
        color: theme.fontColor,
      }}
    >
      {(!login || nickId() !== 0) && (
        <DropText>Drop file here, or click to select file to upload</DropText>
      )}
      {error && <ErrorText>{error}</ErrorText>}
      {success && <SuccessText>{success}</SuccessText>}
      {warning && <WarningText>{warning}</WarningText>}
      {login && nickId() === 0 && <DropText>Please log in to upload</DropText>}
    </ReactDropzone>
  );
};

const DropText = styled.div`
  padding: 8px;
  opacity: 0.7;
`;

const ErrorText = styled.div`
  padding: 8px;
  color: red;
  opacity: 0.7;
`;

const WarningText = styled.div`
  padding: 8px;
  color: #ff8000;
  opacity: 0.7;
`;

const SuccessText = styled.div`
  padding: 8px;
  color: green;
  opacity: 0.7;
`;

export default Dropzone;
