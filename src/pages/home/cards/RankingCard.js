import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Header from 'components/Header';
import Button from 'components/Buttons';
import RankingTable from 'features/RankingTable';
import { formatPeriod } from 'pages/ranking';
import { format } from 'date-fns';

export default function RankingCard() {
  return (
    <Card>
      <CardContent>
        <Header h2>
          Battle Ranking {format(new Date(), 'MMMM')} {new Date().getFullYear()}
        </Header>
        <RankingTable
          battleType="All"
          minPlayed={2}
          tableIndex="RankingMonthlyIndex"
          periodType="month"
          period={formatPeriod(
            'month',
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0,
            new Date().getDay() - 1,
          )}
          fixedHeight={200}
        />
      </CardContent>
      <CardActions>
        <Button to="/ranking" naked little>
          Show more
        </Button>
      </CardActions>
    </Card>
  );
}
