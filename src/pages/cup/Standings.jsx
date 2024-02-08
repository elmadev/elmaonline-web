import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';
import { Grid, IconButton } from '@material-ui/core';
import Header from 'components/Header';
import Kuski from 'components/Kuski';
import FieldBoolean from 'components/FieldBoolean';
import { Row } from 'components/Containers';
import { calculateStandings, pts } from 'utils/cups';
import Flag from 'components/Flag';
import { Paper, Content } from 'components/Paper';
import { AddCircleOutlineRounded } from '@material-ui/icons';
import StandingsDetailedPopup from './StandingsDetailedPopup';
import { TriangleUp, TriangleDown } from 'components/Symbols';

const Standings = props => {
  const { events, cup } = props;
  const [forceSkips, setForceSkips] = useState(false);
  const [detailed, setDetailed] = useState(false);
  const [standings, setStandings] = useState({});
  const [standingsDetailedData, setStandingsDetailedData] = useState(null);

  useEffect(() => {
    setStandings(calculateStandings(events, cup, false));
  }, [events, cup]);

  const onKuskiRowClick = kuskiData => {
    setStandingsDetailedData(kuskiData);
  };

  const closeStandingsDetailed = () => {
    setStandingsDetailedData(null);
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} md={detailed ? 12 : 6}>
        <Container>
          <Paper>
            <Content>
              <Row jc="space-between">
                <Header h2>Players</Header>
                <Row jc="flex-end">
                  <FieldBoolean
                    label="Force skips"
                    value={forceSkips}
                    onChange={() => {
                      setForceSkips(!forceSkips);
                      setStandings(
                        calculateStandings(events, cup, false, !forceSkips),
                      );
                    }}
                  />
                  <FieldBoolean
                    label="Detailed"
                    value={detailed}
                    onChange={() => {
                      setDetailed(!detailed);
                    }}
                  />
                </Row>
              </Row>
            </Content>
            {standings.player && (
              <ListContainer>
                <ListHeader>
                  <ListCell width={70}>#</ListCell>
                  <ListCell>Player</ListCell>
                  {detailed ? (
                    <>
                      {events.map((e, i) => (
                        <ListCell width={70} key={i} right>
                          {i + 1}
                        </ListCell>
                      ))}
                    </>
                  ) : null}
                  <ListCell width={100} right>
                    {detailed ? 'Total Points' : 'Points'}
                  </ListCell>
                  <ListCell width={20} right />
                </ListHeader>
                {standings.player.map((r, no) => (
                  <ListRow key={r.KuskiIndex}>
                    <ListCell width={70}>
                      <Position
                        r={r}
                        no={r.FinalPosition ? r.FinalPosition - 1 : no}
                        amountEvents={
                          events.filter(e => e.Updated && e.ShowResults).length
                        }
                      />
                    </ListCell>
                    <ListCell>
                      <Kuski kuskiData={r.KuskiData} team flag />
                    </ListCell>
                    {detailed ? (
                      <>
                        {events.map((e, i) => {
                          let points = '-';
                          const find = r.AllPointsDetailed.find(
                            a => a.Event === i + 1,
                          );
                          if (find) {
                            points = pts(find.Points, true);
                          }
                          return (
                            <ListCell width={70} key={i} right>
                              <PtsSpan skipped={find?.Skipped}>
                                {points}
                              </PtsSpan>
                            </ListCell>
                          );
                        })}
                      </>
                    ) : null}
                    <ListCell width={100} right>
                      {pts(r.Points)}
                    </ListCell>
                    <ListCell width={20} right>
                      <IconButton
                        aria-label="details"
                        onClick={() => onKuskiRowClick(r)}
                        size="small"
                      >
                        <AddCircleOutlineRounded />
                      </IconButton>
                    </ListCell>
                  </ListRow>
                ))}
              </ListContainer>
            )}
          </Paper>
        </Container>
      </Grid>
      <Grid item xs={12} md={6}>
        <Container>
          <Paper>
            <Content>
              <Header h2>Teams</Header>
            </Content>
            {standings.team && (
              <ListContainer>
                <ListHeader>
                  <ListCell width={70}>#</ListCell>
                  <ListCell>Team</ListCell>
                  <ListCell right>Points</ListCell>
                </ListHeader>
                {standings.team.map((r, no) => (
                  <ListRow key={r.Team}>
                    <ListCell>{no + 1}.</ListCell>
                    <ListCell>{r.Team}</ListCell>
                    <ListCell right>{pts(r.Points)}</ListCell>
                  </ListRow>
                ))}
              </ListContainer>
            )}
          </Paper>
          <Paper top>
            <Content>
              <Header h2>Nations</Header>
            </Content>
            {standings.team && (
              <ListContainer>
                <ListHeader>
                  <ListCell width={70}>#</ListCell>
                  <ListCell>Nation</ListCell>
                  <ListCell right>Points</ListCell>
                </ListHeader>
                {standings.nation.map((r, no) => (
                  <ListRow key={r.Country}>
                    <ListCell>{no + 1}.</ListCell>
                    <ListCell>
                      <span>
                        <Flag nationality={r.Country} /> {r.Country}
                      </span>
                    </ListCell>
                    <ListCell right>{pts(r.Points)}</ListCell>
                  </ListRow>
                ))}
              </ListContainer>
            )}
          </Paper>

          {standingsDetailedData && (
            <StandingsDetailedPopup
              data={standingsDetailedData}
              events={events}
              close={closeStandingsDetailed}
            />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

const Container = styled.div`
  padding-left: 8px;
  padding-right: 8px;
`;

export const Position = ({ r, no, amountEvents }) => {
  if (r.Position[amountEvents - 1] < no + 1) {
    return (
      <Number title={`Down from ${r.Position[amountEvents - 1]}`}>
        {no + 1}. <TriangleDown />
      </Number>
    );
  }
  if (r.Position[amountEvents - 1] > no + 1) {
    return (
      <Number title={`Up from ${r.Position[amountEvents - 1]}`}>
        {no + 1}. <TriangleUp />
      </Number>
    );
  }
  return (
    <Number margin={29} title="No change">
      {no + 1}.
    </Number>
  );
};

const Number = styled.span`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: ${p => (p.margin ? p.margin : 10)}px;

  span {
    margin-left: 10px;
  }
`;

const PtsSpan = styled.span`
  ${p => (p.skipped ? 'text-decoration: line-through; color: #c3c3c3;' : '')}
`;

export default Standings;
