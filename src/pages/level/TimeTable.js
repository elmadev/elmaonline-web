import React from 'react';
import PropTypes from 'prop-types';
import { ListContainer, ListHeader, ListCell, ListRow } from 'components/List';
import Time from 'components/Time';
import Loading from 'components/Loading';
import LegacyIcon from 'components/LegacyIcon';
import { FixedSizeList as List } from 'react-window';

const TimeTable = ({ data, latestBattle, loading }) => {
  if (loading) return <Loading />;
  return (
    <div>
      <ListContainer>
        <ListHeader>
          <ListCell right width={30}>
            #
          </ListCell>
          <ListCell width={200}>Kuski</ListCell>
          <ListCell right width={200}>
            Time
          </ListCell>
          <ListCell />
        </ListHeader>
      </ListContainer>
      {data &&
        (!latestBattle ||
          latestBattle.Finished === 1 ||
          latestBattle.Aborted === 1) && (
          <ListContainer flex>
            <List
              className="List"
              height={600}
              itemCount={data.length}
              itemSize={40}
            >
              {({ index, style }) => {
                const t = data[index];
                return (
                  <div style={style} key={`${t.TimeIndex}${t.Time}`}>
                    <ListRow>
                      <ListCell right width={30}>
                        {index + 1}.
                      </ListCell>
                      <ListCell whiteSpace="nowrap" width={200}>
                        {t.KuskiData.Kuski}{' '}
                        {t.KuskiData.TeamData &&
                          `[${t.KuskiData.TeamData.Team}]`}
                      </ListCell>
                      <ListCell width={200} right>
                        <Time time={t.Time} />
                      </ListCell>
                      <ListCell right>
                        {t.Source !== undefined && (
                          <LegacyIcon source={t.Source} />
                        )}
                      </ListCell>
                    </ListRow>
                  </div>
                );
              }}
            </List>
          </ListContainer>
        )}
    </div>
  );
};

TimeTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default TimeTable;
