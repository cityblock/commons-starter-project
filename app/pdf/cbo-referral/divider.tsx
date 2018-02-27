import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import variables from '../shared/variables/variables';

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.grayColor,
    height: variables.smallBorder,
    width: variables.full,
  },
});

const Divider: React.StatelessComponent<{}> = () => {
  return <View style={styles.container} />;
};

export default Divider;
