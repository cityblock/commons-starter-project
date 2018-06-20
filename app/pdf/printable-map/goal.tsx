import { StyleSheet, Text, View } from '@react-pdf/core';
import React from 'react';
import { FullPatientGoal } from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  patientGoal: FullPatientGoal;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: variables.lighterGrayColor,
    borderTopWidth: variables.smallBorder,
    borderTopColor: variables.grayColor,
    borderTopStyle: variables.solid,
  },
  text: {
    fontFamily: variables.basetica,
    fontSize: variables.bodyFontSize,
    marginTop: variables.extraSmallGutter,
    marginBottom: variables.extraSmallGutter,
    color: variables.blackColor,
    textAlign: variables.flexCenter,
  },
});

const Goal: React.StatelessComponent<IProps> = ({ patientGoal }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`${copy.goal} ${patientGoal.title}`}</Text>
    </View>
  );
};

export default Goal;
