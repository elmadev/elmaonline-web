import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useNavigate } from '@reach/router';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@material-ui/core';
import styled from 'styled-components';
import config from 'config';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import Flag from 'components/Flag';
import ReplaysBy from 'features/ReplaysBy';
import Notifications from 'features/Notifications';
import PlayedBattles from './PlayedBattles';
import DesignedBattles from './DesignedBattles';
import KuskiHeader from './KuskiHeader';
import LatestTimes from './LatestTimes';
import Info from './Info';
import Records from './Records';
import { makeGetter, PlayerRecordCount } from 'api';

const Kuski = ({ name, tab, ...props }) => {
  const { getKuskiByName } = useStoreActions(state => state.Kuski);
  const { kuski, kuskiLoading } = useStoreState(state => state.Kuski);
  const { username } = useStoreState(state => state.Login);
  const navigate = useNavigate();

  useEffect(() => {
    getKuskiByName(name);
  }, [name]);

  const { data: recordCount } = useQuery(
    ['PlayerRecordCount', kuski.KuskiIndex],
    makeGetter(PlayerRecordCount, [kuski.KuskiIndex]),
    {
      enabled: !!kuski.KuskiIndex,
      staleTime: 60000,
    },
  );

  return (
    <Layout edge t={`Kuski - ${name}`}>
      {!kuski ? (
        <>{kuskiLoading ? <Loading /> : <div>not found</div>}</>
      ) : (
        <Container>
          <Head>
            <Picture>
              {kuski.BmpCRC !== 0 && (
                <img
                  src={`${config.dlUrl}shirt/${kuski.KuskiIndex}`}
                  alt="shirt"
                />
              )}
            </Picture>
            <Profile>
              <Name>
                <Flag nationality={kuski.Country} />
                {kuski.Kuski}
              </Name>
              <TeamNat>
                {kuski.TeamData && `Team: ${kuski.TeamData.Team}`}
              </TeamNat>
            </Profile>
            <KuskiHeader
              KuskiIndex={kuski.KuskiIndex}
              recordCount={recordCount}
            />
          </Head>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={tab}
            onChange={(e, t) =>
              navigate(['/kuskis', name, t].filter(Boolean).join('/'))
            }
          >
            <Tab label="Played Battles" value="" />
            <Tab label="Designed Battles" value="designed-battles" />
            <Tab label="Records" value="records" />
            <Tab label="Latest times" value="latest-times" />
            <Tab label="Replays Uploaded" value="replays-uploaded" />
            <Tab label="Replays Driven" value="replays-driven" />
            <Tab label="Info" value="info" />
            {username === name && (
              <Tab label="Notifications" value="notifications" />
            )}
          </Tabs>
          {!tab && (
            <Width100>
              <PlayedBattles KuskiIndex={kuski.KuskiIndex} />
            </Width100>
          )}
          {tab === 'designed-battles' && (
            <Width100>
              <DesignedBattles KuskiIndex={kuski.KuskiIndex} />
            </Width100>
          )}
          {tab === 'latest-times' && (
            <LatestTimes KuskiIndex={kuski.KuskiIndex} />
          )}
          {tab === 'records' && (
            <Records KuskiIndex={kuski.KuskiIndex} recordCount={recordCount} />
          )}
          {tab === 'replays-uploaded' && (
            <Width100>
              <ReplaysBy type="uploaded" KuskiIndex={kuski.KuskiIndex} />
            </Width100>
          )}
          {tab === 'replays-driven' && (
            <Width100>
              <ReplaysBy type="driven" KuskiIndex={kuski.KuskiIndex} />
            </Width100>
          )}
          {tab === 'info' && <Info kuskiInfo={kuski} />}
          {tab === 'notifications' && username === name && <Notifications />}
        </Container>
      )}
    </Layout>
  );
};

Kuski.propTypes = {
  name: PropTypes.string,
};

Kuski.defaultProps = {
  name: '',
};

const Width100 = styled.div`
  max-width: 100%;
  overflow: auto;
`;

const Container = styled.div`
  min-height: 100%;
  background: ${p => p.theme.paperBackground};
  padding-bottom: 200px;
`;

const Picture = styled.div`
  height: 150px;
  width: 150px;
  flex: 0 0 150px;
  border-radius: 50%;
  margin: 20px;
  background-color: transparent;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 20px,
    #f1f1f1 0,
    #f1f1f1 50px
  );
  img {
    margin: auto;
    display: block;
    padding: 10px;
  }
  @media (max-width: 940px) {
    margin: 20px auto;
  }
`;

const Profile = styled.div`
  flex-direction: column;
  justify-content: center;
  flex: 0 0 200px;
  @media (max-width: 940px) {
    align-items: center;
    flex: 1;
  }
`;

const Name = styled.div`
  font-weight: 500;
  font-size: 30px;
  span {
    margin-right: 10px;
    font-size: 20px;
  }
`;

const TeamNat = styled.div`
  font-size: 16px;
`;

const Head = styled.div`
  border-bottom: 1px solid #eaeaea;
  display: flex;
  > * {
    display: flex;
  }
  @media (max-width: 940px) {
    flex-direction: column;
    > * {
      margin-bottom: 20px;
    }
  }
`;

export default Kuski;
