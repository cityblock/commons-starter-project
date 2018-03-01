import { StyleSheet, Text, View } from '@react-pdf/core';
import * as React from 'react';
import { FullPatientForProfileFragment } from '../../graphql/types';
import { formatPatientName } from '../../shared/helpers/format-helpers';
import variables from '../shared/variables/variables';
import copy from './copy/copy';

interface IProps {
  patient: FullPatientForProfileFragment;
}

const styles = StyleSheet.create({
  container: {
    position: variables.absolute,
    bottom: variables.mediumGutter,
    left: variables.smallGutter,
  },
  text: {
    fontFamily: variables.roboto,
    fontSize: variables.smallFontSize,
    color: variables.darkGrayColor,
  },
});

const Footer: React.StatelessComponent<IProps> = ({ patient }) => {
  const patientName = formatPatientName(patient);
  const footerText = `${copy.mapAbbrev} ${patientName}`;

  return (
    <View style={styles.container} fixed>
      <Text style={styles.text}>{footerText}</Text>
    </View>
  );
};

export default Footer;
