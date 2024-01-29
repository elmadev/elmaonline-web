import React, { useEffect, useContext } from 'react';
import { Tabs, Tab } from '@material-ui/core';
import { Router, useNavigate } from '@reach/router';
import styled, { ThemeContext } from 'styled-components';
import Header from 'components/Header';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { nickId } from 'utils/nick';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import { Row } from 'components/Containers';
import { admins } from 'utils/cups';
import Events from './Events';
import Standings from './Standings';
import RulesInfo from './RulesInfo';
import Blog from './Blog';
import Admin from './Admin';
import Dashboard from './Dashboard';
import Personal from './Personal';
import Team from './Team';

const Cups = props => {
  const { ShortName } = props;
  const theme = useContext(ThemeContext);

  const cupTab = (() => {
    let c = props['*'];

    if (c && c.indexOf('/') !== 0) {
      return c.split('/')[0];
    }

    return c;
  })();

  const { cup, lastCupShortName, events } = useStoreState(state => state.Cup);
  const { getCup, update, addNewBlog } = useStoreActions(
    actions => actions.Cup,
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (lastCupShortName !== ShortName) {
      getCup(ShortName);
    }
  }, []);

  const isCupAdmin =
    admins(cup).length > 0 && admins(cup).indexOf(nickId()) > -1;

  if (!cup) {
    return null;
  }

  const cover = cup.Cover ? cup.Cover : null;
  let bgColor = null;
  if (cover) {
    if (theme.type === 'dark' && cover.split('-')[2]) {
      bgColor = `#${cover.split('-')[2].split('.')[0]}`;
    } else if (cover.split('-')[1]) {
      bgColor = `#${cover.split('-')[1]}`;
    }
  }

  return (
    <Layout edge t={`Cup - ${cup ? cup.CupName : ShortName}`}>
      {!cup ? (
        <Loading />
      ) : (
        <>
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={cupTab}
            onChange={(e, value) =>
              // value can be empty string
              navigate(['/cup', ShortName, value].filter(Boolean).join('/'))
            }
          >
            <Tab label="Dashboard" value="" />
            <Tab label="Events" value="events" />
            <Tab label="Standings" value="standings" />
            <Tab label="Rules & Info" value="rules" />
            <Tab label="Blog" value="blog" />
            {nickId() > 0 && <Tab label="Personal" value="personal" />}
            {nickId() > 0 && <Tab label="Team" value="team" />}
            {isCupAdmin && <Tab label="Admin" value="admin" />}
          </Tabs>
          <CupName bgColor={bgColor}>
            <Row jc="space-between" ai="center">
              <Row jc="flex-start" ai="center">
                {cover ? <Img src={cover} alt="" /> : null}
                <Header h1>{cup.CupName}</Header>
              </Row>
              <Description
                dangerouslySetInnerHTML={{ __html: cup.Description }}
              />
            </Row>
          </CupName>
          <Router primary={false}>
            <Dashboard default cup={cup} events={events} />
            <div path="events">
              <Events
                default
                eventNumber={1}
                eventTab="results"
                cup={cup}
                events={events}
              />
              <Events
                path=":eventNumber"
                eventTab="results"
                cup={cup}
                events={events}
              />
              <Events path=":eventNumber/:eventTab" cup={cup} events={events} />
            </div>
            <Standings path="standings" cup={cup} events={events} />
            <RulesInfo
              path="rules"
              description={cup.Description}
              owner={admins(cup)}
              cup={cup}
              updateDesc={newDesc => {
                update({
                  CupGroupIndex: cup.CupGroupIndex,
                  shortName: cup.ShortName,
                  data: { Description: newDesc },
                });
              }}
            />
            <Blog
              path="blog"
              cup={cup}
              owner={admins(cup)}
              items={cup.CupBlog}
              addEntry={newBlog => {
                addNewBlog({ data: newBlog, shortName: cup.ShortName });
              }}
            />
            <Personal path="personal" />
            <Team path="team" />
            {isCupAdmin && <Admin path="admin" />}
          </Router>
        </>
      )}
    </Layout>
  );
};

const CupName = styled.div`
  padding: 8px;
  background-color: ${p => (p.bgColor ? p.bgColor : 'transparent')};
  h1 {
    margin: 0;
    margin-right: ${p => p.theme.padLarge};
    white-space: nowrap;
  }
`;

const Description = styled.div`
  padding-bottom: 8px;
  padding-top: 8px;
`;

const Img = styled.img`
  height: 100px;
  margin-right: ${p => p.theme.padLarge};
`;

export default Cups;
