import { createMuiTheme } from '@material-ui/core/styles';

const pad = 4;

const elmaGreen = {
  // colors
  primary: '#219653',
  primaryLight: '#2ed175',
  primaryDark: '#17693a',
  primaryAlpha: 'rgba(33, 150, 83, 0.1)',
  primaryAlpha3: 'rgba(33, 150, 83, 0.3)',
  secondary: '#0097a7',
  secondaryLight: '#00cfe6',
  secondaryDark: '#005c66',
  linkColor: '#219653',
  pageBackground: '#f1f1f1',
  paperBackground: 'white',
  headerColor: '#1b3a57',
  hoverColor: '#ededed',
  selectedColor: '#f5f5f5',
  highlightColor: '#dddddd',
  borderColor: '#e2e3e4',

  // battles
  ongoing: '#bae1ff',
  inqueue: '#baffc9',
  aborted: '#ffb3ba',

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
  fontSize: '1em',
  fontColor: '#222',
  lightTextColor: '#767676',
};

const powerPink = {
  ...elmaGreen,
  // colors
  primary: '#d81b60',
  primaryLight: '#ff5c8d',
  primaryDark: '#a00037',
  primaryAlpha: 'rgba(216, 27, 96, 0.1)',
  primaryAlpha3: 'rgba(216, 27, 96, 0.3)',
  secondary: '#0097a7',
  secondaryLight: '#00cfe6',
  secondaryDark: '#005c66',
  linkColor: '#ff5c8d',
  pageBackground: '#263238',
  paperBackground: '#102027',
  headerColor: '#fafafa',
  selectedColor: '#34444c',
  hoverColor: '#263238',
  borderColor: '#37474f',

  //battles
  ongoing: 'rgba(186, 225, 255, .2)',
  inqueue: 'rgba(186, 255, 201, .2)',
  aborted: 'rgba(255, 179, 186, .2)',

  // texts
  fontColor: 'white',
  lightTextColor: '#bfbfbf',
};

const theme = powerPink;

const muiTheme = createMuiTheme({
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
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: theme.paperBackground,
      },
    },
    MuiButton: {
      root: {
        color: theme.fontColor,
      },
    },
  },
});

export { theme, muiTheme };
