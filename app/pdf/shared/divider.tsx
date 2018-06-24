import { StyleSheet, View } from '@react-pdf/core';
import React from 'react';
import variables from './variables/variables';

type Color = 'lightGray' | 'darkGray';

interface IProps {
  color?: Color; // default is light gray (#ccc)
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.grayColor,
    height: variables.smallBorder,
    width: variables.full,
  },
  darkGray: {
    backgroundColor: variables.darkGrayColor,
  },
});

const Divider: React.StatelessComponent<IProps> = ({ color }) => {
  const style = !color
    ? styles.container
    : {
        ...styles.container,
        ...styles[color],
      };

  return <View style={style} />;
};

export default Divider;
