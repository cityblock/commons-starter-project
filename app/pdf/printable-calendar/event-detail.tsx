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
    justifyContent: variables.flexStart,
    alignItems: 'top',
    height: variables.mediumFontSize,
    width: variables.full,
    marginTop: variables.extraSmallGutter,
  },
  label: {
    fontFamily: variables.robotoBold,
    color: variables.darkGrayColor,
    fontSize: variables.smallFontSize,
    height: variables.smallFontSize,
    width: 60,
  },
  value: {
    fontFamily: variables.roboto,
    color: variables.darkGrayColor,
    fontSize: variables.smallFontSize,
    height: variables.smallFontSize,
  },
});

const EventDetail: React.StatelessComponent<IProps> = (props: IProps) => {
  const { label, value } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default EventDetail;
