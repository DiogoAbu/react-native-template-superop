import React, { FC } from 'react';
import { ScrollView, Text } from 'react-native';

import { useRoute } from '@react-navigation/core';

import { MainRouteProp } from '!/types';

import styles from './styles';

const Details: FC = () => {
  const { params } = useRoute<MainRouteProp<'Details'>>();

  return (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.itemText}>Index #{params.index}</Text>
    </ScrollView>
  );
};

export default Details;
