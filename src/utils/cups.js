import { forEach } from 'lodash';
import config from 'config';
import { zeroPad } from 'utils/time';

export const admins = cup => {
  let a = [cup.KuskiIndex];
  if (cup.ReadAccess) {
    a = [
      cup.KuskiIndex,
      ...cup.ReadAccess.split('-').map(r => parseInt(r, 10)),
    ];
  }
  return a;
};

export const points = [
  100,
  85,
  75,
  70,
  65,
  60,
  56,
  52,
  49,
  46,
  44,
  42,
  40,
  38,
  36,
  35,
  34,
  33,
  32,
  31,
  30,
  29,
  28,
  27,
  26,
  25,
  24,
  23,
  22,
  21,
  20,
  19,
  18,
  17,
  16,
  15,
  14,
  13,
  12,
  11,
  10,
  9,
  8,
  7,
  6,
  5,
  4,
  3,
  2,
  1,
];

export const mopoPoints = [
  100,
  80,
  60,
  50,
  45,
  40,
  36,
  32,
  29,
  26,
  24,
  22,
  20,
  18,
  16,
  15,
  14,
  13,
  12,
  11,
  10,
  9,
  8,
  7,
  6,
  5,
  4,
  3,
  2,
  1,
];

export const calculateStandings = (events, cup, simple, forceSkip = false) => {
  let standings = [];
  let skipStandings = [];
  const teamStandings = [];
  const nationStandings = [];
  let teamEntries = {};
  let nationEntries = {};
  let finishedEvents = 0;
  if (forceSkip) {
    finishedEvents = events.filter(
      e => parseInt(e.EndTime) < new Date().getTime() / 1000,
    ).length;
  }
  forEach(events, event => {
    teamEntries = {};
    nationEntries = {};
    forEach(event.CupTimes, (time, index) => {
      // player standings
      let existsIndex = -1;
      const exists = standings.filter((x, i) => {
        if (x.KuskiIndex === time.KuskiIndex) {
          existsIndex = i;
          return true;
        }
        return false;
      });

      const pointsDetailed = {
        Points: time.Points,
        LevelIndex: event.LevelIndex,
        Position: index + 1,
        TotalPlayers: event.CupTimes.length,
        Skipped: false,
      };

      if (exists.length === 0) {
        standings.push({
          KuskiIndex: time.KuskiIndex,
          Points: time.Points,
          Kuski: time.KuskiData.Kuski,
          KuskiData: {
            Kuski: time.KuskiData.Kuski,
            TeamIndex: time.TeamIndex,
            Country: time.KuskiData.Country,
            TeamData: time.TeamData,
          },
          Events: 1,
          AllPoints: [time.Points],
          AllPointsDetailed: [pointsDetailed],
        });
      } else {
        standings[existsIndex] = {
          ...standings[existsIndex],
          Points: standings[existsIndex].Points + time.Points,
          Events: standings[existsIndex].Events + 1,
          AllPoints: [...standings[existsIndex].AllPoints, time.Points],
          AllPointsDetailed: [
            ...standings[existsIndex].AllPointsDetailed,
            pointsDetailed,
          ],
          KuskiData: {
            Kuski: time.KuskiData.Kuski,
            TeamIndex: time.TeamIndex,
            Country: time.KuskiData.Country,
            TeamData: time.TeamData,
          },
        };
      }
      // team standings
      if (time.TeamIndex && !simple) {
        const existsTeam = teamStandings.findIndex(
          x => x.TeamIndex === time.TeamIndex,
        );
        if (existsTeam === -1) {
          teamStandings.push({
            TeamIndex: time.TeamIndex,
            Points: time.Points,
            Team: time.TeamData.Team,
          });
          teamEntries[time.TeamIndex] = 1;
        } else if (
          teamEntries[time.TeamIndex] < 3 ||
          !teamEntries[time.TeamIndex]
        ) {
          teamStandings[existsTeam] = {
            ...teamStandings[existsTeam],
            Points: teamStandings[existsTeam].Points + time.Points,
          };
          if (teamEntries[time.TeamIndex]) {
            teamEntries[time.TeamIndex] += 1;
          } else {
            teamEntries[time.TeamIndex] = 1;
          }
        }
      }
      // nation standings
      if (!simple) {
        const existsNation = nationStandings.findIndex(
          x => x.Country === time.KuskiData.Country,
        );
        if (existsNation === -1) {
          nationStandings.push({
            Country: time.KuskiData.Country,
            Points: time.Points,
          });
          nationEntries[time.KuskiData.Country] = 1;
        } else if (
          nationEntries[time.KuskiData.Country] < 3 ||
          !nationEntries[time.KuskiData.Country]
        ) {
          nationStandings[existsNation] = {
            ...nationStandings[existsNation],
            Points: nationStandings[existsNation].Points + time.Points,
          };
          if (nationEntries[time.KuskiData.Country]) {
            nationEntries[time.KuskiData.Country] += 1;
          } else {
            nationEntries[time.KuskiData.Country] = 1;
          }
        }
      }
    });
  });
  if (cup.Skips) {
    skipStandings = standings.map(s => {
      const totalEvents = forceSkip ? finishedEvents : cup.Events;
      if (s.Events <= totalEvents - cup.Skips) {
        return s;
      }
      const { AllPoints } = s;
      let { Points, AllPointsDetailed } = s;
      for (let i = 0; i < s.Events - (totalEvents - cup.Skips); i += 1) {
        const min = Math.min(...AllPoints);
        const removeIndex = AllPoints.findIndex(ap => ap === min);
        AllPoints.splice(removeIndex, 1);
        Points -= min;

        const skippedLevel = AllPointsDetailed.find(apd => apd.Points === min);
        AllPointsDetailed = AllPointsDetailed.map(apd => {
          if (apd.LevelIndex === skippedLevel.LevelIndex) {
            return { ...apd, Skipped: true };
          }
          return apd;
        });
      }
      return { ...s, AllPoints, Points, AllPointsDetailed };
    });
    standings = skipStandings;
  }
  return {
    player: standings.sort((a, b) => b.Points - a.Points),
    team: teamStandings.sort((a, b) => b.Points - a.Points),
    nation: nationStandings.sort((a, b) => b.Points - a.Points),
  };
};

export const generateEvent = (event, cup, times, cuptimes) => {
  const insertBulk = [];
  const updateBulk = [];
  // loop times and find finished runs
  forEach(times, t => {
    if (t.Finished === 'F' || (event.AppleBugs && t.Finished === 'B')) {
      if (t.Driven > event.StartTime && t.Driven < event.EndTime) {
        const exists = cuptimes.filter(
          c => c.KuskiIndex === t.KuskiIndex && c.Time === t.Time,
        );
        // update cup times if replay is uploaded
        if (exists.length > 0) {
          updateBulk.push({
            TimeIndex: t.TimeIndex,
            TimeExists: 1,
            CupTimeIndex: exists[0].CupTimeIndex,
          });
          // add to cup times if not uploaded and replay not required
        } else if (!cup.ReplayRequired) {
          insertBulk.push({
            CupIndex: event.CupIndex,
            KuskiIndex: t.KuskiIndex,
            TimeIndex: t.TimeIndex,
            Time: t.Time,
            TimeExists: 1,
            RecData: null,
          });
        }
      }
      // find apple results
    } else if (cup.AppleResults && (t.Finished === 'D' || t.Finished === 'E')) {
      if (t.Driven > event.StartTime && t.Driven < event.EndTime) {
        const exists = cuptimes.filter(
          c =>
            c.KuskiIndex === t.KuskiIndex &&
            c.Time === 9999000 + (1000 - t.Apples),
        );
        // insert only if replay uploaded
        if (exists.length > 0) {
          updateBulk.push({
            TimeIndex: t.TimeIndex,
            TimeExists: 1,
            CupTimeIndex: exists[0].CupTimeIndex,
          });
        }
      }
    }
  });
  return { insertBulk, updateBulk };
};

export const getPrivateCupRecUri = (
  CupTimeIndex,
  ShortName,
  Kuski,
  Code,
  levelNumber,
) => {
  return `${config.dlUrl}cupreplay/${CupTimeIndex}/${ShortName}${zeroPad(
    levelNumber,
    2,
  )}${Kuski.substring(0, 6)}/${Code}`;
};
