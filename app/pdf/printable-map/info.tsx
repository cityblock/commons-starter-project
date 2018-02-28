import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import {
  FullPatientConcernFragment,
  FullPatientForProfileFragment,
  FullUserFragment,
} from '../../graphql/types';
import Divider from '../shared/divider';
import variables from '../shared/variables/variables';
import PatientInfo from './patient-info';

interface IProps {
  patient: FullPatientForProfileFragment;
  careTeam: FullUserFragment[];
  carePlan: FullPatientConcernFragment[];
}

const styles = StyleSheet.create({
  container: {
    marginTop: variables.smallGutter,
  },
  main: {
    marginTop: variables.smallGutter,
    marginBottom: variables.smallGutter,
    flexDirection: variables.flexRow,
    justifyContent: variables.flexSpaceBetween,
  },
});

const Info: React.StatelessComponent<IProps> = ({ patient, careTeam, carePlan }) => {
  return (
    <View style={styles.container}>
      <Divider color="darkGray" />
      <View style={styles.main}>
        <PatientInfo patient={patient} carePlan={carePlan} />
      </View>
    </View>
  );
};

export default Info;
