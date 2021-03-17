/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useStoreState, useStoreActions } from 'easy-peasy';
import { Grid, Button } from '@material-ui/core';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import Field from 'components/Field';
import Header from 'components/Header';
import Link from 'components/Link';
import { nickId } from 'utils/nick';
import Layout from 'components/Layout';

const schema = yup.object().shape({
  CollectionName: yup
    .string()
    .required()
    .min(2)
    .max(16)
    .matches(/^[A-Za-z0-9]+$/, 'Only letters and number allowed, no spaces'),
  CollectionLongName: yup.string().required().min(2).max(50),
});

const LevelsAddCollection = () => {
  const { addSuccess } = useStoreState(state => state.LevelsAddCollection);
  const { addCollection } = useStoreActions(
    actions => actions.LevelsAddCollection,
  );
  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: values => addCollection({ ...values }),
    },
  );
  return (
    <Layout t="Add level pack collection">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Header h1>Add level pack collection</Header>
          {addSuccess === '' ? (
            <>
              {nickId() > 0 ? (
                <form {...formal.getFormProps()}>
                  <Field
                    label="Collection name"
                    {...formal.getFieldProps('CollectionName')}
                  />
                  <Field
                    label="Collection long name"
                    {...formal.getFieldProps('CollectionLongName')}
                  />
                  <Button variant="contained" onClick={() => formal.submit()}>
                    Create
                  </Button>
                </form>
              ) : (
                <div>Log in to create a level pack collection.</div>
              )}
            </>
          ) : (
            <>
              <div>
                Level pack collection{' '}
                <Link to={`/levels/collections/${addSuccess}`}>
                  {addSuccess}
                </Link>{' '}
                has been created successfully.
              </div>
            </>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default LevelsAddCollection;
