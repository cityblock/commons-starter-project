import { StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import variables from '../shared/variables/variables';

interface IProps {
  label: string;
  value: string | number;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: variables.flexRow,
    justifyContent: variables.flexSpaceBetween,
    alignItems: variables.flexCenter,
    height: variables.mediumFontSize,
    width: 125,
    marginTop: 5,
  },
  label: {
    fontFamily: variables.roboto,
    color: variables.blackColor,
    fontSize: variables.mediumFontSize,
    height: variables.mediumFontSize,
  },
  value: {
    fontFamily: variables.roboto,
    color: variables.blueColor,
    fontSize: variables.smallFontSize,
    height: variables.smallFontSize,
  },
});

const TextGroup: React.StatelessComponent<IProps> = ({ label, value }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default TextGroup;
