import { unstable_createMuiStrictModeTheme as createMuiTheme } from '@material-ui/core/styles';

const pad = 4;

const lineColors = [
  '#e6194b', // red
  '#3cb44b', // green
  '#4363d8', // blue
  '#f58231', // orange
  '#911eb4', // purple
  '#46f0f0', // cyan
  '#f032e6', // magenta
  '#bcf60c', // lime
  '#fabebe', // pink
  '#008080', // teal
  '#e6beff', // lavender
  '#9a6324', // brown
  '#800000', // maroon
  '#808000', // olive
  '#000075', // navy
  '#808080', // grey
  '#2979ff', // vivid blue
];
const darkLineColors = [
  '#ff5252', // bright red
  '#40c4ff', // light blue
  '#ffd740', // yellow
  '#69f0ae', // light green
  '#ff4081', // pink
  '#7c4dff', // purple
  '#18ffff', // cyan
  '#ffe082', // light yellow
  '#b388ff', // lavender
  '#00e676', // green
  '#ffab40', // orange
  '#fff176', // lemon
  '#f50057', // magenta
  '#00b8d4', // teal
  '#ff6d00', // deep orange
  '#64dd17', // lime
  '#00e5ff', // aqua
];

const elmaGreenLight = {
  name: 'Elma Green (Light)',
  // colors
  type: 'light',
  primary: '#219653',
  primaryLight: '#2ed175',
  primaryDark: '#17693a',
  primaryAlpha: 'rgba(33, 150, 83, 0.1)',
  primaryAlpha3: 'rgba(33, 150, 83, 0.3)',
  secondary: '#0097a7',
  secondaryLight: '#00cfe6',
  secondaryDark: '#005c66',
  linkColor: '#219653',
  linkHover: '#2ed175',
  pageBackground: '#f1f1f1',
  pageBackgroundDark: '#c4c4c4',
  paperBackground: 'white',
  headerColor: '#1b3a57',
  hoverColor: '#ededed',
  selectedColor: '#f5f5f5',
  highlightColor: '#dddddd',
  borderColor: '#e2e3e4',
  errorColor: '#a20e2f',
  lineColors,

  // battles
  ongoing: '#bae1ff',
  inqueue: '#baffc9',
  aborted: '#ffb3ba',

  // paddings
  padXXSmall: `${pad}px`, // 4px
  padXSmall: `${pad * 1.5}px`, // 6px
  padSmall: `${pad * 2}px`, // 8px
  padMedium: `${pad * 4}px`, // 16px
  padLarge: `${pad * 6}px`, // 24px
  padXLarge: `${pad * 9}px`, // 36px
  padXXLarge: `${pad * 12}px`, // 48px

  // texts
  fontFamily: `'Segoe UI', 'HelveticaNeue-Light', sans-serif`,
  fontSize: '1em',
  smallFont: '14px',
  fontColor: '#222',
  lightTextColor: '#767676',
  buttonFontColor: '#fff',
};

const powerPinkDark = {
  ...elmaGreenLight,
  name: 'Power Pink (Dark)',
  // colors
  type: 'dark',
  primary: '#d81b60',
  primaryLight: '#ff5c8d',
  primaryDark: '#a00037',
  primaryAlpha: 'rgba(216, 27, 96, 0.1)',
  primaryAlpha3: 'rgba(216, 27, 96, 0.3)',
  secondary: '#0097a7',
  secondaryLight: '#00cfe6',
  secondaryDark: '#005c66',
  linkColor: '#ff5c8d',
  linkHover: '#ff80a6',
  pageBackground: '#263238',
  pageBackgroundDark: '#151b1e',
  paperBackground: '#102027',
  headerColor: '#fafafa',
  selectedColor: '#34444c',
  highlightColor: '#1d3d49',
  hoverColor: '#0C191E',
  borderColor: '#37474f',
  errorColor: '#b0ffbf',
  lineColors: darkLineColors,

  //battles
  ongoing: 'rgba(186, 225, 255, .2)',
  inqueue: 'rgba(186, 255, 201, .2)',
  aborted: 'rgba(255, 179, 186, .2)',

  // texts
  fontColor: 'white',
  lightTextColor: '#bfbfbf',
};

const oceanBlueDark = {
  ...powerPinkDark,
  name: 'Ocean Blue (Dark)',
  // colors
  primary: '#1976d2',
  primaryLight: '#63a4ff',
  primaryDark: '#004ba0',
  primaryAlpha: 'rgba(25, 118, 210, 0.1)',
  primaryAlpha3: 'rgba(25, 118, 210, 0.3)',
  secondary: '#f57c00',
  secondaryLight: '#ffad42',
  secondaryDark: '#bb4d00',
  linkColor: '#63a4ff',
  errorColor: '#e97dc3',
};

const oceanBlueLight = {
  ...elmaGreenLight,
  name: 'Ocean Blue (Light)',
  // colors
  primary: '#0d47a1',
  primaryLight: '#5472d3',
  primaryDark: '#002171',
  primaryAlpha: 'rgba(13, 71, 161, 0.1)',
  primaryAlpha3: 'rgba(13, 71, 161, 0.3)',
  secondary: '#f57c00',
  secondaryLight: '#ffad42',
  secondaryDark: '#bb4d00',
  linkColor: '#5472d3',
};

const themes = [elmaGreenLight, oceanBlueLight, powerPinkDark, oceanBlueDark];

const previews = [
  'https://up.elma.online/u/w77aszpiki/ElmaGreenLight.png',
  'https://up.elma.online/u/84rwrjqcwe/OceanBlueLight.png',
  'https://up.elma.online/u/6zocp6lq8n/PowerPinkDark.png',
  'https://up.elma.online/u/8nm2weck7p/OceanBlueDark.png',
];

const muiTheme = themeId =>
  createMuiTheme({
    palette: {
      type: themes[themeId].type,
      primary: {
        light: themes[themeId].primaryLight,
        main: themes[themeId].primary,
        dark: themes[themeId].primaryDark,
        contrastText: themes[themeId].buttonFontColor,
      },
      secondary: {
        main: themes[themeId].secondary,
      },
    },
    typography: {
      useNextVariants: true,
    },
    overrides: {
      MuiPaper: {
        root: {
          backgroundColor: themes[themeId].paperBackground,
          color: themes[themeId].fontColor,
        },
      },
      MuiButton: {
        root: {
          color: themes[themeId].fontColor,
        },
      },
      MuiTablePagination: {
        root: {
          color: themes[themeId].fontColor,
        },
      },
      MuiSelect: {
        icon: {
          color: themes[themeId].lightTextColor,
        },
      },
      MuiMenuItem: {
        root: {
          color: themes[themeId].linkColor,
        },
      },
      MuiChip: {
        root: {
          color: themes[themeId].lightTextColor,
        },
        outlined: {
          border: `1px solid ${themes[themeId].lightTextColor}`,
        },
      },
      MuiCheckbox: {
        root: {
          color: 'inherit',
        },
      },
    },
  });

export { muiTheme, themes, previews };
