import { StyleSheet, Text } from '@react-pdf/core';
import * as React from 'react';
import variables from '../shared/variables/variables';

interface IProps {
  label: string;
  noMargin?: boolean;
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
});

const BodyText: React.StatelessComponent<IProps> = ({ label, noMargin }) => {
  const style = noMargin ? styles.textNoMargin : styles.text;

  return <Text style={style}>{label}</Text>;
};

export default BodyText;
