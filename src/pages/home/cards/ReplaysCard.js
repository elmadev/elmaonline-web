import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ReplayList from 'features/ReplayList';
import Link from 'components/Link';
import Header from 'components/Header';

export default function ReplaysCard() {
  return (
    <Card>
      <CardContent>
        <Header h2>Latest Replays</Header>
        <ReplayList
          defaultPage={0}
          defaultPageSize={20}
          showPagination={false}
        />
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          <Link to="/replays">Show more</Link>
        </Button>
        <Button size="small" color="primary" style={{ marginLeft: 'auto' }}>
          <Link to="/replays/upload">Upload</Link>
        </Button>
      </CardActions>
    </Card>
  );
}
