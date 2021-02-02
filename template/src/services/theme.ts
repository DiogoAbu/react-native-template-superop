import { DarkTheme } from '@react-navigation/native';

const grid = 16;

const theme = {
  ...DarkTheme,
  grid,
  smallGrid: grid / 2,
  bigGrid: grid * 2,
  colors: {
    ...DarkTheme.colors,
    background: '#121212',
    card: '#262626',
    text: '#cccccc',
    border: '#393939',
  },
};

export default theme;
