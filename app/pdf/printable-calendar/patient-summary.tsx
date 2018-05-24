import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import { FullCalendarEventFragment, FullPatientForProfileFragment } from '../../graphql/types';
import PatientHeader from '../shared/patient-header';
import variables from '../shared/variables/variables';
import Calendar from './calendar';

interface IProps {
  patient: FullPatientForProfileFragment;
  profilePhotoUrl: string | null;
  events: FullCalendarEventFragment[];
}

const styles = StyleSheet.create({
  container: {
    width: variables.half,
    borderRightWidth: variables.smallBorder,
    borderRightColor: variables.grayColor,
    flexDirection: variables.flexColumn,
    justifyContent: variables.flexSpaceBetween,
    paddingRight: variables.extraSmallGutter,
    paddingBottom: variables.smallGutter,
  },
});

const PatientSummary: React.StatelessComponent<IProps> = ({ patient, profilePhotoUrl, events }) => {
  return (
    <View style={styles.container}>
      <PatientHeader patient={patient} profilePhotoUrl={profilePhotoUrl} />
      <Calendar events={events} />
    </View>
  );
};

export default PatientSummary;
