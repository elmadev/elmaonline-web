import React from 'react';
import { StoreProvider, createStore } from 'easy-peasy';
import { MuiThemeProvider } from '@material-ui/core/styles';
import Router from './router';
import model from './easypeasy';
import muiTheme from './muiTheme';

const easyPeasyStore = createStore(model);

function App() {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <StoreProvider store={easyPeasyStore}>
        <Router />
      </StoreProvider>
    </MuiThemeProvider>
  );
}

export default App;
