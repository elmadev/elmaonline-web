/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import useFormal from '@kevinwolf/formal-web';
import * as yup from 'yup';
import { useStoreActions } from 'easy-peasy';
import { Button, Container, Box } from '@material-ui/core';
import Field from 'components/Field';
import { useNavigate } from '@reach/router';
import MuiAlert from '@material-ui/lab/Alert';
import Link from 'components/Link';
import Layout from 'components/Layout';

const defaultStr = yup.string().default('');

const schema = yup.object().shape({
  kuski: defaultStr.required(),
  password: defaultStr.required(),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useStoreActions(actions => actions.Login);
  const [error, setError] = useState(null);

  const onLoginClick = useCallback(
    values =>
      login({ ...values }).then(
        () => {
          navigate('/');
        },
        errorMsg => {
          setError(errorMsg);
        },
      ),
    [login],
  );

  const formal = useFormal(
    {},
    {
      schema,
      onSubmit: values => onLoginClick(values),
    },
  );

  const onEnter = e => {
    if (e.key === 'Enter') {
      formal.submit();
    }
  };

  return (
    <Layout t="Log in">
      <Container maxWidth="sm">
        {error && (
          <Box py={2}>
            <MuiAlert elevation={6} variant="filled" severity="error">
              {error}
            </MuiAlert>
          </Box>
        )}
        <form {...formal.getFormProps()}>
          <Field
            label="Kuski"
            onKeyPress={e => onEnter(e)}
            {...formal.getFieldProps('kuski')}
          />
          <Field
            label="Password"
            type="password"
            onKeyPress={e => onEnter(e)}
            {...formal.getFieldProps('password')}
          />
          <Box py={2}>
            <Link to="/forgot">Forgot password?</Link>
          </Box>
          <Button variant="contained" fullWidth onClick={() => formal.submit()}>
            Login
          </Button>
        </form>
        <Box py={3}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </Box>
      </Container>
    </Layout>
  );
}
