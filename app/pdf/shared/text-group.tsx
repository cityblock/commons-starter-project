import { StyleSheet, Text, View } from '@react-pdf/core';
import React from 'react';
import variables from './variables/variables';

export const STAR_PATH = `https://www.cityblock.com/static/images/care_team_lead_star.png`;

type ValueColor = 'blue' | 'gray';

interface IProps {
  label: string;
  value: string | number;
  valueColor?: ValueColor; // default is blue
  fullWidth?: boolean;
  starImage?: boolean; // if true, add star image for care team lead
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
  labelContainer: {
    flexDirection: variables.flexRow,
    justifyContent: variables.flexStart,
    alignItems: variables.flexCenter,
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
  blue: {
    color: variables.blueColor,
  },
  fullWidth: {
    width: variables.full,
  },
  image: {
    height: variables.imageIconHeight,
    marginTop: 2, // goose it a bit to make it look right
    marginLeft: 5,
  },
});

const TextGroup: React.StatelessComponent<IProps> = (props: IProps) => {
  const { label, value, valueColor, fullWidth, starImage } = props;

  const containerStyle = fullWidth
    ? {
        ...styles.container,
        ...styles.fullWidth,
      }
    : styles.container;
  const labelStyle = starImage
    ? {
        ...styles.label,
        ...styles.blue,
      }
    : styles.label;
  const valueStyle = valueColor
    ? {
        ...styles.value,
        ...styles[valueColor],
      }
    : styles.value;

  return (
    <View style={containerStyle}>
      <View style={styles.labelContainer}>
        <Text style={labelStyle}>{label}</Text>
      </View>
      <Text style={valueStyle}>{value}</Text>
    </View>
  );
};

export default TextGroup;
