import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import BattleList from 'features/BattleList';
import subYears from 'date-fns/subYears';
import addHours from 'date-fns/addHours';
import CardActions from '@material-ui/core/CardActions';
import Header from 'components/Header';
import Button from 'components/Buttons';

export default function BattlesCard() {
  return (
    <Card>
      <CardContent>
        <Header h2>Latest Battles</Header>
        <BattleList
          start={subYears(new Date(), 1)}
          end={addHours(new Date(), 12)}
          limit={5}
          condensed
        />
      </CardContent>
      <CardActions>
        <Button to="/battles" naked small>
          Show more
        </Button>
      </CardActions>
    </Card>
  );
}
