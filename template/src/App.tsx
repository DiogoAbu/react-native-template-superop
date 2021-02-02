import React, { FC } from 'react';

import { NavigationContainer } from '@react-navigation/native';

import MainStack from './navigators/MainStack';
import theme from './services/theme';
import setStatusBarStyle from './utils/set-status-bar-style';

setStatusBarStyle();

const App: FC = () => {
  return (
    <NavigationContainer theme={theme}>
      <MainStack />
    </NavigationContainer>
  );
};

export default App;
