import { StyleSheet, Text, View } from '@react-pdf/core';
import { differenceInMinutes, format } from 'date-fns';
import * as React from 'react';
import { FullCalendarEventFragment } from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  calendarEvent: FullCalendarEventFragment;
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
  },
  textGray: {
    ...textStyles,
    color: variables.darkGrayColor,
  },
  textBlue: {
    ...textStyles,
    color: variables.blueColor,
    paddingRight: variables.extraSmallGutter,
  },
});

const EventTime: React.StatelessComponent<IProps> = ({ calendarEvent }) => {
  const { startTime, startDate, endDate } = calendarEvent;

  const formattedTime = startTime ? format(startTime, 'h:mm a') : '';

  const duration = startTime && endDate ? differenceInMinutes(endDate, startTime) : null;
  const formattedDuration = ` (${duration} ${copy.minutes})`;

  const formattedDate = format(startDate, 'ddd, MMM D, YYYY');

  return (
    <View style={styles.flex}>
      <Text style={styles.textBlue}>{formattedDate}</Text>
      <Text style={styles.textGray}>{formattedTime}</Text>
      <Text style={styles.text}>{formattedDuration}</Text>
    </View>
  );
};

export default EventTime;
