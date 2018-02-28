import { StyleSheet, View } from '@react-pdf/core';
import * as React from 'react';
import { FullPatientConcernFragment, FullPatientForProfileFragment } from '../../graphql/types';
import BodyText from '../shared/body-text';
import variables from '../shared/variables/variables';
import copy from './copy/copy';
import MapSummary from './map-summary';
import PatientHeader from './patient-header';

interface IProps {
  patient: FullPatientForProfileFragment;
  carePlan: FullPatientConcernFragment[];
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

const PatientInfo: React.StatelessComponent<IProps> = ({ patient, carePlan }) => {
  return (
    <View style={styles.container}>
      <View>
        <PatientHeader patient={patient} />
        <BodyText label={copy.mapInfo} small={true} noMargin={true} />
      </View>
      <MapSummary carePlan={carePlan} />
    </View>
  );
};

export default PatientInfo;
