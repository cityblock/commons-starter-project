import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import {
  FullCalendarEventFragment,
  FullCareTeamUserFragment,
  FullPatientForProfileFragment,
} from '../../graphql/types';
import CareTeam from '../shared/care-team';
import variables from '../shared/variables/variables';
import PatientSummary from './patient-summary';

interface IProps {
  patient: FullPatientForProfileFragment;
  careTeam: FullCareTeamUserFragment[];
  profilePhotoUrl: string | null;
  events: FullCalendarEventFragment[];
}

const styles = StyleSheet.create({
  main: {
    flexDirection: variables.flexRow,
    justifyContent: variables.flexStart,
    paddingTop: variables.smallGutter,
  },
});

const Info: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient, careTeam, profilePhotoUrl, events } = props;

  return (
    <View style={styles.main}>
      <PatientSummary patient={patient} profilePhotoUrl={profilePhotoUrl} events={events} />
      <CareTeam careTeam={careTeam} />
    </View>
  );
};

export default Info;
