import { StyleSheet, Text } from '@react-pdf/core';
import * as React from 'react';
import copy from './copy/copy';
import variables from './variables/variables';

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    fontFamily: variables.roboto,
    color: variables.grayColor,
    fontSize: variables.smallFontSize,
    bottom: variables.gutter,
    left: variables.gutter,
  },
});

const Footer: React.StatelessComponent = () => {
  return <Text style={styles.footer}>{copy.cityblockInfo}</Text>;
};

export default Footer;
