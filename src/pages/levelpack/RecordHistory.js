import React, { useState } from 'react';
import styled from 'styled-components';
import { useStoreState } from 'easy-peasy';
import Loading from 'components/Loading';
import Header from 'components/Header';
import { ListCell, ListContainer, ListHeader, ListRow } from 'components/List';
import { LevelPackRecordHistory, useQueryAlt } from '../../api';
import Kuski from 'components/Kuski';
import Time from 'components/Time';
import LocalTime from 'components/LocalTime';
import { Level } from '../../components/Names';
import { Dropdown } from '../../components/Inputs';
import Switch from 'components/Switch';
import { Typography } from '@material-ui/core';

const Date = ({ driven }) => {
  return <LocalTime date={driven} format="D MMM YYYY" parse="X" />;
};

const RecordHistory = ({ levelPackInfo }) => {
  const name = levelPackInfo && levelPackInfo.LevelPackName;

  const [limit, setLimit] = useState(50);
  const [sort, setSort] = useState('desc');

  const { data: recordsData, isLoading: recordsLoading } = useQueryAlt(
    ['LevelPackRecordHistory', name, limit, sort],
    async () => LevelPackRecordHistory(name, { limit, sort }),
    {
      enabled: !!name,
    },
  );

  const { countAll, minDriven, maxDriven, records } =
    recordsData !== undefined ? recordsData : {};

  console.log(countAll, minDriven, maxDriven);

  const limitOptions = [
    [50, 50],
    [100, 100],
    [200, 200],
    [1000, '1000 (Slow!)'],
    [999999, 'All (Very Slow!)'],
  ];

  console.log(levelPackInfo);
  return (
    <Root>
      <div>
        {countAll !== undefined && (
          <TextDiv>
            {countAll} record(s) in total have been driven between
            {` `}
            <Strong>
              <Date driven={minDriven} />
            </Strong>
            {` and `}
            <Strong>
              <Date driven={maxDriven} />
            </Strong>
          </TextDiv>
        )}
        {!!levelPackInfo?.Legacy && (
          <TextDiv>
            This pack contains legacy times, but the data below only includes
            records driven in EOL.
          </TextDiv>
        )}
      </div>
      <Controls>
        <Dropdown
          name="# Of Records Shown"
          options={limitOptions}
          update={setLimit}
          selected={limit}
        />
        <Switch
          checked={sort === 'desc'}
          onChange={checked => setSort(checked ? 'desc' : 'asc')}
        >
          Recent First
        </Switch>
      </Controls>
      <br />
      <StyledListContainer>
        <ListHeader>
          <ListCell width={100}>Filename</ListCell>
          <ListCell width={180}>Level Name</ListCell>
          <ListCell>Kuski</ListCell>
          <ListCell>Time</ListCell>
          <ListCell>Driven</ListCell>
        </ListHeader>
        {recordsLoading && <Loading />}
        {records !== undefined &&
          records.map(r => {
            return (
              <ListRow key={r.TimeIndex}>
                <ListCell>
                  <Level LevelIndex={r.LevelIndex} LevelData={r.LevelData} />
                </ListCell>
                <ListCell>{r.LevelData.LongName}</ListCell>
                <ListCell>
                  <Kuski kuskiData={r.KuskiData} team flag />
                </ListCell>
                <ListCell>
                  <Time time={r.Time} />
                </ListCell>
                <ListCell>
                  <Date driven={r.Driven} />
                </ListCell>
              </ListRow>
            );
          })}
      </StyledListContainer>
    </Root>
  );
};

const Root = styled.div``;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  > * {
    &:first-child {
      width: 200px;
    }
    margin-left: 20px;
  }
`;

const TextDiv = styled.div`
  font-size: 14px;
  margin: 0 0 10px 10px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const StyledListContainer = styled(ListContainer)``;

const Strong = styled.span`
  font-weight: 500;
`;

export default RecordHistory;
