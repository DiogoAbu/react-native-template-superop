import { StyleSheet } from 'react-native';

import theme from '!/services/theme';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.smallGrid,
    padding: theme.grid,
  },
  text: {
    color: theme.colors.text,
  },
});

export default styles;
