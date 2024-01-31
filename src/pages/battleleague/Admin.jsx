import React, { useState } from 'react';
import styled from 'styled-components';
import { Paper } from 'components/Paper';
import Header from 'components/Header';
import { Grid, Button } from '@material-ui/core';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import Field from 'components/Field';
import Kuski from 'components/Kuski';
import FieldAutoComplete from 'components/FieldAutoComplete';
import ClickToEdit from 'components/ClickToEdit';
import { Dropdown, TextField } from 'components/Inputs';
import LocalTime from 'components/LocalTime';
import { BATTLETYPES_LONG } from 'constants/ranking';
import Loading from 'components/Loading';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { ListRow, ListCell } from 'components/List';
import DerpTable from 'components/Table/DerpTable';

const schema = yup.object().shape({
  LevelName: yup.string().required().max(8),
  Season: yup.string().max(15),
  Designer: yup.string().max(15),
  StartDate: yup.date(),
  StartHour: yup.number().min(0).max(23),
});

const battleTypes = Object.keys(BATTLETYPES_LONG).map(short => {
  return { id: short, name: BATTLETYPES_LONG[short] };
});

const Admin = ({ BattleLeagueIndex }) => {
  const [type, setType] = useState('NM');
  const [addSeason, setAddSeason] = useState('');
  const [selectedBattle, setSelectedBattle] = useState(0);
  const {
    battleList,
    league: { loading, data },
  } = useStoreState(state => state.BattleLeague);
  const {
    league: { create, update, remove },
    findBattles,
  } = useStoreActions(actions => actions.BattleLeague);

  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: values =>
        create({ ...values, BattleLeagueIndex, BattleType: type }),
    },
  );

  const addExisting = () => {
    create({
      BattleIndex: selectedBattle,
      Season: addSeason,
      BattleLeagueIndex,
    });
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          {loading ? (
            <Loading />
          ) : (
            <Paper padding>
              <Header h2>Add upcoming battle</Header>
              <form {...formal.getFormProps()}>
                <Field
                  label="Level Name"
                  {...formal.getFieldProps('LevelName')}
                />
                <Field label="Season" {...formal.getFieldProps('Season')} />
                <Dropdown
                  name="Battle Type"
                  options={battleTypes}
                  selected={type}
                  update={v => setType(v)}
                />
                <Field label="Designer" {...formal.getFieldProps('Designer')} />
                <Field
                  label="Start Date"
                  {...formal.getFieldProps('StartDate')}
                  date
                />
                <Field
                  label="Start Hour"
                  {...formal.getFieldProps('StartHour')}
                />
                <Button variant="contained" onClick={() => formal.submit()}>
                  Add
                </Button>
              </form>
            </Paper>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {!loading && (
            <Paper padding>
              <Header h2>Add existing battle</Header>
              <FieldAutoComplete
                label="Level"
                list={battleList}
                getOptions={v => findBattles(v)}
                valueSelected={v => setSelectedBattle(v)}
              />
              <TextField
                name="Season"
                value={addSeason}
                onChange={t => setAddSeason(t)}
              />
              <Button variant="contained" onClick={() => addExisting()}>
                Add
              </Button>
            </Paper>
          )}
          <Paper padding top>
            <Header h2>Add upcoming battle</Header>
            <ol>
              <li>
                To add an upcoming battle use the "Add upcoming battle" form on
                the left.
              </li>
              <li>
                Only Level Name is required, and only Level Name has to match
                exactly with the upcoming battle. The rest is just to give the
                player more information.
              </li>
            </ol>
            <Header h2>Add existing battle</Header>
            <ol>
              <li>
                To add a battle that's already ended, use the "Add existing
                battle" above.
              </li>
              <li>Search for level name and press Enter.</li>
              <li>Pick a battle from the dropdown.</li>
              <li>Type in season if you use seasons.</li>
            </ol>
            <Header h2>Editing battle</Header>
            <ol>
              <li>
                If you made a mistake adding a battle, such as typing wrong
                level name, just delete the battle below and add it again.
              </li>
              <li>
                To edit season for a battle you can click the season below and
                type in a new one.
              </li>
              <li>
                Standings will be updated on the fly as you add and remove
                battles, so you can always make changes after the fact.
              </li>
            </ol>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Paper padding top>
            <Header h2>Events</Header>
            <DerpTable
              headers={['Level', 'Start', 'Designer', 'Season', 'Delete']}
            >
              {data.Battles.map(e => (
                <ListRow hover key={e.BattleLeagueBattleIndex}>
                  <ListCell>
                    {e.BattleData
                      ? e.BattleData.LevelData.LevelName
                      : e.LevelName}
                  </ListCell>
                  <ListCell>
                    <LocalTime
                      date={e.Started}
                      format="ddd D MMM YYYY HH:mm"
                      parse="X"
                    />
                  </ListCell>
                  <ListCell>
                    <Kuski
                      kuskiData={
                        e.BattleData ? e.BattleData.KuskiData : e.DesignerData
                      }
                    />
                  </ListCell>
                  <ListCell>
                    <ClickToEdit
                      value={e.Season}
                      allowEmpty
                      update={v =>
                        update({
                          BattleLeagueBattleIndex: e.BattleLeagueBattleIndex,
                          Season: v,
                        })
                      }
                    >
                      {e.Season ? e.Season : 'None'}
                    </ClickToEdit>
                  </ListCell>
                  <ListCell>
                    <Button
                      variant="contained"
                      onClick={() => remove(e.BattleLeagueBattleIndex)}
                    >
                      Delete
                    </Button>
                  </ListCell>
                </ListRow>
              ))}
            </DerpTable>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

const Container = styled.div`
  padding: 8px;
`;

export default Admin;
