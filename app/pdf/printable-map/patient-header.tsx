import { Image, StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import { FullPatientForProfileFragment } from '../../graphql/types';
import { formatPatientName } from '../../shared/helpers/format-helpers';
import HeaderText from '../shared/header-text';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

const AVATAR_PATH = `https://pm1.narvii.com/6055/a3f14b67fc9941a06baa0fe907ecf3aa135b8484_hq.jpg`;

interface IProps {
  patient: FullPatientForProfileFragment;
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

const PatientHeader: React.StatelessComponent<IProps> = ({ patient }) => {
  const patientName = formatPatientName(patient);

  return (
    <View style={styles.container}>
      <Image src={AVATAR_PATH} style={styles.image} />
      <View style={styles.patient}>
        <HeaderText label={copy.member} />
        <Text style={styles.title}>{patientName}</Text>
      </View>
    </View>
  );
};

export default PatientHeader;
