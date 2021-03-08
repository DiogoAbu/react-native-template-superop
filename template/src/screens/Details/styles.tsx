import { StyleSheet } from 'react-native';

import theme from '!/services/theme';

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },

  itemText: {
    padding: theme.grid,
    color: theme.colors.text,
  },
});

export default styles;
