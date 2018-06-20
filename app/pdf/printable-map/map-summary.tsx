import { StyleSheet, View } from '@react-pdf/core';
import React from 'react';
import { FullPatientConcern } from '../../graphql/types';
import HeaderText from '../shared/header-text';
import TextGroup from '../shared/text-group';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  carePlan: FullPatientConcern[];
}

const styles = StyleSheet.create({
  container: {
    marginTop: variables.smallGutter,
  },
});

const MapSummary: React.StatelessComponent<IProps> = ({ carePlan }) => {
  const concernCount = carePlan.length;
  let goalCount = 0;
  let taskCount = 0;

  carePlan.forEach(concern => {
    goalCount += (concern.patientGoals || []).length;

    (concern.patientGoals || []).forEach(goal => {
      taskCount += (goal.tasks || []).length;
    });
  });

  return (
    <View style={styles.container}>
      <HeaderText label={copy.mapSummary} />
      <TextGroup label={copy.activeConcerns} value={concernCount} />
      <TextGroup label={copy.activeGoals} value={goalCount} />
      <TextGroup label={copy.activeTasks} value={taskCount} />
    </View>
  );
};

export default MapSummary;
