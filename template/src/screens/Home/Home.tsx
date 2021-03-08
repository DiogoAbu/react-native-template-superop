import React, { FC } from 'react';
import { FlatList, Text, View } from 'react-native';

import Separator from '!/components/Separator';

import HomeItem from './HomeItem';
import styles from './styles';

const keyExtractor = (_item: number, index: number) => index.toString();

const Home: FC = () => {
  return (
    <FlatList
      data={Array(20)}
      ItemSeparatorComponent={Separator}
      keyExtractor={keyExtractor}
      ListHeaderComponent={
        <>
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>Welcome to HelloWorld!</Text>
          </View>

          <Separator />
        </>
      }
      renderItem={(props) => <HomeItem {...props} />}
      style={styles.contentContainer}
    />
  );
};

export default Home;
