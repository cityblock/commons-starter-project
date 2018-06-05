import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import {
  FullCareTeamUserFragment,
  FullPatientConcernFragment,
  FullPatientForProfileFragment,
} from '../../graphql/types';
import variables from '../shared/variables/variables';
import CareTeam from './care-team';
import PatientInfo from './patient-info';

interface IProps {
  patient: FullPatientForProfileFragment;
  careTeam: FullCareTeamUserFragment[];
  carePlan: FullPatientConcernFragment[];
  profilePhotoUrl: string | null;
}

const styles = StyleSheet.create({
  main: {
    flexDirection: variables.flexRow,
    justifyContent: variables.flexSpaceBetween,
    paddingTop: variables.smallGutter,
    marginBottom: variables.smallGutter,
  },
});

const Info: React.StatelessComponent<IProps> = (props: IProps) => {
  const { patient, careTeam, carePlan, profilePhotoUrl } = props;

  return (
    <View style={styles.main}>
      <PatientInfo patient={patient} carePlan={carePlan} profilePhotoUrl={profilePhotoUrl} />
      <CareTeam careTeam={careTeam} />
    </View>
  );
};

export default Info;
