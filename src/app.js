import React from 'react';
import { StoreProvider, createStore } from 'easy-peasy';
import { HelmetProvider } from 'react-helmet-async';
import Router from './router';
import model from './easypeasy';

const easyPeasyStore = createStore(model);

function App() {
  return (
    <StoreProvider store={easyPeasyStore}>
      <HelmetProvider>
        <Router />
      </HelmetProvider>
    </StoreProvider>
  );
}

export default App;
