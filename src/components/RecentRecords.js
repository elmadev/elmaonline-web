import { ListContainer, ListHeader, ListRow, ListCell } from 'components/List';
import Link from 'components/Link';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import formatDistance from 'date-fns/formatDistance';

// todo: refactor copy/pasted fn from levelpack archive (when merged)
const formatTimeSpent = time => {
  const hours = Math.round(time / 360000);

  if (hours < 1) {
    return '<1h';
  }

  return hours.toLocaleString() + 'h';
};

const RecentRecords = ({ records }) => {
  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListCell>Record</ListCell>
          <ListCell>Level</ListCell>
          <ListCell title="Total time played on level by all players combined">
            Total Level Time
          </ListCell>
          <ListCell>Driven</ListCell>
        </ListHeader>
        {records &&
          records.map(r => {
            const level = r.LevelData || {};
            const kuski = r.KuskiData || {};
            const levUrl = `levels/${level.LevelIndex}`;
            const driven2 = formatDistance(
              new Date(r.Driven * 1000),
              new Date(),
              { addSuffix: true },
            );

            return (
              <ListRow>
                <ListCell>
                  <Kuski kuskiData={kuski} flag={true} />
                  <span>{` `}</span>
                  <Time time={r.Time} />
                </ListCell>
                <ListCell>
                  <Link to={levUrl} title={level.LongName}>
                    {level.LevelName}
                  </Link>
                </ListCell>
                <ListCell>{formatTimeSpent(r.TimeAll)}</ListCell>
                <ListCell>{driven2}</ListCell>
              </ListRow>
            );
          })}
      </ListContainer>
    </>
  );
};

export default RecentRecords;
