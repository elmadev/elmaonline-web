import React, { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useParams } from '@tanstack/react-router';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import config from 'config';
import styled from '@emotion/styled';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import Kuski from 'components/Kuski';
import Tags from 'components/Tags';
import { Text } from 'components/Containers';
import LGRComments from 'features/LGRComments';
import AddComment from 'components/AddComment';
import { ExpandMore } from '@material-ui/icons';
import { mod, nickId } from 'utils/nick';
import { DeleteLGR } from 'api';
import LGRUpload from 'features/LGRUpload';

const LGR = () => {
  const { lgr } = useStoreState(state => state.LGR);
  const { getLGR } = useStoreActions(actions => actions.LGR);
  const [modDelete, setModDelete] = useState('');

  const { LGRName } = useParams({ strict: false });
  useEffect(() => {
    getLGR(LGRName);
  }, []);

  // mod feature
  const deleteLGR = async () => {
    const res = await DeleteLGR(lgr.LGRName);
    if (res.ok) {
      window.location.href = `${window.location.origin}/lgrs`;
    } else {
      setModDelete('Unexpected error, see console');
      // eslint-disable-next-line no-console
      console.log(res);
    }
  };

  return (
    <Layout edge t="LGRs">
      {!LGRName && <Typography>Please add an LGR name to the url.</Typography>}
      {lgr && (
        <>
          <PreviewContainer>
            <a href={`${config.api}lgr/get/${lgr.LGRName}`}>
              <img
                src={`${config.api}lgr/preview/${lgr.LGRName}`}
                style={{ maxWidth: '100%' }}
              />
            </a>
          </PreviewContainer>
          <RightBarContainer>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>{`${lgr.LGRName}.lgr`}</Header>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: 'column' }}>
                <LGRInfo>
                  <Text>{lgr.LGRDesc}</Text>
                  <Text>
                    <UploadedBy>
                      Uploaded by <Kuski kuskiData={lgr.KuskiData} />{' '}
                      <LocalTime
                        date={lgr.Added}
                        format="yyyy-MM-dd HH:mm:ss"
                        parse="X"
                      />
                    </UploadedBy>
                  </Text>
                  <Text>
                    {lgr.Downloads} download{lgr.Downloads !== 1 ? 's' : ''}
                  </Text>
                  <Tags tags={lgr.Tags.map(tag => tag.Name)} />
                </LGRInfo>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Comments</Header>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: 'column' }}>
                <AddComment type="lgr" index={lgr.LGRIndex} />
                <LGRComments LGRIndex={lgr.LGRIndex} />
              </AccordionDetails>
            </Accordion>
            {mod() === 1 && (
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Header h3>Delete LGR (mod-exclusive)</Header>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: 'column' }}>
                  <Text>
                    Danger! Type "delete" in this box to enable the delete
                    button
                  </Text>
                  {modDelete !== 'delete' ? (
                    <TextField
                      fullWidth
                      id="Delete"
                      multiline
                      label=""
                      value={modDelete}
                      onChange={event => setModDelete(event.target.value)}
                      margin="dense"
                    />
                  ) : (
                    <Button
                      onClick={deleteLGR}
                      variant="contained"
                      color="primary"
                    >
                      DELETE
                    </Button>
                  )}
                </AccordionDetails>
              </Accordion>
            )}
          </RightBarContainer>
          {nickId() === lgr.KuskiIndex && (
            <Accordion style={{ float: 'left', width: '70%' }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>Edit LGR</Header>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: 'column' }}>
                <LGRUpload lgrToEdit={lgr} />
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}
    </Layout>
  );
};

const PreviewContainer = styled.div`
  width: 70%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  text-align: center;
  @media (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const RightBarContainer = styled.div`
  float: right;
  width: 30%;
  padding: 7px;
  box-sizing: border-box;
  @media (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const LGRInfo = styled.div`
  font-size: 14px;
`;

const UploadedBy = styled.div`
  color: #7d7d7d;
`;
export default LGR;
