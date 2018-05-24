import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import { FullCalendarEventFragment } from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';
import EventDetail from './event-detail';
import EventHeader from './event-header';

interface IProps {
  calendarEvent: FullCalendarEventFragment;
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    borderWidth: variables.smallBorder,
    borderColor: variables.grayColor,
    marginTop: variables.smallGutter,
  },
  event: {
    borderTopWidth: 2,
    borderTopColor: variables.lightGrayColor,
    borderTopStyle: 'dashed',
    backgroundColor: variables.lighterGrayColor,
    paddingLeft: variables.extraSmallGutter,
    paddingRight: variables.extraSmallGutter,
    paddingBottom: variables.extraSmallGutter,
    color: variables.blackColor,
    fontFamily: variables.basetica,
    fontSize: variables.titleFontSize,
  },
});

const Event: React.StatelessComponent<IProps> = ({ calendarEvent }) => {
  const { description, location, guests } = calendarEvent;
  const descriptionElem = description ? (
    <EventDetail label={copy.notes} value={description} />
  ) : null;
  const guestsElem =
    guests && guests.length ? <EventDetail label={copy.guests} value={guests.join(', ')} /> : null;

  const eventDetailsElem = location ? (
    <View style={styles.event}>
      <EventDetail label={copy.location} value={location} />
      {guestsElem}
      {descriptionElem}
    </View>
  ) : null;

  return (
    <View style={styles.container}>
      <EventHeader calendarEvent={calendarEvent} />
      {eventDetailsElem}
    </View>
  );
};

export default Event;
