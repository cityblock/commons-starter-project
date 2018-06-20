import { StyleSheet, Text, View } from '@react-pdf/core';
import React from 'react';
import { FullPatientConcern } from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  patientConcern: FullPatientConcern;
  index: number; // do not add one
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.lightGrayColor,
    minHeight: 60,
    borderTopWidth: variables.smallBorder,
    borderTopColor: variables.darkGrayColor,
  },
  label: {
    color: variables.blueColor,
    fontFamily: variables.robotoBold,
    fontSize: variables.smallFontSize,
    textAlign: variables.flexCenter,
    marginTop: variables.extraSmallGutter,
    marginBottom: 5,
  },
  concern: {
    color: variables.blackColor,
    fontFamily: variables.basetica,
    fontSize: variables.titleFontSize,
    textAlign: variables.flexCenter,
  },
});

const Concern: React.StatelessComponent<IProps> = ({ patientConcern, index }) => {
  const concernNumber = index + 1;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{`${copy.concern} ${concernNumber}`}</Text>
      <Text style={styles.concern}>{patientConcern.concern.title}</Text>
    </View>
  );
};

export default Concern;
