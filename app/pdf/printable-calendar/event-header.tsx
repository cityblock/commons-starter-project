import { StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import { FullCalendarEventFragment } from '../../graphql/types';
import variables from '../shared/variables/variables';
import EventTime from './event-time';

interface IProps {
  calendarEvent: FullCalendarEventFragment;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 60,
    padding: variables.extraSmallGutter,
  },
  title: {
    paddingTop: variables.extraSmallGutter,
    color: variables.blackColor,
    fontFamily: variables.basetica,
    fontSize: variables.headerFontSize,
    textAlign: variables.flexStart,
  },
});

const EventHeader: React.StatelessComponent<IProps> = ({ calendarEvent }) => {
  return (
    <View style={styles.container}>
      <EventTime calendarEvent={calendarEvent} />
      <Text style={styles.title}>{calendarEvent.title}</Text>
    </View>
  );
};

export default EventHeader;
