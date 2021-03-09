import React, { FC } from 'react';
import { StyleProp, Text as NativeText, TextStyle } from 'react-native';

import { useTheme } from '@react-navigation/native';

interface Props {
  style: StyleProp<TextStyle>;
}

const Text: FC<Props> = ({ children, style, ...rest }) => {
  const { colors } = useTheme();

  return (
    <NativeText {...rest} style={[{ color: colors.text }, style]}>
      {children}
    </NativeText>
  );
};

export default Text;
