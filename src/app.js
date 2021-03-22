import React from 'react';
import { StoreProvider, createStore } from 'easy-peasy';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider } from 'styled-components';
import Router from './router';
import model from './easypeasy';
import { theme, muiTheme } from './theme';

const easyPeasyStore = createStore(model);

function App() {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeProvider theme={theme}>
        <StoreProvider store={easyPeasyStore}>
          <Router />
        </StoreProvider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
