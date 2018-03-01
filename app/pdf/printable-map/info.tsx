import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import {
  FullPatientConcernFragment,
  FullPatientForProfileFragment,
  FullUserFragment,
} from '../../graphql/types';
import variables from '../shared/variables/variables';
import CareTeam from './care-team';
import PatientInfo from './patient-info';

interface IProps {
  patient: FullPatientForProfileFragment;
  careTeam: FullUserFragment[];
  carePlan: FullPatientConcernFragment[];
}

const styles = StyleSheet.create({
  main: {
    flexDirection: variables.flexRow,
    justifyContent: variables.flexSpaceBetween,
    paddingTop: variables.smallGutter,
    marginBottom: variables.smallGutter,
  },
});

const Info: React.StatelessComponent<IProps> = ({ patient, careTeam, carePlan }) => {
  return (
    <View style={styles.main}>
      <PatientInfo patient={patient} carePlan={carePlan} />
      <CareTeam careTeam={careTeam} />
    </View>
  );
};

export default Info;
