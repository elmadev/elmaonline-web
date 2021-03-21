import React from 'react';
import Card from '@material-ui/core/Card';
import Header from 'components/Header';
import CardContent from '@material-ui/core/CardContent';
import CupWidget from 'components/CupWidget';

export default function FeedCard({ cupShortName }) {
  return (
    <Card>
      <CardContent>
        <Header h2>Cups</Header>
        <CupWidget ShortName={cupShortName} />
      </CardContent>
    </Card>
  );
}
