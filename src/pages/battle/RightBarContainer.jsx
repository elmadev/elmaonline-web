import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { BattleType } from 'components/Names';
import Link from 'components/Link';
import Download from 'components/Download';
import Header from 'components/Header';
import ChatView from 'features/ChatView';
import LocalTime from 'components/LocalTime';
import LeaderHistory from 'components/LeaderHistory';
import { battleStatus } from 'utils/battle';
import { pluralize } from 'utils/misc';
import { useNavigate } from '@reach/router';
import { useStoreActions, useStoreState } from 'easy-peasy';

const crippleOptions = battle => {
  let crippleString = '';
  if (battle.AllowStarter) crippleString += 'Allow Starter, ';
  if (battle.AlwaysThrottle) crippleString += 'Always Throttle, ';
  if (battle.AcceptBugs) crippleString += 'Bugs Allowed, ';
  if (battle.NoVolt) crippleString += 'No Volt, ';
  if (battle.OneTurn) crippleString += 'One Turn, ';
  if (battle.NoTurn) crippleString += 'No Turn, ';
  if (battle.NoBrake) crippleString += 'No Brake, ';
  if (battle.NoThrottle) crippleString += 'No Throttle, ';
  if (battle.Drunk) crippleString += 'Drunk, ';
  if (battle.OneWheel) crippleString += 'One Wheel, ';
  if (battle.Multi) crippleString += 'Multi, ';
  if (battle.Countdown)
    crippleString += `${battle.Countdown} second countdown, `;
  return crippleString.substring(0, crippleString.length - 2);
};

const RightBarContainer = props => {
  const { allBattleTimes, battle, aborted, openReplay } = props;
  const navigate = useNavigate();

  const { getNextBattleFound } = useStoreActions(actions => actions.Battle);
  const { nextBattleFound } = useStoreState(state => state.Battle);

  useEffect(() => {
    getNextBattleFound(battle.BattleIndex + 1);
  }, [battle]);

  return (
    <Root>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Header h3>Battle info</Header>
        </AccordionSummary>
        <AccordionDetails>
          <BattleStyleDescription>
            {battle.BattleType === 'HT' ? (
              <>
                <span className="battleType">
                  <BattleType type={battle.BattleType} />
                </span>{' '}
                battle
              </>
            ) : (
              <>
                {battle.Duration} minute{' '}
                <span className="battleType">
                  <BattleType type={battle.BattleType} />
                </span>{' '}
                battle in{' '}
                <Download href={`level/${battle.LevelIndex}`}>
                  {battle.LevelData ? battle.LevelData.LevelName : '?'}
                  .lev
                </Download>
              </>
            )}
            {' by '}
            {battle.KuskiData.Kuski}
            <CrippleText>{crippleOptions(battle)}</CrippleText>
            <div className="timeStamp">
              Started{' '}
              <LocalTime
                date={battle.Started}
                format="DD.MM.YYYY HH:mm:ss"
                parse="X"
              />
            </div>
            <AbortedText>{aborted === 1 && 'Battle Aborted'}</AbortedText>
            <div className="timeStamp">
              <Download href={`battlereplay/${battle.BattleIndex}`}>
                Download replay
              </Download>
            </div>
            {battle.LevelData && (
              <div>
                {pluralize(battle.LevelData.Apples, 'apple')},{' '}
                {pluralize(battle.LevelData.Killers, 'killer')} and{' '}
                {pluralize(battle.LevelData.Flowers, 'flower')}.
              </div>
            )}
            <br />
            <div>
              <Link to={`/r/b-${battle.BattleIndex}`}>
                <StyledButton size="small" color="primary">
                  Go to replay page
                </StyledButton>
              </Link>
            </div>
            <Link to={`/levels/${battle.LevelIndex}`}>
              <StyledButton size="small" color="primary">
                Go to level page
              </StyledButton>
            </Link>
            <RightLinkContainer>
              <StyledButton
                size="small"
                color="primary"
                onClick={() => navigate(`/battles/${battle.BattleIndex - 1}`)}
              >
                Previous Battle{' '}
              </StyledButton>
              <StyledButton
                size="small"
                color="primary"
                onClick={() => navigate(`/battles/${battle.BattleIndex + 1}`)}
                disabled={nextBattleFound ? false : true}
              >
                Next Battle{' '}
              </StyledButton>
            </RightLinkContainer>
          </BattleStyleDescription>
        </AccordionDetails>
      </Accordion>
      {battle.Finished === 1 && battle.BattleType === 'NM' && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Header h3>Leader history</Header>
          </AccordionSummary>
          <AccordionDetails>
            {allBattleTimes !== null && allBattleTimes !== [] ? (
              <LeaderHistory
                allFinished={allBattleTimes}
                openReplay={
                  openReplay ? TimeIndex => openReplay(TimeIndex) : null
                }
                started={parseInt(battle.Started)}
              />
            ) : null}
          </AccordionDetails>
        </Accordion>
      )}
      <div className="chatContainer">
        {!(battleStatus(battle) === 'Queued') && (
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Header h3>Chat</Header>
            </AccordionSummary>
            <AccordionDetails>
              <ChatView
                start={Number(battle.Started)}
                end={
                  Number(battle.Started) + Number((battle.Duration + 2) * 60)
                }
                // battleEndEvent: when the battle ends compared to the start prop
                battleEnd={Number(battle.Duration * 60)}
                paginated
              />
            </AccordionDetails>
          </Accordion>
        )}
      </div>
    </Root>
  );
};

const Root = styled.div`
  float: right;
  width: 40%;
  padding: 7px;
  box-sizing: border-box;
  .chatContainer {
    clear: both;
  }
  @media (max-width: 1100px) {
    float: none;
    width: 100%;
  }
`;

const StyledButton = styled(Button)`
  && {
    font-weight: inherit;
    text-transform: initial;
  }
`;

const AbortedText = styled.span`
  color: Red;
`;

const CrippleText = styled.div`
  font-weight: 340;
`;

const BattleStyleDescription = styled.div`
  font-size: 14px;
  width: 100%;
  .timeStamp {
    color: #7d7d7d;
  }
  .battleType {
    text-transform: lowercase;
  }
`;

const RightLinkContainer = styled.span`
  float: right;
`;

export default RightBarContainer;
