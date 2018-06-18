import { StyleSheet, Text, View } from '@react-pdf/core';
import React from 'react';
import { ShortTaskFragment } from '../../graphql/types';
import variables from '../shared/variables/variables';
import TaskHeader from './task-header';

interface IProps {
  task: ShortTaskFragment;
  isLastInConcern: boolean; // adds extra margin if last in concern
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: variables.mediumBorder,
    borderLeftColor: variables.whiteColor,
    borderLeftStyle: variables.solid,
    borderRightWidth: variables.smallBorder,
    borderRightColor: variables.grayColor,
    borderRightStyle: variables.solid,
    padding: variables.bodyMarginTop,
  },
  high: {
    borderLeftColor: variables.redColor,
  },
  medium: {
    borderLeftColor: variables.yellowColor,
  },
  low: {
    borderLeftColor: variables.grayColor,
  },
  noPriority: {
    borderLeftColor: variables.grayColor,
    borderLeftWidth: variables.smallBorder,
    paddingLeft: variables.bodyMarginTop + 2,
  },
  title: {
    fontFamily: variables.basetica,
    fontSize: variables.bodyFontSize,
    marginTop: variables.bodyMarginTop,
    color: variables.blackColor,
  },
  borderTop: {
    borderTopWidth: variables.smallBorder,
    borderTopColor: variables.grayColor,
    borderTopStyle: variables.dashed,
  },
  borderBottom: {
    borderBottomWidth: variables.smallBorder,
    borderBottomColor: variables.grayColor,
    borderBottomStyle: variables.solid,
  },
  marginBottom: {
    marginBottom: variables.mediumGutter,
  },
});

const Task: React.StatelessComponent<IProps> = ({ task, isLastInConcern }) => {
  const containerStyle = task.priority
    ? { ...styles.container, ...styles[task.priority] }
    : { ...styles.container, ...styles.noPriority };

  return (
    <View style={isLastInConcern ? styles.marginBottom : ''}>
      <View style={styles.borderTop} />
      <View style={containerStyle}>
        <TaskHeader task={task} />
        <Text style={styles.title}>{task.title}</Text>
      </View>
      {isLastInConcern && <View style={styles.borderBottom} />}
    </View>
  );
};

export default Task;
