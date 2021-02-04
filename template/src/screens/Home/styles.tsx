import { StyleSheet } from 'react-native';

import theme from '!/services/theme';

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },

  headerContent: {
    margin: theme.smallGrid,
    padding: theme.grid,
  },
  headerText: {
    color: theme.colors.text,
    textAlign: 'center',
  },

  itemText: {
    padding: theme.grid,
    color: theme.colors.text,
  },
});

export default styles;
