import { StyleSheet, View } from '@react-pdf/core';
import React from 'react';
import BodyText from '../shared/body-text';
import HeaderText from '../shared/header-text';
import variables from '../shared/variables/variables';

interface IProps {
  headerLabel: string;
  bodyLabel: string;
  size?: 'medium' | 'large';
}

const styles = StyleSheet.create({
  container: {
    flexDirection: variables.flexColumn,
    justifyContent: variables.flexCenter,
    minWidth: variables.oneThird,
  },
  containerMedium: {
    flexDirection: variables.flexColumn,
    justifyContent: variables.flexCenter,
    minWidth: variables.twoThirds,
  },
  containerLarge: {
    flexDirection: variables.flexColumn,
    justifyContent: variables.flexCenter,
    minWidth: variables.full,
  },
});

const Header: React.StatelessComponent<IProps> = (props: IProps) => {
  const { headerLabel, bodyLabel, size } = props;

  let style = styles.container;
  if (size) style = size === 'medium' ? styles.containerMedium : styles.containerLarge;

  return (
    <View style={style}>
      <HeaderText label={headerLabel} />
      <BodyText label={bodyLabel} />
    </View>
  );
};

export default Header;
