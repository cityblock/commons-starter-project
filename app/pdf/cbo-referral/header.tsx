import { Image, StyleSheet, View } from '@react-pdf/core';
import { format } from 'date-fns';
import * as React from 'react';
import variables from '../shared/variables/variables';
import BodyText from './body-text';
import copy from './copy/copy';
import HeaderText from './header-text';

// TODO: Replace with our hosted path to image
export const LOGO_PATH = `https://www.cityblock.com/static/images/cityblock_logo_blue.png`;

interface IProps {
  referredOn: string | null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: variables.flexRow,
    justifyContent: variables.flexSpaceBetween,
  },
  image: {
    height: variables.imageHeight,
  },
  referredOn: {
    flexDirection: variables.flexColumn,
    alignItems: variables.flexEnd,
  },
});

const Header: React.StatelessComponent<IProps> = ({ referredOn }) => {
  const referredOnDate = format(referredOn || new Date().toISOString(), 'MMM D, YYYY');

  return (
    <View style={styles.container}>
      <Image src={LOGO_PATH} style={styles.image} />
      <View style={styles.referredOn}>
        <HeaderText label={copy.referredOn} />
        <BodyText label={referredOnDate} noMargin={true} />
      </View>
    </View>
  );
};

export default Header;
