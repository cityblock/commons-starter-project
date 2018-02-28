import { StyleSheet, Text } from '@react-pdf/core';
import * as React from 'react';
import variables from '../shared/variables/variables';

interface IProps {
  label: string;
  noMargin?: boolean;
  small?: boolean; // sets font size to smaller
}

const styles = StyleSheet.create({
  text: {
    fontFamily: variables.roboto,
    fontSize: variables.bodyFontSize,
    lineHeight: variables.bodyLineHeight,
    color: variables.blackColor,
    marginTop: variables.bodyMarginTop,
  },
  textNoMargin: {
    fontFamily: variables.roboto,
    fontSize: variables.bodyFontSize,
    lineHeight: variables.bodyLineHeight,
    color: variables.blackColor,
  },
  small: {
    fontSize: variables.smallFontSize,
  },
});

const BodyText: React.StatelessComponent<IProps> = ({ label, noMargin, small }) => {
  let style = noMargin ? styles.textNoMargin : styles.text;
  if (small) style = { ...style, ...styles.small };

  return <Text style={style}>{label}</Text>;
};

export default BodyText;
