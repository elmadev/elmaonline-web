import React from 'react';
import styled from 'styled-components';
import Time from 'components/Time';
import Kuski from 'components/Kuski';
import DerpTable from 'components/Table/DerpTable';
import { zeroPad } from 'utils/time';
import { useNavigate } from "@reach/router";
import { ListRow, ListCell } from 'components/List';

const CupResults = props => {
  const navigate = useNavigate();
  const { results, ShortName, eventNo, CupIndex } = props;

  const goToReplay = (index, filename) => {
    navigate(`/r/cup/${index}/${filename}`);
  };

  return (
    <Container>
      <DerpTable
        headers={[
          '#',
          'Player',
          'Time/Rec',
          { t: 'Points', r: true, w: 'auto' },
        ]}
        length={results.length}
      >
        {results.map((r, no) => (
          <ListRow
            key={r.KuskiIndex}
            onClick={() => {
              goToReplay(
                r.CupTimeIndex,
                `${ShortName}${zeroPad(
                  eventNo,
                  2,
                )}${r.KuskiData.Kuski.substring(0, 6)}`,
              );
            }}
          >
            <ListCell>{no + 1}.</ListCell>
            <ListCell>
              <Kuski kuskiData={r.KuskiData} team flag />
            </ListCell>
            <ListCell>
              {r.Replay ? (
                <a
                  href={`/dl/cupreplay/${r.CupTimeIndex}/${ShortName}${zeroPad(
                    eventNo,
                    2,
                  )}${r.KuskiData.Kuski.substring(0, 6)}`}
                  onClick={e => e.stopPropagation()}
                >
                  <Time time={r.Time} apples={-1} />
                </a>
              ) : (
                <Time time={r.Time} apples={-1} />
              )}
            </ListCell>
            <ListCell right>
              {r.Points} point{r.Points > 1 ? 's' : ''}
            </ListCell>
          </ListRow>
        ))}
      </DerpTable>
      <Download>
        {results.length > 0 && (
          <Dl
            href={`/dl/eventrecs/${CupIndex}/${ShortName}${zeroPad(
              eventNo,
              2,
            )}`}
          >
            All replays
          </Dl>
        )}
      </Download>
    </Container>
  );
};

const Download = styled.div`
  display: flex;
  justify-content: flex-end;
  min-height: 42px;
`;

const Dl = styled.a`
  margin-top: 4px;
  margin-right: 4px;
  margin-bottom: 16px;
`;

const Container = styled.div``;

export default CupResults;
