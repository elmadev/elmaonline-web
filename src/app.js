import React from 'react';
import { StoreProvider, createStore } from 'easy-peasy';
import { HelmetProvider } from 'react-helmet-async';
import Router from './router';
import model from './easypeasy';
import queryClient from './react-query';
import { QueryClientProvider } from 'react-query';

const easyPeasyStore = createStore(model);

function App() {
  return (
    <StoreProvider store={easyPeasyStore}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Router />
        </HelmetProvider>
      </QueryClientProvider>
    </StoreProvider>
  );
}

export default App;
