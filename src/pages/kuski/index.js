import React, { useEffect } from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { useNavigate } from '@reach/router';
import PropTypes from 'prop-types';
import { Tabs, Tab } from '@material-ui/core';
import styled from 'styled-components';
import config from 'config';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import Flag from 'components/Flag';
import ReplayList from 'features/ReplayList';
import Notifications from 'features/Notifications';
import PlayedBattles from './PlayedBattles';
import DesignedBattles from './DesignedBattles';
import KuskiHeader from './KuskiHeader';
import TimesReplays from './TimesReplays';
import Info from './Info';
import Files from './Files';

const Kuski = ({ name, tab, ...props }) => {
  const { getKuskiByName } = useStoreActions(state => state.Kuski);
  const { kuski, kuskiLoading } = useStoreState(state => state.Kuski);
  const { username } = useStoreState(state => state.Login);

  const navigate = useNavigate();

  useEffect(() => {
    getKuskiByName(name);
  }, [name]);

  return (
    <Layout edge t={`Kuski - ${name}`}>
      {!kuski ? (
        <>{kuskiLoading ? <Loading /> : <div>not found</div>}</>
      ) : (
        <Container chin={tab !== 'times' && tab !== 'files'}>
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
            <KuskiHeader KuskiIndex={kuski.KuskiIndex} />
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
            <Tab label="Times" value="times" />
            <Tab label="Replays Uploaded" value="replays-uploaded" />
            <Tab label="Replays Driven" value="replays-driven" />
            <Tab label="Info" value="info" />
            {username === name && (
              <Tab label="Notifications" value="notifications" />
            )}
            {username === name && <Tab label="Files" value="files" />}
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
          {tab === 'times' && <TimesReplays KuskiIndex={kuski.KuskiIndex} />}
          {tab === 'replays-uploaded' && (
            <Width100>
              <ReplayList nonsticky uploadedBy={kuski.KuskiIndex} />
            </Width100>
          )}
          {tab === 'replays-driven' && (
            <Width100>
              <ReplayList nonsticky drivenBy={kuski.KuskiIndex} />
            </Width100>
          )}
          {tab === 'info' && <Info kuskiInfo={kuski} />}
          {tab === 'notifications' && username === name && <Notifications />}
          {tab === 'files' && username === name && <Files />}
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
  padding-bottom: ${p => (p.chin ? '200px' : '0')};
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
