import { StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import variables from '../shared/variables/variables';

type ValueColor = 'blue' | 'gray';

interface IProps {
  label: string;
  value: string | number;
  valueColor?: ValueColor; // default is blue
  fullWidth?: boolean;
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
  gray: {
    color: variables.darkGrayColor,
  },
  fullWidth: {
    width: variables.full,
  },
});

const TextGroup: React.StatelessComponent<IProps> = (props: IProps) => {
  const { label, value, valueColor, fullWidth } = props;

  const containerStyle = fullWidth
    ? {
        ...styles.container,
        ...styles.fullWidth,
      }
    : styles.container;
  const valueStyle = valueColor
    ? {
        ...styles.value,
        ...styles[valueColor],
      }
    : styles.value;

  return (
    <View style={containerStyle}>
      <Text style={styles.label}>{label}</Text>
      <Text style={valueStyle}>{value}</Text>
    </View>
  );
};

export default TextGroup;
