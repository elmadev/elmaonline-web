import React from 'react';
import PropTypes from 'prop-types';
import { ListCell, ListRow } from 'components/List';
import { Level } from 'components/Names';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import Link from 'components/Link';
import Tags from 'components/Tags';
import { useNavigate } from '@reach/router';
import { formatDistance } from 'date-fns';

const RecListItem = ({ replay, selected, columns, openReplay }) => {
  const navigate = useNavigate();
  const handleOpenReplay = uuid => {
    if (openReplay) {
      openReplay(uuid);
    } else {
      navigate(`/r/${uuid}`);
    }
  };

  const getTags = () => {
    return [
      replay.TAS ? 'TAS' : undefined,
      replay.Unlisted ? 'Unlisted' : undefined,
      !replay.Finished ? 'DNF' : undefined,
      replay.Bug ? 'Bug' : undefined,
      replay.Nitro ? 'Mod' : undefined,
    ].filter(Boolean);
  };

  return (
    <ListRow
      key={replay.ReplayIndex}
      onClick={() => handleOpenReplay(replay.UUID)}
      selected={selected}
    >
      {columns.indexOf('Uploaded') !== -1 && (
        <ListCell width={170}>
          {formatDistance(replay.Uploaded * 1000, new Date(), {
            addSuffix: true,
          })}
        </ListCell>
      )}
      {columns.indexOf('Replay') !== -1 && (
        <ListCell width={200}>
          <Link to={`/r/${replay.UUID}`}>{replay.RecFileName}</Link>
        </ListCell>
      )}
      {columns.indexOf('Level') !== -1 && (
        <ListCell width={100}>
          <Level LevelData={replay.LevelData} />
        </ListCell>
      )}
      {columns.indexOf('Time') !== -1 && (
        <ListCell right>
          <Time thousands time={replay.ReplayTime} />
        </ListCell>
      )}
      {columns.indexOf('By') !== -1 && (
        <ListCell>
          {replay.DrivenByData ? (
            <Kuski kuskiData={replay.DrivenByData} />
          ) : (
            <div>{replay.DrivenByText}</div>
          )}
        </ListCell>
      )}
      {columns.indexOf('Tags') !== -1 && (
        <ListCell width={300}>
          <Tags tags={getTags()} />
        </ListCell>
      )}
    </ListRow>
  );
};

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
    DrivenByText: PropTypes.string,
  }).isRequired,
  openReplay: PropTypes.func,
  selected: PropTypes.bool,
  columns: PropTypes.arrayOf(PropTypes.string),
};

RecListItem.defaultProps = {
  openReplay: null,
  selected: false,
  columns: ['Replay', 'Level', 'Time', 'By'],
};

export default RecListItem;
