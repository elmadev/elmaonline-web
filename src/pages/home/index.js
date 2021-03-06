import React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';
import News from 'features/News';
import Layout from 'components/Layout';
import SidebarPage from 'components/SidebarPage';
import VSpaceChildren from 'components/VSpaceChildren';
import WelcomeCard from './cards/WelcomeCard';
import BattlesCard from './cards/BattlesCard';
import ReplaysCard from './cards/ReplaysCard';
import CurrentBattleCard from './cards/CurrentBattleCard';
import FeedCard from './cards/FeedCard';

export default function Home() {
  const { loggedIn } = useStoreState(state => state.Login);

  return (
    <Layout t="Home">
      {!loggedIn && (
        <VSpaceChildren last={true}>
          <WelcomeCard />
        </VSpaceChildren>
      )}
      <SidebarPage responsive>
        <VSpaceChildren>
          <BattlesCard />
          <ReplaysCard />
        </VSpaceChildren>
        <VSpaceChildren>
          <CurrentBattleCard />
          <FeedCard />
          <News amount={5} />
        </VSpaceChildren>
      </SidebarPage>
    </Layout>
  );
}
