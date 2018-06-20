import { StyleSheet, Text, View } from '@react-pdf/core';
import React from 'react';
import { FullPatientConcern, FullPatientForProfile } from '../../graphql/types';
import variables from '../shared/variables/variables';
import copy from './copy/copy';
import MapSummary from './map-summary';
import PatientHeader from './patient-header';

interface IProps {
  patient: FullPatientForProfile;
  carePlan: FullPatientConcern[];
  profilePhotoUrl: string | null;
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
  info: {
    fontFamily: variables.roboto,
    fontSize: variables.headerFontSize,
    lineHeight: variables.infoLineHeight,
    color: variables.blackColor,
    marginTop: variables.bodyMarginTop,
  },
});

const PatientInfo: React.StatelessComponent<IProps> = ({ patient, carePlan, profilePhotoUrl }) => {
  return (
    <View style={styles.container}>
      <View>
        <PatientHeader patient={patient} profilePhotoUrl={profilePhotoUrl} />
        <Text style={styles.info}>{copy.mapInfo}</Text>
      </View>
      <MapSummary carePlan={carePlan} />
    </View>
  );
};

export default PatientInfo;
