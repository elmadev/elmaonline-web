import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import BattleList from 'features/BattleList';
import CardActions from '@material-ui/core/CardActions';
import Header from 'components/Header';
import Button from 'components/Buttons';

export default function BattlesCard() {
  return (
    <Card>
      <CardContent>
        <Header h2>Latest Battles</Header>
        <BattleList limit={15} condensed latest height={260} />
      </CardContent>
      <CardActions>
        <Button to="/battles" naked little>
          Show more
        </Button>
      </CardActions>
    </Card>
  );
}
