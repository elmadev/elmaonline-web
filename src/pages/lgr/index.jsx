import React, { useEffect, useState } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ExpandMore } from '@material-ui/icons';
import Layout from 'components/Layout';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import styled from '@emotion/styled';
import Header from 'components/Header';
import LocalTime from 'components/LocalTime';
import Kuski from 'components/Kuski';
import Tags from 'components/Tags';
import Recplayer from 'components/Recplayer';
import { Text } from 'components/Containers';
import AddComment from 'components/AddComment';
import ReplaySettings from 'features/ReplaySettings';
import LGRComments from 'features/LGRComments';
import LGRUpload from 'features/LGRUpload';
import { mod, nickId } from 'utils/nick';
import { getReplayLink, getLgrPreviewLink, getLgrLink } from 'utils/link';
import { DeleteLGR } from 'api';
import config from 'config';

const LGR = () => {
  const { lgr } = useStoreState(state => state.LGR);
  const { getLGR } = useStoreActions(actions => actions.LGR);
  const [modDelete, setModDelete] = useState('');
  const navigate = useNavigate();

  const {
    settings: { theater },
  } = useStoreState(state => state.ReplaySettings);

  const { LGRName } = useParams({ strict: false });
  useEffect(() => {
    getLGR(LGRName);
  }, []);

  // mod feature
  const deleteLGR = async () => {
    const res = await DeleteLGR(lgr.LGRName);
    if (res.ok) {
      navigate({ to: '/lgrs' });
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
          <PreviewContainer theater={theater}>
            <Recplayer
              rec={getReplayLink(lgr.ReplayData).link}
              lev={`${config.dlUrl}level/${lgr.ReplayData.LevelIndex}`}
              lgr={getLgrLink(lgr)}
              controls
            />
            <ReplaySettings lgrPage={true} />
          </PreviewContainer>
          <RightBarContainer>
            <Accordion defaultExpanded>
              <AccordionDetails style={{ flexDirection: 'column' }}>
                <a href={`${config.api}lgr/get/${lgr.LGRName}`}>
                  <img
                    src={getLgrPreviewLink(lgr)}
                    style={{ maxWidth: '100%' }}
                  />
                </a>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Header h3>{`${lgr.LGRName}.lgr`}</Header>
              </AccordionSummary>
              <AccordionDetails style={{ flexDirection: 'column' }}>
                <LGRInfo>
                  <Text style={{ whiteSpace: 'pre-line' }}>{lgr.LGRDesc}</Text>
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
          {(nickId() === lgr.KuskiIndex || mod() === 1) && (
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
  width: ${p => (p.theater ? '100%' : '70%')};
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
