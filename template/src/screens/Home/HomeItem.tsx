import React from 'react';
import { ListRenderItem, Text } from 'react-native';

import styles from './styles';

const HomeItem: ListRenderItem<number> = ({ index }) => {
  return <Text style={styles.itemText}>#{index}</Text>;
};

export default HomeItem;
