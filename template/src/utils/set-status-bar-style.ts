import { Platform, StatusBar } from 'react-native';

import changeNavigationBarColor from 'react-native-navigation-bar-color';

import theme from '!/services/theme';

export default function setStatusBarStyle(): void {
  if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(theme.colors.card);
  }
  StatusBar.setBarStyle(theme.dark ? 'light-content' : 'dark-content');

  changeNavigationBarColor(theme.colors.card, !theme.dark, false);
}
