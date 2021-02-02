import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import Layout from 'components/Layout';
import BattleList from 'features/BattleList';
import queryString from 'query-string';
import { useNavigate, useLocation } from '@reach/router';

const Battles = props => {
  const location = useLocation();
  const navigate = useNavigate();
  const { date } = queryString.parse(location.search);

  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const parseDate = d =>
    d ? moment(d, 'YYYY-MM-DD').startOf('day') : moment().startOf('day');

  useEffect(() => {
    const parsedDate = parseDate(date);
    setStart(parsedDate);
    setEnd(parsedDate.clone().add(1, 'days'));
  }, [date]);

  const next = () => {
    navigate(`/battles?date=${start.add(1, 'days').format('YYYY-MM-DD')}`);
  };

  const previous = () => {
    navigate(`/battles?date=${start.subtract(1, 'days').format('YYYY-MM-DD')}`);
  };

  if (!start || !end) return null;

  return (
    <Layout edge t={`Battles - ${start.format('ddd DD.MM.YYYY')}`}>
      <Container>
        <Datepicker>
          <button onClick={previous} type="button">
            &lt;
          </button>
          <SelectedDate>{start.format('ddd DD.MM.YYYY')}</SelectedDate>
          <button onClick={next} type="button">
            &gt;
          </button>
        </Datepicker>
        <BattleList start={start.clone()} end={end.clone()} />
      </Container>
    </Layout>
  );
};

const Container = styled.div`
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
  font-size: 14px;
`;

const Datepicker = styled.div`
  background: #f1f1f1;
  font-weight: 500;
  font-size: 16px;
  button {
    padding: 15px 10px;
    border: 0;
    background: transparent;
    cursor: pointer;
    outline: 0;
    width: 50px;
    text-align: center;
  }
`;

const SelectedDate = styled.span`
  display: inline-block;
  width: 120px;
  text-align: center;
`;

export default Battles;
