import { Document, Page, StyleSheet, View } from '@react-pdf/core';
import { format } from 'date-fns';
import * as React from 'react';
import {
  FullCalendarEventFragment,
  FullCareTeamUserFragment,
  FullPatientForProfileFragment,
} from '../../graphql/types';
import Divider from '../shared/divider';
import Empty from '../shared/empty';
import Footer from '../shared/footer';
import Header from '../shared/header';
import variables from '../shared/variables/variables';
import copy from './copy/copy';
import Event from './event';
import Info from './info';

interface IProps {
  events: FullCalendarEventFragment[];
  year: number;
  month: number;
  careTeam: FullCareTeamUserFragment[];
  patient: FullPatientForProfileFragment;
  profilePhotoUrl: string | null;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: variables.whiteColor,
    paddingBottom: variables.gutter,
  },
  container: {
    paddingRight: variables.smallGutter,
    paddingLeft: variables.smallGutter,
  },
  text: {
    color: variables.blackColor,
    fontFamily: variables.basetica,
    fontSize: variables.titleFontSize,
    textAlign: variables.flexCenter,
  },
});

const PrintableCalendar: React.StatelessComponent<IProps> = (props: IProps) => {
  const { careTeam, patient, profilePhotoUrl, year, month, events } = props;
  const date = new Date(year, month, 1);
  const formattedTitle = `${copy.title}: ${format(date, 'MMMM YYYY')}`;

  let renderedCalendar;
  if (events && events.length > 1) {
    renderedCalendar = events.map((event, i) => {
      return <Event key={`event-${i}`} calendarEvent={event} />;
    });
  } else if (events && events.length === 1) {
    renderedCalendar = <Event calendarEvent={events[0]} />;
  } else {
    renderedCalendar = <Empty label={copy.noEvents} />;
  }

  return (
    <Document title={copy.documentTitle}>
      <Page size="A4" style={styles.page} wrap>
        <Header title={formattedTitle} />
        <View style={styles.container}>
          <Divider color="darkGray" />
          <Info
            patient={patient}
            careTeam={careTeam}
            profilePhotoUrl={profilePhotoUrl}
            events={events}
          />
          {renderedCalendar}
        </View>
        <Footer patient={patient} title={copy.calendar} />
      </Page>
    </Document>
  );
};

export default PrintableCalendar;