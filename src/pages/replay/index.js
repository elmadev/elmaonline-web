import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import styled from 'styled-components';
import { Paper } from 'components/Paper';
import Layout from 'components/Layout';
import Recplayer from 'components/Recplayer';
import { Level } from 'components/Names';
import LocalTime from 'components/LocalTime';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Link from 'components/Link';
import RecList from 'features/RecList';
import ReplayComments from 'features/ReplayComments';
import ReplayRating from 'features/ReplayRating';
import AddComment from 'components/AddComment';
import Tags from 'components/Tags';
import Loading from 'components/Loading';
import { useNavigate } from '@reach/router';
import { useStoreState, useStoreActions } from 'easy-peasy';
import config from 'config';

const Replay = props => {
  const navigate = useNavigate();
  const { ReplayUuid } = props;
  const isWindow = typeof window !== 'undefined';
  let link = '';

  const { getReplayByUUID } = useStoreActions(state => state.ReplayByUUID);
  const { replay, loading } = useStoreState(state => state.ReplayByUUID);

  useEffect(() => {
    if (ReplayUuid) {
      getReplayByUUID(ReplayUuid);
    }
  }, [ReplayUuid]);

  if (!replay)
    return (
      <Layout t={`rec - ${ReplayUuid}`}>
        {loading ? <Loading /> : <div>not found</div>}
      </Layout>
    );

  if (isWindow) {
    if (replay.UUID.substring(0, 5) === 'local') {
      link = `${config.url}temp/${replay.UUID}-${replay.RecFileName}`;
    } else {
      link = `${config.s3Url}replays/${replay.UUID}/${replay.RecFileName}`;
    }
  }

  const getTags = () => {
    return [
      replay.TAS ? 'TAS' : undefined,
      replay.Unlisted ? 'Unlisted' : undefined,
      !replay.Finished ? 'DNF' : undefined,
      replay.Bug ? 'Bug' : undefined,
      replay.Nitro ? 'Mod' : undefined,
    ].filter(Boolean);
  };

  return (
    <Layout t={`rec - ${replay.RecFileName}`}>
      <PlayerContainer>
        <Player>
          {isWindow && (
            <Recplayer
              rec={link}
              lev={`${config.dlUrl}level/${replay.LevelIndex}`}
              controls
            />
          )}
        </Player>
      </PlayerContainer>
      <RightBarContainer>
        <ChatContainer>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">
                <>{replay.RecFileName}</>
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column' }}>
              <ReplayDescription>
                <div>
                  {isWindow ? (
                    <>
                      <a href={link}>
                        <Time thousands time={replay.ReplayTime} />
                      </a>{' '}
                    </>
                  ) : (
                    <Time thousands time={replay.ReplayTime} />
                  )}
                  by{' '}
                  {replay.DrivenByData ? (
                    <Kuski kuskiData={replay.DrivenByData} />
                  ) : (
                    replay.DrivenByText || 'Unknown'
                  )}{' '}
                  in <Level LevelData={replay.LevelData} noLink />
                </div>
                <br />
                <Link to={`/levels/${replay.LevelIndex}`}>
                  Go to level page
                </Link>
              </ReplayDescription>
              <Tags tags={getTags()} />
            </AccordionDetails>
          </Accordion>
          {/* <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMore />}>
              <Typography variant="body1">
                <React.Fragment>
                  <Level LevelData={replay.LevelData} noLink/>.lev
                </React.Fragment>
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ flexDirection: 'column' }}>
              <div>1. Zweq 01:22,49</div>
              <div>2. Zero 01:30,33</div>
              <div>3. talli 01:32,95</div>
              <div>etc.</div>
            </ExpansionPanelDetails>
          </ExpansionPanel> */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="body2">Other replays in level</Typography>
            </AccordionSummary>
            <AccordionDetails style={{ flexDirection: 'column' }}>
              <RecList
                LevelIndex={replay.LevelIndex}
                currentUUID={replay.UUID}
                openReplay={uuid => navigate(`/r/${uuid}`)}
                columns={['Replay', 'Time', 'By']}
                horizontalMargin={-16}
              />
            </AccordionDetails>
          </Accordion>
        </ChatContainer>
      </RightBarContainer>
      <LevelStatsContainer>
        <ReplayDescriptionPaper>
          <div>
            <div>{replay.Comment}</div>
            <BattleTimestamp>
              Uploaded by{' '}
              {replay.UploadedByData ? replay.UploadedByData.Kuski : 'Unknown'}{' '}
              <LocalTime
                date={replay.Uploaded}
                format="YYYY-MM-DD HH:mm:ss"
                parse="X"
              />
            </BattleTimestamp>
          </div>
          <ReplayRating ReplayIndex={replay.ReplayIndex} />
        </ReplayDescriptionPaper>
      </LevelStatsContainer>
      <LevelStatsContainer>
        <BattleDescriptionPaper>
          <AddComment add={() => {}} type="replay" index={replay.ReplayIndex} />
          <ReplayComments ReplayIndex={replay.ReplayIndex} />
        </BattleDescriptionPaper>
      </LevelStatsContainer>
    </Layout>
  );
};

const PlayerContainer = styled.div`
  width: 70%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  @media (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const Player = styled.div`
  background: #f1f1f1;
  height: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (max-width: 1100px) {
    height: 56vw;
    min-height: 450px;
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

const LevelStatsContainer = styled.div`
  width: 70%;
  float: left;
  padding: 7px;
  box-sizing: border-box;
  @media (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const BattleDescriptionPaper = styled(Paper)`
  font-size: 14px;
  padding: 7px;
  width: auto;
`;

const ReplayDescriptionPaper = styled(Paper)`
  font-size: 14px;
  padding: 7px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: auto;
`;

const ReplayDescription = styled.div`
  font-size: 14px;
`;

const BattleTimestamp = styled.div`
  color: #7d7d7d;
`;

const ChatContainer = styled.div`
  clear: both;
`;

Replay.propTypes = {
  ReplayUuid: PropTypes.string,
};

Replay.defaultProps = {
  ReplayUuid: '',
};

export default Replay;
