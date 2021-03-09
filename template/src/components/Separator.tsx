import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@react-navigation/native';

const Separator: FC = () => {
  const { colors } = useTheme();

  return <View style={[styles.line, { backgroundColor: colors.border }]} />;
};

const styles = StyleSheet.create({
  line: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
});

export default Separator;
