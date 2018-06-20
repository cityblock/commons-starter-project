import { StyleSheet, Text, View } from '@react-pdf/core';
import { differenceInMinutes, format } from 'date-fns';
import React from 'react';
import { FullCalendarEvent } from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  calendarEvent: FullCalendarEvent;
}

const textStyles = {
  fontFamily: variables.roboto,
  fontSize: variables.smallFontSize,
  flexShrink: 0,
};

const styles = StyleSheet.create({
  flex: {
    flexDirection: variables.flexRow,
    width: variables.full,
    minWidth: 170,
    justifyContent: variables.flexStart,
    height: 10,
  },
  text: {
    ...textStyles,
    color: variables.grayColor,
    minWidth: 30,
  },
  textGray: {
    ...textStyles,
    color: variables.darkGrayColor,
    minWidth: 30,
  },
  textBlue: {
    ...textStyles,
    color: variables.blueColor,
    paddingRight: variables.extraSmallGutter,
    minWidth: 100,
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
