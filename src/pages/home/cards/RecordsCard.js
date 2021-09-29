import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Header from 'components/Header';
import RecentRecords from 'components/RecentRecords';
import CardActions from '@material-ui/core/CardActions';
import Button from 'components/Buttons';
import { RecentBestRecords, useQueryAlt } from 'api';

const RecordsCard = () => {
  const [expanded, setExpanded] = useState(false);

  const { data: records } = useQueryAlt(['RecentBestRecords', 7], async () =>
    RecentBestRecords(7, 100),
  );

  const previewCount = 5;

  const show = records
    ? expanded
      ? records
      : records.slice(0, previewCount)
    : [];

  const countMore = records ? records.length - previewCount : 0;

  return (
    <Card>
      <CardContent title="Records driven during battles are omitted.">
        <Header h2>Records (Last 7 Days)</Header>
        <div>Ordered by overall level playtime.</div>
        {records && <RecentRecords records={show} />}
      </CardContent>
      {countMore > 0 && (
        <CardActions>
          <Button onClick={e => setExpanded(!expanded)} naked little>
            {expanded && <span>Show less</span>}
            {!expanded && <span>Show {countMore} more</span>}
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default RecordsCard;
