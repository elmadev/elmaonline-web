import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@material-ui/core';
import { ListRow, ListCell, ListContainer, ListHeader } from 'components/List';
import { useStoreState, useStoreActions } from 'easy-peasy';
import Header from 'components/Header';
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons';
import styled from 'styled-components';
import Field from 'components/Field';
import FieldBoolean from 'components/FieldBoolean';
import { Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const initialForm = { Name: '', Hidden: false };

export default function Admin() {
  const [form, setForm] = useState(initialForm);
  const { tags, error } = useStoreState(state => state.Replays);
  const { getTags, addTag, updateTag, deleteTag, setError } = useStoreActions(
    actions => actions.Replays,
  );
  useEffect(() => {
    getTags();
  }, []);

  const handleSubmit = async () => {
    if (form.TagIndex) {
      await updateTag(form);
    } else {
      await addTag(form);
    }

    if (!error) {
      setForm(initialForm);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setError(null);
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={6}>
        <Box p={2} maxHeight={500} overflow="auto">
          <Header h3>Tags</Header>
          <ListContainer>
            <ListHeader>
              <ListCell width={100}>TagIndex</ListCell>
              <ListCell width={300}>Name</ListCell>
              <ListCell width={100}>Hidden</ListCell>
              <ListCell>Edit</ListCell>
              <ListCell>Delete</ListCell>
            </ListHeader>
            {tags.map(tag => (
              <ListRow key={tag.TagIndex}>
                <ListCell>{tag.TagIndex}</ListCell>
                <ListCell>{tag.Name}</ListCell>
                <ListCell>{tag.Hidden ? 'Yes' : 'No'}</ListCell>
                <ListCell>
                  <Edit onClick={() => setForm(tag)} />
                </ListCell>
                <ListCell>
                  <Delete onClick={() => deleteTag(tag.TagIndex)} />
                </ListCell>
              </ListRow>
            ))}
          </ListContainer>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Box p={2}>
          <Header h3>{form.TagIndex ? 'Update ' : 'Add '}tag</Header>
          <form>
            <Field
              label="Name"
              value={form.Name}
              onChange={ev => setForm({ ...form, Name: ev.target.value })}
            />
            <FieldBoolean
              label="Hidden"
              value={Boolean(form.Hidden)}
              onChange={() => setForm({ ...form, Hidden: !form.Hidden })}
            />
            <Button
              variant="contained"
              disabled={!form.Name}
              onClick={handleSubmit}
              style={{ marginRight: '10px' }}
            >
              {!form.TagIndex ? 'Create' : 'Update'}
            </Button>
            <Button variant="contained" onClick={handleReset}>
              Reset
            </Button>
            {error && (
              <Alert severity="error" style={{ marginTop: '10px' }}>
                {error}
              </Alert>
            )}
          </form>
        </Box>
      </Grid>
    </Grid>
  );
}

const Delete = styled(DeleteIcon)`
  cursor: pointer;
`;

const Edit = styled(EditIcon)`
  cursor: pointer;
`;
