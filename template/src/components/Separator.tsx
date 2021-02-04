import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import theme from '!/services/theme';

const Separator: FC = () => {
  return <View style={styles.line} />;
};

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.border,
  },
});

export default Separator;
