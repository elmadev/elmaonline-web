import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import Kuski from 'components/Kuski';
import Loading from 'components/Loading';
import { ListContainer, ListRow, ListHeader, ListCell } from 'components/List';
import { Paper } from 'components/Paper';
import Flag from 'components/Flag';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { find } from 'lodash';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Header from 'components/Header';

const ByCountry = ({ playersByCountry }) => {
  const [showCount, setShowCount] = useState(10);
  const [countrySort, setCountrySort] = useState('avgTop');
  const { sortCountries } = useStoreActions(store => store.Kuskis);

  // for getting country name from index
  const { countries } = useStoreState(store => store.Register);
  const { getCountries } = useStoreActions(store => store.Register);

  const getCountryName = index => {
    if (countries) {
      let obj = find(countries, c => c.Iso === index);

      if (obj && obj.Name) {
        return obj.Name;
      }
    }

    return index;
  };

  useEffect(() => {
    getCountries();
  }, []);

  if (!playersByCountry.length) {
    return <Loading />;
  }

  return (
    <Root>
      <Grid container justify="flex-end">
        <Grid item>
          <FormControl style={{ minWidth: 175, marginRight: 20 }}>
            <InputLabel id="country-player-count">Sort Countries By</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="country-player-count"
              value={countrySort}
              onChange={e => {
                sortCountries(e.target.value);
                setCountrySort(e.target.value);
              }}
            >
              <MenuItem value="avgTop">Top 5 Avg. Ranking</MenuItem>
              <MenuItem value="rankedPlayers"># Ranked Players</MenuItem>
              <MenuItem value="allPlayers"># Total Players</MenuItem>
              <MenuItem value="topPlayer">Top Ranked Player</MenuItem>
            </Select>
          </FormControl>
          <FormControl style={{ minWidth: 175 }}>
            <InputLabel id="country-player-count"># Players/Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="country-player-count"
              value={showCount}
              onChange={e => setShowCount(e.target.value)}
            >
              <MenuItem value={5}>Top 5 Ranked</MenuItem>
              <MenuItem value={10}>Top 10 Ranked</MenuItem>
              <MenuItem value={15}>Top 15 Ranked</MenuItem>
              <MenuItem value={30}>Top 30 Ranked</MenuItem>
              <MenuItem value="ranked">All Ranked</MenuItem>
              <MenuItem value="all">All Players (Slow!)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {playersByCountry.map((c, countryIndex) => {
        const playersShowing = (() => {
          if (showCount === 'all') {
            return c.players;
          }

          const ranked = c.players.filter(p => p.RankingData.RankingAll > 0);

          if (showCount === 'ranked') {
            return ranked;
          }
          return ranked.slice(0, showCount);
        })();

        return (
          <Item>
            <ItemHeading>
              <Header h1>
                <span>
                  {countryIndex + 1}.{` `}
                </span>
                <Flag nationality={c.country} />
                <span>{` `}</span>
                <span>{getCountryName(c.country)}</span>
              </Header>
            </ItemHeading>
            <Paper>
              <ItemStats>
                <span>{c.rankedCount} Ranked Players</span>
                <span>{c.playerCount} Total Players</span>
                <span>{c.avgTopRanking.toFixed(1)} Top 5 Avg. Ranking</span>
              </ItemStats>
              <ItemBody>
                <ListContainer>
                  <ListHeader>
                    <ListCell>Player</ListCell>
                    <ListCell>Battles Designed</ListCell>
                    <ListCell>Battles Played</ListCell>
                    <ListCell>Battle Win %</ListCell>
                    <ListCell>Battle Ranking</ListCell>
                  </ListHeader>

                  {playersShowing.map((p, index) => {
                    const r = p.RankingData;

                    const winPct =
                      r.PlayedAll > 0
                        ? ((r.WinsAll * 100) / r.PlayedAll).toFixed(2)
                        : 0;

                    return (
                      <ListRow className="player-row">
                        <ListCell>
                          {index + 1}.{` `}
                          <Kuski flag={false} team={true} kuskiData={p} />
                        </ListCell>
                        <ListCell>{r.DesignedAll}</ListCell>
                        <ListCell>{r.PlayedAll}</ListCell>
                        <ListCell>{winPct}</ListCell>
                        <ListCell>{r.RankingAll.toFixed(1)}</ListCell>
                      </ListRow>
                    );
                  })}
                </ListContainer>
              </ItemBody>
            </Paper>
          </Item>
        );
      })}
    </Root>
  );
};

const Root = styled.div`
  padding: 0 20px;
  .player-row:last-child {
    > span {
      border-bottom: none;
    }
  }
`;

const Item = styled.div`
  margin-bottom: 30px;
`;

const ItemHeading = styled.div``;

const ItemStats = styled.div`
  padding: 10px;
  > span {
    font-size: 14px;
    font-weight: 700;
    margin-left: 20px;
    &:first-child {
      margin-left: 0;
    }
  }
`;

const ItemBody = styled.div`
  padding-bottom: 10px;
  overflow-y: auto;
`;

export default ByCountry;
