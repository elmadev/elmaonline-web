import { createMuiTheme } from '@material-ui/core/styles';

const pad = 4;

export const theme = {
  // colors
  primary: '#219653',
  light: '#6ddf9e',
  secondary: '#0097a7',
  linkColor: '#219653',
  pageBackground: '#f1f1f1',
  header: '#1b3a57',

  // paddings
  padXXSmall: `${pad}px`,
  padXSmall: `${pad * 1.5}px`,
  padSmall: `${pad * 2}px`,
  padMedium: `${pad * 4}px`,
  padLarge: `${pad * 6}px`,
  padXLarge: `${pad * 9}px`,
  padXXLarge: `${pad * 12}px`,

  // texts
  fontFamily: `'Segoe UI', 'HelveticaNeue-Light', sans-serif`,
  fontSize: '14px',
};

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: theme.primary,
    },
    secondary: {
      main: theme.secondary,
    },
  },
  typography: {
    useNextVariants: true,
  },
});
