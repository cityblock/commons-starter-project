import { Image, StyleSheet, Text, View } from '@react-pdf/core';
import { format } from 'date-fns';
import * as React from 'react';
import BodyText from '../shared/body-text';
import HeaderText from '../shared/header-text';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

export const LOGO_PATH = `https://www.cityblock.com/static/images/cityblock_logo_blue.png`;

const styles = StyleSheet.create({
  container: {
    flexDirection: variables.flexRow,
    justifyContent: variables.flexSpaceBetween,
    alignItems: variables.flexCenter,
  },
  image: {
    height: variables.imageHeightSmall,
  },
  title: {
    color: variables.blueColor,
    fontFamily: variables.basetica,
    fontSize: variables.titleFontSize,
    height: variables.titleFontSize,
  },
  printedOn: {
    flexDirection: variables.flexColumn,
    alignItems: variables.flexEnd,
  },
});

const Header: React.StatelessComponent = () => {
  const printDate = format(Date.now(), 'MMM D, YYYY');

  return (
    <View style={styles.container} fixed>
      <Image src={LOGO_PATH} style={styles.image} />
      <Text style={styles.title}>{copy.map}</Text>
      <View style={styles.printedOn}>
        <HeaderText label={copy.printedOn} />
        <BodyText label={printDate} />
      </View>
    </View>
  );
};

export default Header;
