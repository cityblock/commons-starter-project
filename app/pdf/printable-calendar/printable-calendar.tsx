import { Document, Page, StyleSheet, View } from '@react-pdf/core';
import { format } from 'date-fns';
import React from 'react';
import { FullCalendarEvent, FullCareTeamUser, FullPatientForProfile } from '../../graphql/types';
import Divider from '../shared/divider';
import Empty from '../shared/empty';
import Footer from '../shared/footer';
import Header from '../shared/header';
import variables from '../shared/variables/variables';
import CareTeam from './care-team';
import copy from './copy/copy';
import Event from './event';
import PatientHeader from './patient-header';

interface IProps {
  events: FullCalendarEvent[];
  year: number;
  month: number;
  careTeam: FullCareTeamUser[];
  patient: FullPatientForProfile;
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
          <PatientHeader patient={patient} profilePhotoUrl={profilePhotoUrl} />
          <CareTeam careTeam={careTeam} />
          {renderedCalendar}
        </View>
        <Footer patient={patient} title={copy.calendar} />
      </Page>
    </Document>
  );
};

export default PrintableCalendar;
