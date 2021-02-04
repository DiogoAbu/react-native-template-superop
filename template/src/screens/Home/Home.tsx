import React, { FC } from 'react';
import { FlatList, Text, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import Separator from '!/components/Separator';
import { MainNavigationProp } from '!/types';

import HomeItem from './HomeItem';
import styles from './styles';

const keyExtractor = (_item: number, index: number) => index.toString();

const Home: FC = () => {
  const navigation = useNavigation<MainNavigationProp<'Home'>>();

  return (
    <FlatList
      data={Array(20)}
      ItemSeparatorComponent={Separator}
      keyExtractor={keyExtractor}
      ListHeaderComponent={
        <>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>Welcome to Test!</Text>
          </View>

          <Separator />
        </>
      }
      renderItem={HomeItem}
      style={styles.contentContainer}
    />
  );
};

export default Home;
