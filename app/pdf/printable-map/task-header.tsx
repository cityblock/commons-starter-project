import { StyleSheet, Text, View } from '@react-pdf/core';
import { format } from 'date-fns';
import React from 'react';
import { ShortTaskFragment } from '../../graphql/types';
import { formatFullName } from '../../shared/helpers/format-helpers';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  task: ShortTaskFragment;
}

const textStyles = {
  fontFamily: variables.roboto,
  fontSize: variables.smallFontSize,
};

const styles = StyleSheet.create({
  flex: {
    flexDirection: variables.flexRow,
  },
  text: {
    ...textStyles,
    color: variables.grayColor,
    width: '40%',
  },
  textBlack: {
    ...textStyles,
    color: variables.blackColor,
    width: '60%',
    textAlign: 'right',
  },
});

const TaskHeader: React.StatelessComponent<IProps> = ({ task }) => {
  let priorityLabel = '';

  if (task.priority === 'high') {
    priorityLabel = copy.priorityhigh;
  } else if (task.priority === 'medium') {
    priorityLabel = copy.prioritymedium;
  } else if (task.priority === 'low') {
    priorityLabel = copy.prioritylow;
  }

  const assignee = task.assignedTo
    ? formatFullName(task.assignedTo.firstName, task.assignedTo.lastName)
    : copy.noAssignee;
  const dueDate = task.dueAt ? format(task.dueAt, 'ddd, MMM D, YYYY') : copy.noDueDate;

  const taskPriority = `${priorityLabel}${copy.task}`;
  const taskInfo = `${copy.assignedTo} ${assignee}    ${copy.due} ${dueDate}`;

  return (
    <View style={styles.flex}>
      <Text style={styles.text}>{taskPriority}</Text>
      <Text style={styles.textBlack}>{taskInfo}</Text>
    </View>
  );
};

export default TaskHeader;
