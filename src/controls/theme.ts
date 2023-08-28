import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    accordion: Palette['primary'];
    secondaryButton: Palette['primary'];
    primaryButton: Palette['primary'];
    deleteButton: Palette['primary'];
    cancelButton: Palette['primary'];
    logoutButton: Palette['primary'];
    calender: Palette['primary'];
    table: Palette['primary'];
    tab: Palette['primary'];
    tabNoSelect: Palette['primary'];
    contentsBox: Palette['primary'];
  }

  interface PaletteOptions {
    accordion: PaletteOptions['primary'];
    secondaryButton: PaletteOptions['primary'];
    primaryButton: PaletteOptions['primary'];
    deleteButton: PaletteOptions['primary'];
    cancelButton: PaletteOptions['primary'];
    logoutButton: PaletteOptions['primary'];
    calender: PaletteOptions['primary'];
    table: PaletteOptions['primary'];
    tab: PaletteOptions['primary'];
    tabNoSelect: PaletteOptions['primary'];
    contentsBox: PaletteOptions['primary'];
  }

  interface TypeBackground {
    disabled?: string;
  }

  interface PaletteColor {
    background?: string;
    border?: string;
    borderBottom?: string;
    boxShadow?: string;
    color?: string;
    hover?: {
      opacity?: number;
      background?: string;
      color?: string;
      border?: string;
    };
    click?: {
      opacity?: number;
      boxShadow?: string;
    };
    selectDate?: {
      backgroundColor: string;
      border: string;
    };
    header?: string;
    selected?: string;
    checked?: string;
    backgroundColor?: string;
  }

  interface SimplePaletteColorOptions {
    background?: string;
    border?: string;
    borderBottom?: string;
    boxShadow?: string;
    color?: string;
    hover?: {
      opacity?: number;
      background?: string;
      color?: string;
      border?: string;
    };
    click?: {
      opacity?: number;
      boxShadow?: string;
    };
    selectDate?: {
      backgroundColor: string;
      border: string;
    };
    header?: string;
    selected?: string;
    checked?: string;
    backgroundColor?: string;
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: ['メイリオ', 'Meiryo'].join(','),
    fontSize: 13,
    fontWeightBold: 700,
    fontWeightRegular: 400,
    body1: {
      fontSize: 13,
      lineHeight: 1,
    },
  },
  spacing: 5,
  components: {
    // ボタンの共通レイアウト
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
        sizeLarge: {
          minWidth: 150,
          height: 40,
          fontSize: 18,
          '& .MuiButton-startIcon': {
            marginRight: 10,
          },
        },
        sizeMedium: {
          minWidth: 120,
          height: 30,
          fontSize: 13,
          '& .MuiButton-startIcon': {
            marginRight: 5,
          },
        },
        sizeSmall: {
          minWidth: 95,
          height: 40,
          fontSize: 13,
        },
      },
    },
    // テキストフィールドの共通レイアウト
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          height: 30,
          padding: 0,
          borderColor: '#bbbbbb',
          minWidth: 180,
          maxWidth: 1550,
          background: '#ffffff',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          borderColor: '#bbbbbb',
        },
        input: {
          padding: '0 0 0 8px',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        underline: {
          borderBottomColor: '#ececec',
          '&:after': {
            borderBottomColor: '#f37246',
          },
          '&:before': {
            borderBottomColor: '#ececec',
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0,
          marginTop: 5,
          backgroundColor: 'transparent',
        },
      },
    },
    // TreeViewの共通レイアウト
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          margin: 0,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexGrow: 1,
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    // ページネーションの共通レイアウト
    MuiPagination: {
      styleOverrides: {
        root: {
          margin: 10,
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': { backgroundColor: '#00ddc4', color: '#ffffff' },
        },
      },
    },
    // チェックボックスの共通レイアウト
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: 10,
          '&.Mui-checked': { color: '#0075ff', borderColor: '#bbbbbb' },
          '&.Mui-disabled': { color: '#aaaaaa' },
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#01946a',
      light: '#0fa77c',
    },
    secondary: {
      main: '#85dbc3',
    },
    accordion: {
      main: '',
      backgroundColor: '#009568',
      color: '#ffffff',
      selected: '#eeeeee',
      borderBottom: '1px solid #00a97b',
      hover: {
        background: '#00a97b',
        color: '#ffffff',
        border: '',
      },
    },
    text: {
      primary: '#000000',
    },
    success: {
      main: '#2e7d32',
    },
    warning: {
      main: '#c86800',
      light: '#fde8d4',
    },
    error: {
      main: '#aa0000',
      light: '#f5dfdf',
    },
    background: {
      default: '#f5f5f5',
      disabled: '#dddddd',
      paper: '#ffffff',
    },
    calender: {
      main: '',
      background: '#A5DBC3',
      color: '#ffffff',
      selectDate: {
        backgroundColor: '#ffeae3',
        border: '1px solid #ff7341',
      },
    },
    contentsBox: {
      main: '#0fa77c',
    },
    primaryButton: {
      main: '',
      background: 'linear-gradient(to top,#65dfcd,#d1eff1)',
      border: '1px solid #3bbba8',
      boxShadow: '0px 3px 3px rgba(0,0,0,0.3)',
      color: '#008c64',
      hover: {
        opacity: 0.5,
      },
      click: {
        opacity: 0.5,
        boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      },
    },
    secondaryButton: {
      main: '',
      background: 'linear-gradient(to top,#dc3d36,#ff6a39)',
      border: '1px solid #de3f07',
      boxShadow: '0px 3px 3px rgba(0,0,0,0.3)',
      color: '#ffffff',
      hover: {
        opacity: 0.5,
      },
      click: {
        opacity: 0.5,
        boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      },
    },
    deleteButton: {
      main: '',
      background: 'linear-gradient(to top,#6d0000,#c40000)',
      border: '1px solid #7f0000',
      boxShadow: '0px 3px 3px rgba(0,0,0,0.3)',
      color: '#ffffff',
      hover: {
        opacity: 0.5,
      },
      click: {
        opacity: 0.5,
        boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      },
    },
    cancelButton: {
      main: '',
      background: 'linear-gradient(to top,#42544f,#79988f)',
      border: '1px solid #515a57',
      boxShadow: '0px 3px 3px rgba(0,0,0,0.3)',
      color: '#ffffff',
      hover: {
        opacity: 0.5,
      },
      click: {
        opacity: 0.5,
        boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      },
    },
    logoutButton: {
      main: '',
      background: 'linear-gradient(to top,#555555,#888888)',
      border: '1px solid #555555',
      boxShadow: '0px 3px 3px rgba(0,0,0,0.3)',
      color: '#ffffff',
      hover: {
        opacity: 0.5,
      },
      click: {
        opacity: 0.5,
        boxShadow: '0px 0px 0px rgba(0,0,0,0)',
      },
    },
    table: {
      main: '',
      header: '#cccccc',
      background: '#eeeeee',
      selected: '#d6ebe5',
      checked: '#b9e7da',
    },
    tab: {
      main: '',
      background: 'linear-gradient(to top,#85dbc3,#e7f1f7)',
      color: '#008c64 !important',
      border: '#73baa7',
      hover: {
        opacity: 0.5,
      },
    },
    tabNoSelect: {
      main: '',
      background: 'linear-gradient(to top,#777777,#999999)',
      color: '#ffffff !important',
      border: '1px solid #777777',
      hover: {
        opacity: 0.5,
      },
    },
  },
});
