import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ReplayList from 'features/ReplayList';
import Link from 'components/Link';

export default function ReplaysCard() {
  return (
    <Card>
      <CardHeader title="Latest Replays" />
      <CardContent>
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
