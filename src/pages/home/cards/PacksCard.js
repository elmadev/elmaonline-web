import React from 'react';
import {
  Grid,
  CardContent,
  Card,
  CardActions,
  Button,
} from '@material-ui/core';
import LevelPackList from 'features/LevelPackList';
import Link from 'components/Link';
import Header from 'components/Header';

export default function PacksCard() {
  return (
    <Grid item xs={12}>
      <Card>
        <CardContent>
          <Header h2>New Level Packs</Header>
          <LevelPackList amount={10} height={200} />
        </CardContent>
        <CardActions>
          <Button size="small" color="primary">
            <Link to="/levels">Show all</Link>
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
}
