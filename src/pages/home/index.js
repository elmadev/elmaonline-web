import React from 'react';
import { Grid } from '@material-ui/core';
import { useStoreState } from 'easy-peasy';
import News from 'features/News';
import Layout from 'components/Layout';
import WelcomeCard from './cards/WelcomeCard';
import BattlesCard from './cards/BattlesCard';
import ReplaysCard from './cards/ReplaysCard';
import CurrentBattleCard from './cards/CurrentBattleCard';
import FeedCard from './cards/FeedCard';
import PacksCard from './cards/PacksCard';
import RankingCard from './cards/RankingCard';

export default function Home() {
  const { loggedIn } = useStoreState(state => state.Login);

  return (
    <Layout t="Home">
      <Grid container spacing={3}>
        {!loggedIn && (
          <Grid container item xs={12}>
            <Grid item xs={12}>
              <WelcomeCard />
            </Grid>
          </Grid>
        )}
        <Grid container item sm={7} alignContent="flex-start" spacing={3}>
          <Grid item xs={12}>
            <BattlesCard />
          </Grid>
          <Grid item xs={12}>
            <ReplaysCard />
          </Grid>
          <Grid item xs={12}>
            <RankingCard />
          </Grid>
        </Grid>
        <Grid container spacing={3} item sm alignContent="flex-start">
          <CurrentBattleCard />
          <FeedCard />
          <PacksCard />
          <Grid item xs={12}>
            <News amount={5} />
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
}
