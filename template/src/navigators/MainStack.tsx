import React, { FC } from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import Home from '!/screens/Home/Home';
import { MainStackParams } from '!/types';

const Stack = createStackNavigator<MainStackParams>();

const MainStack: FC = () => {
  return (
    <Stack.Navigator headerMode='screen' initialRouteName='Home'>
      <Stack.Screen component={Home} name='Home' />
    </Stack.Navigator>
  );
};

export default MainStack;
