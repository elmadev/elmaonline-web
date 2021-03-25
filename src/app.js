import React from 'react';
import { StoreProvider, createStore } from 'easy-peasy';
import Router from './router';
import model from './easypeasy';

const easyPeasyStore = createStore(model);

function App() {
  return (
    <StoreProvider store={easyPeasyStore}>
      <Router />
    </StoreProvider>
  );
}

export default App;
