import React from 'react';
import { StoreProvider, createStore } from 'easy-peasy';
import Layout from 'components/Layout';
import Router from './router';
import model from './easypeasy';

const easyPeasyStore = createStore(model);

function App() {
  return (
    <StoreProvider store={easyPeasyStore}>
      <Layout>
        <Router />
      </Layout>
    </StoreProvider>
  );
}

export default App;
