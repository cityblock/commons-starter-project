import { Image, StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import { FullPatientForProfileFragment } from '../../graphql/types';
import { formatFullName } from '../../shared/helpers/format-helpers';
import HeaderText from '../shared/header-text';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  patient: FullPatientForProfileFragment;
  profilePhotoUrl: string | null;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: variables.flexRow,
    alignItems: variables.flexCenter,
    marginBottom: variables.extraSmallGutter,
  },
  image: {
    height: variables.imageHeightSmall,
    marginRight: variables.extraSmallGutter,
  },
  patient: {
    height: variables.imageHeightSmall,
    flexDirection: variables.flexColumn,
    justifyContent: variables.flexSpaceBetween,
  },
  title: {
    color: variables.blackColor,
    fontFamily: variables.basetica,
    fontSize: variables.titleFontSize,
    height: variables.titleFontSize,
  },
});

const PatientHeader: React.StatelessComponent<IProps> = ({ patient, profilePhotoUrl }) => {
  const patientName = formatFullName(patient.firstName, patient.lastName);

  return (
    <View style={styles.container}>
      {profilePhotoUrl && <Image src={profilePhotoUrl} style={styles.image} />}
      <View style={styles.patient}>
        <HeaderText label={copy.member} />
        <Text style={styles.title}>{patientName}</Text>
      </View>
    </View>
  );
};

export default PatientHeader;
