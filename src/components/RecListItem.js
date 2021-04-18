import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListCell, ListRow } from 'components/List';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Link from 'components/Link';
import Tags from 'components/Tags';
import { AddBox, IndeterminateCheckBox } from '@material-ui/icons';
import { useLocation } from '@reach/router';
import { formatDistanceStrict } from 'date-fns';

const RecListItem = ({ replay, selected, columns, mergable = false }) => {
  const [isHover, setHover] = useState(false);
  const location = useLocation();

  const getTags = () => {
    return replay.Tags.map(tag => tag.Name);
  };
  return (
    <ListRow
      key={replay.ReplayIndex}
      selected={selected}
      onHover={hover => mergable && setHover(hover)}
    >
      {columns.indexOf('Uploaded') !== -1 && (
        <ListCell width={170} to={`/r/${replay.UUID}`}>
          {formatDistanceStrict(replay.Uploaded * 1000, new Date(), {
            addSuffix: true,
          })}
        </ListCell>
      )}
      {columns.indexOf('Replay') !== -1 && (
        <ListCell width={200} to={`/r/${replay.UUID}`}>
          {replay.RecFileName}
        </ListCell>
      )}
      {columns.indexOf('Level') !== -1 && (
        <ListCell width={100}>
          <Level LevelIndex={replay.LevelIndex} LevelData={replay.LevelData} />
        </ListCell>
      )}
      {columns.indexOf('Time') !== -1 && (
        <ListCell right to={`/r/${replay.UUID}`}>
          <Time thousands time={replay.ReplayTime} />
        </ListCell>
      )}
      {columns.indexOf('By') !== -1 && (
        <ListCell>
          {replay.DrivenByData ? (
            <Kuski kuskiData={replay.DrivenByData} />
          ) : (
            <div>{replay.DrivenByText || 'Unknown'}</div>
          )}
        </ListCell>
      )}
      {columns.indexOf('Rating') !== -1 && (
        <ListCell to={`/r/${replay.UUID}`}>{replay.ratingAvg}</ListCell>
      )}

      {columns.indexOf('Tags') !== -1 && (
        <ListCell width={300} to={`/r/${replay.UUID}`}>
          <Tags tags={getTags()} />
        </ListCell>
      )}
      {mergable && isHover && (
        <MergeContainer title={selected ? 'Unmerge replay' : 'Merge replay'}>
          {selected ? (
            <Link
              to={location.pathname
                .replace(`,${replay.UUID}`, '')
                .replace(`${replay.UUID},`, '')}
            >
              <IndeterminateCheckBox />
            </Link>
          ) : (
            <Link to={`${location.pathname},${replay.UUID}`}>
              <AddBox />
            </Link>
          )}
        </MergeContainer>
      )}
    </ListRow>
  );
};

const MergeContainer = styled.div`
  position: absolute;
  right: 0;
  margin: 7px;
  background: white;
  border-radius: 4px;
`;

RecListItem.propTypes = {
  replay: PropTypes.shape({
    ReplayIndex: PropTypes.number.isRequired,
    LevelIndex: PropTypes.number.isRequired,
    UploadedBy: PropTypes.number.isRequired,
    ReplayTime: PropTypes.number,
    TAS: PropTypes.number,
    Bug: PropTypes.number,
    Nitro: PropTypes.number,
    Finished: PropTypes.number,
    DrivenBy: PropTypes.number,
    DrivenByText: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.string),
  mergable: PropTypes.bool,
};

RecListItem.defaultProps = {
  selected: false,
  columns: ['Replay', 'Level', 'Time', 'By'],
  mergable: false,
};

export default RecListItem;
