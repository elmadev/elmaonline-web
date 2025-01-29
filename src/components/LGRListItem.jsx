import React from 'react';
import { ListCell, ListRow } from 'components/List';
import Tags from 'components/Tags';
import { formatDistanceStrict } from 'date-fns';
import Kuski from 'components/Kuski';

const LGRListItem = ({ lgr }) => {
  const url = `/l/${lgr.LGRIndex}`;
  return (
    <ListRow key={`${lgr.LGRIndex}`}>
      <ListCell to={url}>
        {formatDistanceStrict(lgr.Added * 1000, new Date(), {
          addSuffix: true,
        })}
      </ListCell>
      <ListCell to={url}>{lgr.LGRName}</ListCell>
      <ListCell>
        <Kuski kuskiData={lgr.KuskiData} />
      </ListCell>
      <ListCell to={url}>{lgr.LGRDesc}</ListCell>
      <ListCell right>{lgr.Downloads}</ListCell>
      <ListCell>
        <Tags tags={lgr.Tags.map(tag => tag.Name)} />
      </ListCell>
    </ListRow>
  );
};

export default LGRListItem;
