import { Image, StyleSheet, Text, View } from '@react-pdf/core';
import { format } from 'date-fns';
import * as React from 'react';
import BodyText from '../shared/body-text';
import HeaderText from '../shared/header-text';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

export const LOGO_PATH = `https://www.cityblock.com/static/images/cityblock_logo_blue.png`;

interface IProps {
  title: string;
}

const styles = StyleSheet.create({
  border: {
    backgroundColor: variables.blueColor,
    height: variables.bigBorder,
    marginBottom: variables.mediumGutter,
  },
  main: {
    flexDirection: variables.flexRow,
    justifyContent: variables.flexSpaceBetween,
    alignItems: variables.flexCenter,
    paddingBottom: variables.mediumGutter,
    paddingRight: variables.smallGutter,
    paddingLeft: variables.smallGutter,
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
    minWidth: 65,
  },
});

const Header: React.StatelessComponent<IProps> = (props: IProps) => {
  const printDate = format(Date.now(), 'MMM D, YYYY');

  return (
    <View fixed>
      <View style={styles.border} fixed />
      <View style={styles.main} fixed>
        <Image src={LOGO_PATH} style={styles.image} fixed />
        <Text style={styles.title} fixed>
          {props.title}
        </Text>
        <View style={styles.printedOn} fixed>
          <HeaderText label={copy.printedOn} />
          <BodyText label={printDate} />
        </View>
      </View>
    </View>
  );
};

export default Header;
