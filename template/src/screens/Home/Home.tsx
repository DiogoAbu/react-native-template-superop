import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { MainNavigationProp } from '!/types';

import styles from './styles';

const Home: FC = () => {
  const navigation = useNavigation<MainNavigationProp<'Home'>>();

  return (
    <View style={styles.content}>
      <Text style={styles.text}>Welcome to HelloWorld!</Text>
    </View>
  );
};

export default Home;
