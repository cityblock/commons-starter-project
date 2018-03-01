import { StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import { FullPatientGoalFragment } from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  patientGoal: FullPatientGoalFragment;
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
