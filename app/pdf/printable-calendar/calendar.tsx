import { StyleSheet, Text } from '@react-pdf/core';
import * as React from 'react';
import { FullCalendarEventFragment } from '../../graphql/types';
import variables from '../shared/variables/variables';

interface IProps {
  events: FullCalendarEventFragment[];
}

const styles = StyleSheet.create({
  container: {
    marginTop: variables.smallGutter,
    height: 100,
    width: variables.full,
    borderWidth: variables.smallBorder,
    borderColor: variables.grayColor,
  },
});

const Calendar: React.StatelessComponent<IProps> = ({ events }) => {
  return <Text style={styles.container}>Calendar Goes Here</Text>;
};

export default Calendar;
