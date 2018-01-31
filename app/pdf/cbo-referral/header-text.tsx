import { StyleSheet, Text } from '@react-pdf/core';
import * as React from 'react';
import variables from './variables/variables';

interface IProps {
  label: string;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: variables.basetica,
    fontSize: variables.headerFontSize,
    lineHeight: variables.headerLineHeight,
    color: variables.grayColor,
  },
});

const HeaderText: React.StatelessComponent<IProps> = ({ label }) => {
  return <Text style={styles.text}>{label}</Text>;
};

export default HeaderText;
