import React, { useEffect } from 'react';
import { StoreProvider, createStore } from 'easy-peasy';
import { HelmetProvider } from 'react-helmet-async';
import Router from './router';
import model from './easypeasy';
import { queryClient } from './react-query';
import { QueryClientProvider } from 'react-query';
import Hotjar from '@hotjar/browser';
import config from 'config';

const easyPeasyStore = createStore(model, {
  version: 2,
});

function App() {
  useEffect(() => {
    if (config.hotJarId) {
      Hotjar.init(config.hotJarId, 6);
    }
  }, []);
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
